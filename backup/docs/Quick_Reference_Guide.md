# OctoBot本地化部署快速参考指南

**版本**: 1.0  
**日期**: 2026-01-07  
**服务器**: www.inarbit.work (8.211.158.208)

---

## 🚀 快速启动

### 访问Web界面

**URL**: https://www.inarbit.work  
**用户名**: admin  
**密码**: zilla80527

---

## 🔧 常用操作

### 容器管理

```bash
# 查看状态
docker ps | grep OctoBot

# 重启容器
docker restart OctoBot

# 查看日志
docker logs OctoBot --tail 50

# 实时日志
docker logs -f OctoBot
```

---

### 网络隔离

```bash
# ⚠️ 重要：容器重启后必须重新应用！
/root/network_isolation.sh

# 验证规则
CONTAINER_PID=$(docker inspect -f '{{.State.Pid}}' OctoBot)
nsenter -t $CONTAINER_PID -n iptables -L OUTPUT -n
```

---

### 配置备份

```bash
# 备份配置
/root/octo/scripts/backup.sh

# 备份位置
ls -lh /root/octobot_backups/
```

---

## 📊 监控检查

### 系统健康

```bash
# 容器资源
docker stats OctoBot --no-stream

# 磁盘空间
df -h /root/octobot

# 日志大小
du -sh /root/octobot/logs/
```

---

### 网络验证

```bash
# 应该失败（被阻止）
docker exec OctoBot ping -c 3 octobot.cloud

# 应该成功（允许）
docker exec OctoBot ping -c 3 binance.com

# 查看连接
docker exec OctoBot netstat -anp | grep ESTABLISHED
```

---

## 🔐 安全检查

### 每周检查清单

- [ ] 验证网络隔离规则
- [ ] 检查容器运行状态
- [ ] 查看交易日志
- [ ] 备份配置文件
- [ ] 检查磁盘空间

---

## ⚠️ 故障处理

### Web界面502错误

```bash
# 1. 检查容器
docker ps -a | grep OctoBot

# 2. 查看日志
docker logs OctoBot --tail 100

# 3. 重启容器
docker restart OctoBot

# 4. 等待30秒后重新应用网络隔离
sleep 30
/root/network_isolation.sh
```

---

### 交易不执行

1. 检查是否在模拟模式（顶部菜单）
2. 检查API密钥配置（账户 -> 交易所）
3. 查看日志：`docker logs OctoBot | grep -i order`

---

### 网络隔离失效

```bash
# 重新应用规则
/root/network_isolation.sh

# 验证
CONTAINER_PID=$(docker inspect -f '{{.State.Pid}}' OctoBot)
nsenter -t $CONTAINER_PID -n iptables -L OUTPUT -n | wc -l
# 应该显示 > 7（7条REJECT规则 + 表头）
```

---

## 📁 重要路径

| 项目 | 路径 |
|------|------|
| 配置文件 | `/root/octobot/user/config.json` |
| 日志文件 | `/root/octobot/logs/OctoBot.log` |
| 备份目录 | `/root/octobot_backups/` |
| 隔离脚本 | `/root/network_isolation.sh` |
| GitHub仓库 | `https://github.com/zillafan80-Maxzilla/octo` |

---

## 🌐 被阻止的域名

✅ 已阻止以下域名的所有IP地址：

- octobot.cloud (3个IP)
- octobot.info (2个IP)
- api.coingecko.com (2个IP)

**总计**: 7条iptables REJECT规则

---

## 📞 紧急联系

**完整文档**: `/home/ubuntu/OctoBot_Localization_Report.md`  
**GitHub**: https://github.com/zillafan80-Maxzilla/octo  
**服务器**: 8.211.158.208

---

## 💡 每日提醒

1. ✅ 容器重启后记得运行 `/root/network_isolation.sh`
2. ✅ 定期查看日志确认交易正常
3. ✅ 每周备份配置文件
4. ✅ 监控系统资源使用
5. ✅ 谨慎升级OctoBot版本

---

**快速参考版本**: 1.0  
**最后更新**: 2026-01-07
