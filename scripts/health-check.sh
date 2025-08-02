#!/bin/bash
# Healthcare SaaS Health Check Script
# Comprehensive health monitoring for all services

set -euo pipefail

# Configuration
API_URL="${API_URL:-http://localhost:3001}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
NGINX_URL="${NGINX_URL:-http://localhost}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-healthcare_user}"
DB_NAME="${DB_NAME:-healthcare_saas}"
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# Status codes
STATUS_OK=0
STATUS_WARNING=1
STATUS_CRITICAL=2
STATUS_UNKNOWN=3

# Global status
OVERALL_STATUS=$STATUS_OK
HEALTH_REPORT=""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update overall status
update_status() {
    local new_status=$1
    if [ $new_status -gt $OVERALL_STATUS ]; then
        OVERALL_STATUS=$new_status
    fi
}

# Add to health report
add_report() {
    local service=$1
    local status=$2
    local message=$3
    local details=${4:-""}
    
    local status_text=""
    local color=""
    
    case $status in
        $STATUS_OK)
            status_text="OK"
            color=$GREEN
            ;;
        $STATUS_WARNING)
            status_text="WARNING"
            color=$YELLOW
            ;;
        $STATUS_CRITICAL)
            status_text="CRITICAL"
            color=$RED
            ;;
        *)
            status_text="UNKNOWN"
            color=$YELLOW
            ;;
    esac
    
    echo -e "${color}[$status_text]${NC} $service: $message"
    
    HEALTH_REPORT+="Service: $service\n"
    HEALTH_REPORT+="Status: $status_text\n"
    HEALTH_REPORT+="Message: $message\n"
    if [ -n "$details" ]; then
        HEALTH_REPORT+="Details: $details\n"
    fi
    HEALTH_REPORT+="\n"
}

# Check nginx health
check_nginx() {
    echo "Checking Nginx..."
    
    # Check if nginx is responding
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$NGINX_URL/health" 2>/dev/null); then
        if [ "$response" = "200" ]; then
            add_report "Nginx" $STATUS_OK "Service is healthy"
        else
            add_report "Nginx" $STATUS_WARNING "Unexpected response code: $response"
            update_status $STATUS_WARNING
        fi
    else
        add_report "Nginx" $STATUS_CRITICAL "Service is not responding"
        update_status $STATUS_CRITICAL
        return
    fi
    
    # Check nginx status endpoint
    if nginx_status=$(curl -s "$NGINX_URL/nginx-status" 2>/dev/null); then
        active_connections=$(echo "$nginx_status" | grep "Active connections" | awk '{print $3}')
        add_report "Nginx Metrics" $STATUS_OK "Active connections: $active_connections" "$nginx_status"
    fi
}

# Check frontend health
check_frontend() {
    echo "Checking Frontend..."
    
    # Check if frontend is responding
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/api/health" 2>/dev/null); then
        if [ "$response" = "200" ]; then
            add_report "Frontend" $STATUS_OK "Service is healthy"
        else
            add_report "Frontend" $STATUS_WARNING "Unexpected response code: $response"
            update_status $STATUS_WARNING
        fi
    else
        add_report "Frontend" $STATUS_CRITICAL "Service is not responding"
        update_status $STATUS_CRITICAL
        return
    fi
    
    # Check static assets
    if curl -s -o /dev/null "$FRONTEND_URL/_next/static/chunks/webpack.js" 2>/dev/null; then
        add_report "Frontend Assets" $STATUS_OK "Static assets are accessible"
    else
        add_report "Frontend Assets" $STATUS_WARNING "Static assets may not be properly served"
        update_status $STATUS_WARNING
    fi
}

# Check API health
check_api() {
    echo "Checking API..."
    
    # Check basic health endpoint
    if health_response=$(curl -s "$API_URL/health" 2>/dev/null); then
        if echo "$health_response" | grep -q "ok"; then
            add_report "API" $STATUS_OK "Service is healthy"
        else
            add_report "API" $STATUS_WARNING "Health check returned unexpected response"
            update_status $STATUS_WARNING
        fi
    else
        add_report "API" $STATUS_CRITICAL "Service is not responding"
        update_status $STATUS_CRITICAL
        return
    fi
    
    # Check API detailed health
    if detailed_health=$(curl -s "$API_URL/health/detailed" 2>/dev/null); then
        # Parse JSON response
        db_status=$(echo "$detailed_health" | grep -o '"database":"[^"]*"' | cut -d'"' -f4)
        redis_status=$(echo "$detailed_health" | grep -o '"redis":"[^"]*"' | cut -d'"' -f4)
        
        if [ "$db_status" = "connected" ]; then
            add_report "API Database Connection" $STATUS_OK "Connected to database"
        else
            add_report "API Database Connection" $STATUS_CRITICAL "Database connection failed"
            update_status $STATUS_CRITICAL
        fi
        
        if [ "$redis_status" = "connected" ]; then
            add_report "API Redis Connection" $STATUS_OK "Connected to Redis"
        else
            add_report "API Redis Connection" $STATUS_WARNING "Redis connection failed"
            update_status $STATUS_WARNING
        fi
    fi
}

