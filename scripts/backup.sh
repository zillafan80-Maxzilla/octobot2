#!/bin/bash
# 备份OctoBot配置

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
echo "创建备份目录: $BACKUP_DIR"

mkdir -p $BACKUP_DIR
docker cp OctoBot:/octobot/user $BACKUP_DIR/

echo "✅ 备份完成: $BACKUP_DIR"
