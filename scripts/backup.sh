#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="realestate"

echo "🔄 Starting backup process..."

# Database backup
echo "📦 Backing up database..."
docker exec postgres pg_dump -U user $DB_NAME | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# Files backup (uploaded images, logs)
echo "📁 Backing up files..."
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" ./uploads ./logs

# Configuration backup
echo "⚙️ Backing up configuration..."
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" ./docker-compose.yml ./nginx.conf ./.env.production

# Clean old backups (keep last 30 days)
echo "🧹 Cleaning old backups..."
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
if [ "$CLOUD_BACKUP_ENABLED" = "true" ]; then
    echo "☁️ Uploading to cloud storage..."
    # AWS S3, Google Cloud, or other cloud storage
    aws s3 sync $BACKUP_DIR s3://your-backup-bucket/real-estate-scanner/
fi

echo "✅ Backup completed successfully!"
