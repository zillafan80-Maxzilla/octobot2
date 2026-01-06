#!/bin/bash
# OctoBot部署脚本

echo "🚀 开始部署OctoBot..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

# 停止并删除旧容器
if docker ps -a | grep -q OctoBot; then
    echo "停止旧容器..."
    docker stop OctoBot
    docker rm OctoBot
fi

# 运行新容器
echo "启动OctoBot容器..."
docker run -d \
  --name OctoBot \
  --restart unless-stopped \
  -p 5001:5001 \
  -v $(pwd)/config:/octobot/user \
  -e DISABLE_COMMUNITY=true \
  -e DISABLE_WEB_INTERFACE_UPDATES=true \
  drakkarsoftware/octobot:stable

# 等待容器启动
echo "等待容器启动..."
sleep 10

# 检查容器状态
if docker ps | grep -q OctoBot; then
    echo "✅ OctoBot部署成功！"
    echo "访问地址: http://$(hostname -I | awk '{print $1}'):5001"
else
    echo "❌ 部署失败，请查看日志: docker logs OctoBot"
    exit 1
fi