# Check database health
check_database() {
    echo "Checking Database..."
    
    # Check if PostgreSQL is running
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
        add_report "PostgreSQL" $STATUS_OK "Service is accepting connections"
    else
        add_report "PostgreSQL" $STATUS_CRITICAL "Service is not accepting connections"
        update_status $STATUS_CRITICAL
        return
    fi
    
    # Check database size and connections
    if [ -n "${PGPASSWORD:-}" ]; then
        # Get database size
        db_size=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
            "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" 2>/dev/null | xargs)
        
        # Get connection count
        conn_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
            "SELECT count(*) FROM pg_stat_activity WHERE datname='$DB_NAME';" 2>/dev/null | xargs)
        
        # Get slow queries count
        slow_queries=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c \
            "SELECT count(*) FROM pg_stat_statements WHERE mean_exec_time > 1000;" 2>/dev/null | xargs || echo "0")
        
        add_report "Database Metrics" $STATUS_OK \
            "Size: $db_size, Connections: $conn_count, Slow queries: $slow_queries"
        
        # Check connection limit
        if [ "$conn_count" -gt 80 ]; then
            add_report "Database Connections" $STATUS_WARNING "High connection count: $conn_count"
            update_status $STATUS_WARNING
        fi
    fi
}

# Check Redis health
check_redis() {
    echo "Checking Redis..."
    
    # Check if Redis is responding
    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping >/dev/null 2>&1; then
        add_report "Redis" $STATUS_OK "Service is responding to ping"
    else
        add_report "Redis" $STATUS_CRITICAL "Service is not responding"
        update_status $STATUS_CRITICAL
        return
    fi
    
    # Get Redis info
    if redis_info=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" INFO 2>/dev/null); then
        # Extract key metrics
        used_memory=$(echo "$redis_info" | grep "used_memory_human:" | cut -d: -f2 | tr -d '\r')
        connected_clients=$(echo "$redis_info" | grep "connected_clients:" | cut -d: -f2 | tr -d '\r')
        
        add_report "Redis Metrics" $STATUS_OK \
            "Memory: $used_memory, Clients: $connected_clients"
    fi
}

# Check disk space
check_disk_space() {
    echo "Checking Disk Space..."
    
    # Check main partition
    disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    disk_info=$(df -h / | tail -1)
    
    if [ "$disk_usage" -lt 80 ]; then
        add_report "Disk Space" $STATUS_OK "Usage: ${disk_usage}%" "$disk_info"
    elif [ "$disk_usage" -lt 90 ]; then
        add_report "Disk Space" $STATUS_WARNING "High usage: ${disk_usage}%" "$disk_info"
        update_status $STATUS_WARNING
    else
        add_report "Disk Space" $STATUS_CRITICAL "Critical usage: ${disk_usage}%" "$disk_info"
        update_status $STATUS_CRITICAL
    fi
    
    # Check Docker volumes
    if command -v docker >/dev/null 2>&1; then
        docker_usage=$(docker system df --format "table {{.Type}}\t{{.Size}}\t{{.Reclaimable}}" 2>/dev/null)
        add_report "Docker Storage" $STATUS_OK "Docker volume usage checked" "$docker_usage"
    fi
}

# Check memory usage
check_memory() {
    echo "Checking Memory..."
    
    if command -v free >/dev/null 2>&1; then
        memory_info=$(free -h)
        used_percent=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
        
        if [ "$used_percent" -lt 80 ]; then
            add_report "Memory" $STATUS_OK "Usage: ${used_percent}%" "$memory_info"
        elif [ "$used_percent" -lt 90 ]; then
            add_report "Memory" $STATUS_WARNING "High usage: ${used_percent}%" "$memory_info"
            update_status $STATUS_WARNING
        else
            add_report "Memory" $STATUS_CRITICAL "Critical usage: ${used_percent}%" "$memory_info"
            update_status $STATUS_CRITICAL
        fi
    fi
}

