#!/bin/bash
# Healthcare SaaS Database Backup Script
# Runs daily to create encrypted backups of the PostgreSQL database

set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-healthcare_saas}"
DB_USER="${DB_USER:-healthcare_user}"
RETENTION_DAYS=30
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"

# Create backup directory with date
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${DATE}"
mkdir -p "${BACKUP_PATH}"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "${BACKUP_DIR}/backup.log"
}

# Error handler
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Check if PostgreSQL is ready
check_postgres() {
    log "Checking PostgreSQL connection..."
    for i in {1..30}; do
        if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
            log "PostgreSQL is ready"
            return 0
        fi
        log "Waiting for PostgreSQL... (attempt $i/30)"
        sleep 2
    done
    error_exit "PostgreSQL is not ready after 60 seconds"
}

# Perform backup
perform_backup() {
    log "Starting backup for database: $DB_NAME"
    
    # Full database dump
    DUMP_FILE="${BACKUP_PATH}/${DB_NAME}_${DATE}.sql"
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose --no-owner --no-privileges --clean --if-exists \
        > "$DUMP_FILE" 2>"${BACKUP_PATH}/backup_errors.log"; then
        log "Database dump completed successfully"
    else
        error_exit "Database dump failed. Check ${BACKUP_PATH}/backup_errors.log"
    fi
    
    # Compress the dump
    log "Compressing backup..."
    if gzip -9 "$DUMP_FILE"; then
        log "Compression completed"
        DUMP_FILE="${DUMP_FILE}.gz"
    else
        error_exit "Compression failed"
    fi
    
    # Encrypt if encryption key is provided
    if [ -n "$ENCRYPTION_KEY" ]; then
        log "Encrypting backup..."
        ENCRYPTED_FILE="${DUMP_FILE}.enc"
        if openssl enc -aes-256-cbc -salt -in "$DUMP_FILE" -out "$ENCRYPTED_FILE" \
            -k "$ENCRYPTION_KEY" 2>/dev/null; then
            log "Encryption completed"
            rm -f "$DUMP_FILE"
            DUMP_FILE="$ENCRYPTED_FILE"
        else
            error_exit "Encryption failed"
        fi
    fi
    
    # Calculate checksum
    log "Calculating checksum..."
    sha256sum "$DUMP_FILE" > "${DUMP_FILE}.sha256"
    
    # Log backup details
    BACKUP_SIZE=$(du -h "$DUMP_FILE" | cut -f1)
    log "Backup completed: $DUMP_FILE (Size: $BACKUP_SIZE)"
    
    # Create backup metadata
    cat > "${BACKUP_PATH}/metadata.json" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "database": "$DB_NAME",
    "host": "$DB_HOST",
    "size": "$BACKUP_SIZE",
    "encrypted": $([ -n "$ENCRYPTION_KEY" ] && echo "true" || echo "false"),
    "checksum_file": "$(basename "${DUMP_FILE}.sha256")",
    "backup_file": "$(basename "$DUMP_FILE")"
}
EOF
}

# Clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (retention: $RETENTION_DAYS days)..."
    
    # Find and remove old backup directories
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "20*" -mtime +$RETENTION_DAYS | while read -r old_backup; do
        log "Removing old backup: $old_backup"
        rm -rf "$old_backup"
    done
    
    # Clean old log entries
    if [ -f "${BACKUP_DIR}/backup.log" ]; then
        # Keep only last 1000 lines
        tail -n 1000 "${BACKUP_DIR}/backup.log" > "${BACKUP_DIR}/backup.log.tmp"
        mv "${BACKUP_DIR}/backup.log.tmp" "${BACKUP_DIR}/backup.log"
    fi
}

# Verify backup
verify_backup() {
    log "Verifying backup integrity..."
    
    # Check if backup file exists
    if [ ! -f "$DUMP_FILE" ]; then
        error_exit "Backup file not found: $DUMP_FILE"
    fi
    
    # Verify checksum
    if sha256sum -c "${DUMP_FILE}.sha256" >/dev/null 2>&1; then
        log "Backup integrity verified"
    else
        error_exit "Backup integrity check failed"
    fi
    
    # Test restore (optional, can be enabled for critical systems)
    # This creates a test database and attempts to restore the backup
    if [ "${TEST_RESTORE:-false}" = "true" ]; then
        log "Testing backup restore..."
        TEST_DB="${DB_NAME}_restore_test_${DATE}"
        
        # Create test database
        createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$TEST_DB" || true
        
        # Decrypt if necessary
        RESTORE_FILE="$DUMP_FILE"
        if [[ "$DUMP_FILE" == *.enc ]]; then
            TEMP_DECRYPT="/tmp/test_restore_${DATE}.sql.gz"
            openssl enc -aes-256-cbc -d -in "$DUMP_FILE" -out "$TEMP_DECRYPT" -k "$ENCRYPTION_KEY"
            RESTORE_FILE="$TEMP_DECRYPT"
        fi
        
        # Test restore
        if gunzip -c "$RESTORE_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_DB" >/dev/null 2>&1; then
            log "Restore test successful"
            # Clean up test database
            dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$TEST_DB"
        else
            # Clean up test database
            dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$TEST_DB" 2>/dev/null || true
            error_exit "Restore test failed"
        fi
        
        # Clean up temporary file
        [ -f "$TEMP_DECRYPT" ] && rm -f "$TEMP_DECRYPT"
    fi
}

# Send notification (can be extended to send email/Slack notifications)
send_notification() {
    local status=$1
    local message=$2
    
    # Log the status
    log "Backup status: $status - $message"
    
    # Create status file for monitoring
    cat > "${BACKUP_DIR}/last_backup_status.json" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "status": "$status",
    "message": "$message",
    "backup_path": "${BACKUP_PATH}",
    "next_run": "$(date -u -d '+1 day' +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    
    # Here you can add email/Slack notifications
    # Example: curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"Backup $status: $message\"}" \
    #   "$SLACK_WEBHOOK_URL"
}

# Main execution
main() {
    log "=== Starting Healthcare SaaS backup process ==="
    
    # Check prerequisites
    check_postgres
    
    # Perform backup
    if perform_backup; then
        # Verify the backup
        if verify_backup; then
            # Clean old backups
            cleanup_old_backups
            
            # Success notification
            send_notification "SUCCESS" "Backup completed successfully at ${BACKUP_PATH}"
            log "=== Backup process completed successfully ==="
            exit 0
        else
            send_notification "FAILED" "Backup verification failed"
            exit 1
        fi
    else
        send_notification "FAILED" "Backup creation failed"
        exit 1
    fi
}

# Run main function
main