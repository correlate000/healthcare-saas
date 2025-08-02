#!/bin/bash
# Healthcare SaaS Deployment Script
# Automated deployment with health checks and rollback capability

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="healthcare-saas"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"
BACKUP_BEFORE_DEPLOY="${BACKUP_BEFORE_DEPLOY:-true}"
HEALTH_CHECK_TIMEOUT=300
ROLLBACK_ON_FAILURE="${ROLLBACK_ON_FAILURE:-true}"

# Log function
log() {
    echo -e "${2:-$BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a deploy.log
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a deploy.log
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}" | tee -a deploy.log
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a deploy.log
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check environment file
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file not found: $ENV_FILE"
        error "Please create .env file from .env.example"
        exit 1
    fi
    
    # Validate environment variables
    required_vars=(
        "DB_PASSWORD"
        "REDIS_PASSWORD"
        "JWT_SECRET"
        "JWT_REFRESH_SECRET"
        "ENCRYPTION_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$ENV_FILE"; then
            error "Required environment variable not set: $var"
            exit 1
        fi
    done
    
    success "Prerequisites check passed"
}

# Create required directories
create_directories() {
    log "Creating required directories..."
    
    directories=(
        "uploads"
        "logs/api"
        "logs/frontend"
        "logs/nginx"
        "backups"
        "nginx/ssl"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        log "Created directory: $dir"
    done
    
    # Set appropriate permissions
    chmod 755 uploads
    chmod 755 logs
    chmod 755 backups
    
    success "Directories created"
}

# Generate SSL certificates (self-signed for development)
generate_ssl_certificates() {
    log "Checking SSL certificates..."
    
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        warning "SSL certificates not found. Generating self-signed certificates..."
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Healthcare SaaS/CN=healthcare-saas.jp"
        
        # Generate DH parameters
        openssl dhparam -out nginx/ssl/dhparam.pem 2048
        
        # Create chain file (same as cert for self-signed)
        cp nginx/ssl/cert.pem nginx/ssl/chain.pem
        
        success "SSL certificates generated"
    else
        log "SSL certificates found"
    fi
}

# Backup current deployment
backup_current_deployment() {
    if [ "$BACKUP_BEFORE_DEPLOY" = "true" ]; then
        log "Creating backup of current deployment..."
        
        # Create backup directory
        BACKUP_DIR="backups/deploy_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # Backup database
        if docker-compose ps postgres | grep -q "Up"; then
            log "Backing up database..."
            docker-compose exec -T postgres pg_dump -U healthcare_user healthcare_saas > "$BACKUP_DIR/database.sql"
            gzip "$BACKUP_DIR/database.sql"
            success "Database backed up"
        fi
        
        # Backup volumes
        log "Backing up volumes..."
        docker run --rm \
            -v ${PROJECT_NAME}_postgres_data:/data/postgres \
            -v ${PROJECT_NAME}_redis_data:/data/redis \
            -v $(pwd)/$BACKUP_DIR:/backup \
            alpine tar czf /backup/volumes.tar.gz /data
        
        # Save current image tags
        docker-compose images --quiet | xargs docker inspect -f '{{.RepoTags}}' > "$BACKUP_DIR/images.txt"
        
        success "Backup completed: $BACKUP_DIR"
    fi
}

# Build images
build_images() {
    log "Building Docker images..."
    
    # Build with cache
    if docker-compose build --parallel; then
        success "Images built successfully"
    else
        error "Failed to build images"
        exit 1
    fi
    
    # Tag images with version
    VERSION=$(git describe --tags --always || echo "latest")
    docker-compose images --quiet | while read image; do
        docker tag "$image" "${image}:${VERSION}"
    done
}

# Deploy services
deploy_services() {
    log "Deploying services..."
    
    # Pull latest images if using external registry
    # docker-compose pull
    
    # Start services with health checks
    if docker-compose up -d; then
        success "Services started"
    else
        error "Failed to start services"
        exit 1
    fi
}

# Wait for service health
wait_for_health() {
    local service=$1
    local timeout=$2
    local elapsed=0
    
    log "Waiting for $service to be healthy..."
    
    while [ $elapsed -lt $timeout ]; do
        if docker-compose ps "$service" | grep -q "healthy"; then
            success "$service is healthy"
            return 0
        fi
        
        sleep 5
        elapsed=$((elapsed + 5))
        echo -n "."
    done
    
    error "$service failed to become healthy within $timeout seconds"
    return 1
}

# Check all services health
check_services_health() {
    log "Checking services health..."
    
    services=("postgres" "redis" "api" "frontend" "nginx")
    
    for service in "${services[@]}"; do
        if ! wait_for_health "$service" "$HEALTH_CHECK_TIMEOUT"; then
            error "Service health check failed: $service"
            
            # Show service logs
            log "Showing logs for $service:"
            docker-compose logs --tail=50 "$service"
            
            return 1
        fi
    done
    
    success "All services are healthy"
    return 0
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    # Test frontend
    if curl -f -s -o /dev/null "http://localhost"; then
        success "Frontend is accessible"
    else
        error "Frontend is not accessible"
        return 1
    fi
    
    # Test API health endpoint
    if curl -f -s -o /dev/null "http://localhost/api/health"; then
        success "API is accessible"
    else
        error "API is not accessible"
        return 1
    fi
    
    # Test database connection
    if docker-compose exec -T postgres pg_isready -U healthcare_user; then
        success "Database is accessible"
    else
        error "Database is not accessible"
        return 1
    fi
    
    # Test Redis
    if docker-compose exec -T redis redis-cli ping | grep -q PONG; then
        success "Redis is accessible"
    else
        error "Redis is not accessible"
        return 1
    fi
    
    success "All smoke tests passed"
    return 0
}

# Rollback deployment
rollback_deployment() {
    error "Rolling back deployment..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t backups/deploy_* 2>/dev/null | head -1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        error "No backup found for rollback"
        return 1
    fi
    
    log "Rolling back to: $LATEST_BACKUP"
    
    # Stop current services
    docker-compose down
    
    # Restore database
    if [ -f "$LATEST_BACKUP/database.sql.gz" ]; then
        log "Restoring database..."
        docker-compose up -d postgres
        wait_for_health "postgres" 60
        gunzip -c "$LATEST_BACKUP/database.sql.gz" | docker-compose exec -T postgres psql -U healthcare_user healthcare_saas
    fi
    
    # Restore volumes
    if [ -f "$LATEST_BACKUP/volumes.tar.gz" ]; then
        log "Restoring volumes..."
        docker run --rm \
            -v ${PROJECT_NAME}_postgres_data:/data/postgres \
            -v ${PROJECT_NAME}_redis_data:/data/redis \
            -v $(pwd)/$LATEST_BACKUP:/backup \
            alpine tar xzf /backup/volumes.tar.gz -C /
    fi
    
    # Start services
    docker-compose up -d
    
    warning "Rollback completed. Please verify system functionality."
}

# Clean up old resources
cleanup_resources() {
    log "Cleaning up old resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove old backup files (keep last 5)
    ls -t backups/deploy_* 2>/dev/null | tail -n +6 | xargs -r rm -rf
    
    # Clean old logs
    find logs -name "*.log" -mtime +30 -delete
    
    success "Cleanup completed"
}

# Generate deployment report
generate_report() {
    local status=$1
    
    REPORT_FILE="deploy_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Healthcare SaaS Deployment Report"
        echo "================================="
        echo "Date: $(date)"
        echo "Status: $status"
        echo ""
        echo "Git Information:"
        echo "  Branch: $(git rev-parse --abbrev-ref HEAD)"
        echo "  Commit: $(git rev-parse HEAD)"
        echo "  Tag: $(git describe --tags --always)"
        echo ""
        echo "Services Status:"
        docker-compose ps
        echo ""
        echo "Image Information:"
        docker-compose images
        echo ""
        echo "Resource Usage:"
        docker stats --no-stream
    } > "$REPORT_FILE"
    
    log "Deployment report generated: $REPORT_FILE"
}

# Main deployment function
main() {
    log "=== Starting Healthcare SaaS Deployment ==="
    
    # Pre-deployment checks
    check_prerequisites
    create_directories
    generate_ssl_certificates
    
    # Backup current deployment
    backup_current_deployment
    
    # Build and deploy
    build_images
    deploy_services
    
    # Health checks
    if check_services_health && run_smoke_tests; then
        success "Deployment completed successfully!"
        cleanup_resources
        generate_report "SUCCESS"
        
        # Show access information
        echo ""
        echo "=== Access Information ==="
        echo "Frontend: https://localhost"
        echo "API: https://localhost/api"
        echo "========================="
        
        exit 0
    else
        error "Deployment failed!"
        
        if [ "$ROLLBACK_ON_FAILURE" = "true" ]; then
            rollback_deployment
        fi
        
        generate_report "FAILED"
        exit 1
    fi
}

# Handle script interruption
trap 'error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"