# Check SSL certificates
check_ssl_certificates() {
    echo "Checking SSL Certificates..."
    
    cert_file="/etc/nginx/ssl/cert.pem"
    if [ -f "$cert_file" ]; then
        # Check certificate expiration
        expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" 2>/dev/null | cut -d= -f2)
        expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$expiry_date" +%s)
        current_epoch=$(date +%s)
        days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
        
        if [ $days_until_expiry -gt 30 ]; then
            add_report "SSL Certificate" $STATUS_OK "Valid for $days_until_expiry days"
        elif [ $days_until_expiry -gt 7 ]; then
            add_report "SSL Certificate" $STATUS_WARNING "Expires in $days_until_expiry days"
            update_status $STATUS_WARNING
        else
            add_report "SSL Certificate" $STATUS_CRITICAL "Expires in $days_until_expiry days!"
            update_status $STATUS_CRITICAL
        fi
    else
        add_report "SSL Certificate" $STATUS_WARNING "Certificate file not found"
        update_status $STATUS_WARNING
    fi
}

# Check backup status
check_backups() {
    echo "Checking Backups..."
    
    backup_dir="/backups"
    if [ -d "$backup_dir" ]; then
        # Find latest backup
        latest_backup=$(find "$backup_dir" -name "*.sql.gz*" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
        
        if [ -n "$latest_backup" ]; then
            backup_age_seconds=$(( $(date +%s) - $(stat -c %Y "$latest_backup" 2>/dev/null || stat -f %m "$latest_backup") ))
            backup_age_hours=$(( backup_age_seconds / 3600 ))
            
            if [ $backup_age_hours -lt 25 ]; then
                add_report "Backups" $STATUS_OK "Last backup: $backup_age_hours hours ago"
            elif [ $backup_age_hours -lt 48 ]; then
                add_report "Backups" $STATUS_WARNING "Last backup: $backup_age_hours hours ago"
                update_status $STATUS_WARNING
            else
                add_report "Backups" $STATUS_CRITICAL "Last backup: $backup_age_hours hours ago"
                update_status $STATUS_CRITICAL
            fi
        else
            add_report "Backups" $STATUS_CRITICAL "No backups found"
            update_status $STATUS_CRITICAL
        fi
    else
        add_report "Backups" $STATUS_WARNING "Backup directory not found"
        update_status $STATUS_WARNING
    fi
}

# Generate JSON report
generate_json_report() {
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local status_text=""
    
    case $OVERALL_STATUS in
        $STATUS_OK) status_text="OK" ;;
        $STATUS_WARNING) status_text="WARNING" ;;
        $STATUS_CRITICAL) status_text="CRITICAL" ;;
        *) status_text="UNKNOWN" ;;
    esac
    
    cat > health_status.json <<EOF
{
  "timestamp": "$timestamp",
  "overall_status": "$status_text",
  "status_code": $OVERALL_STATUS,
  "services": {
    "nginx": "$(grep -A1 "Service: Nginx$" <<< "$HEALTH_REPORT" | grep "Status:" | cut -d' ' -f2)",
    "frontend": "$(grep -A1 "Service: Frontend$" <<< "$HEALTH_REPORT" | grep "Status:" | cut -d' ' -f2)",
    "api": "$(grep -A1 "Service: API$" <<< "$HEALTH_REPORT" | grep "Status:" | cut -d' ' -f2)",
    "database": "$(grep -A1 "Service: PostgreSQL$" <<< "$HEALTH_REPORT" | grep "Status:" | cut -d' ' -f2)",
    "redis": "$(grep -A1 "Service: Redis$" <<< "$HEALTH_REPORT" | grep "Status:" | cut -d' ' -f2)"
  }
}
EOF
}

# Main function
main() {
    echo "=== Healthcare SaaS Health Check ==="
    echo "Time: $(date)"
    echo ""
    
    # Run all checks
    check_nginx
    check_frontend
    check_api
    check_database
    check_redis
    check_disk_space
    check_memory
    check_ssl_certificates
    check_backups
    
    echo ""
    echo "=== Overall Status ==="
    
    case $OVERALL_STATUS in
        $STATUS_OK)
            echo -e "${GREEN}All systems operational${NC}"
            ;;
        $STATUS_WARNING)
            echo -e "${YELLOW}System operational with warnings${NC}"
            ;;
        $STATUS_CRITICAL)
            echo -e "${RED}Critical issues detected${NC}"
            ;;
        *)
            echo -e "${YELLOW}Unknown status${NC}"
            ;;
    esac
    
    # Generate reports
    generate_json_report
    
    # Save detailed report
    echo -e "$HEALTH_REPORT" > health_report.txt
    
    exit $OVERALL_STATUS
}

# Run main function
main "$@"