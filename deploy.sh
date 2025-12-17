#!/bin/bash

# DUHIGURE Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/duhigure_${TIMESTAMP}"

echo "🚀 Starting DUHIGURE deployment for $ENVIRONMENT environment..."

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Function for logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Backup existing deployment
backup() {
    log "📦 Creating backup..."
    mkdir -p $BACKUP_DIR
    cp -r public $BACKUP_DIR/ || true
    cp server.js $BACKUP_DIR/ || true
    cp package.json $BACKUP_DIR/ || true
    log "✅ Backup created at: $BACKUP_DIR"
}

# Update code from git
update_code() {
    log "🔄 Updating code from Git..."
    git pull origin main
    git submodule update --init --recursive
}

# Install dependencies
install_deps() {
    log "📦 Installing dependencies..."
    npm ci --only=production
}

# Run tests
run_tests() {
    log "🧪 Running tests..."
    npm test
}

# Build application
build_app() {
    log "🔨 Building application..."
    npm run build
}

# Restart application
restart_app() {
    log "🔄 Restarting application..."
    
    # For Docker deployment
    if command -v docker &> /dev/null; then
        docker-compose down
        docker-compose build
        docker-compose up -d
        docker system prune -f
    else
        # For PM2 deployment
        if command -v pm2 &> /dev/null; then
            pm2 reload duhigure --update-env
        else
            # For systemd
            systemctl restart duhigure
        fi
    fi
    
    sleep 5
    log "✅ Application restarted"
}

# Health check
health_check() {
    log "🏥 Performing health check..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:${PORT:-3000}/api/health > /dev/null 2>&1; then
            log "✅ Health check passed!"
            return 0
        fi
        log "⏳ Waiting for application to be healthy... ($attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    log "📢 Sending $status notification: $message"
    
    # Slack notification
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"DUHIGURE Deployment $status: $message\"}" \
            $SLACK_WEBHOOK > /dev/null 2>&1 || true
    fi
    
    # Email notification
    if [ -n "$EMAIL_RECIPIENTS" ]; then
        echo "Subject: DUHIGURE Deployment $status

        $message
        Environment: $ENVIRONMENT
        Timestamp: $(date)
        " | sendmail $EMAIL_RECIPIENTS || true
    fi
}

# Rollback deployment
rollback() {
    log "🔄 Rolling back deployment..."
    
    if [ -d "$BACKUP_DIR" ]; then
        cp -r $BACKUP_DIR/public ./
        cp $BACKUP_DIR/server.js ./
        cp $BACKUP_DIR/package.json ./
        restart_app
        log "✅ Rollback completed"
    else
        log "❌ No backup found for rollback"
    fi
}

# Main deployment process
main() {
    log "🏁 Starting deployment process..."
    
    # Create backup
    backup
    
    # Update code
    update_code
    
    # Install dependencies
    install_deps
    
    # Run tests (skip in production if needed)
    if [ "$ENVIRONMENT" != "production" ] || [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    fi
    
    # Build application
    build_app
    
    # Restart application
    restart_app
    
    # Health check
    if health_check; then
        log "🎉 Deployment successful!"
        send_notification "SUCCESS" "Deployment to $ENVIRONMENT completed successfully"
        
        # Cleanup old backups (keep last 5)
        ls -td /backup/duhigure_* | tail -n +6 | xargs rm -rf || true
    else
        log "❌ Deployment failed - health check unsuccessful"
        send_notification "FAILED" "Deployment to $ENVIRONMENT failed - health check unsuccessful"
        
        # Rollback
        rollback
        exit 1
    fi
    
    log "✅ Deployment completed successfully!"
}

# Error handling
trap 'log "❌ Deployment failed with error: $?"; send_notification "FAILED" "Deployment failed with error"; rollback; exit 1' ERR

# Run main function
main