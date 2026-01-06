# OctoBot 定制版 - 三角套利交易系统

这是一个基于 [OctoBot](https://github.com/Drakkar-Software/OctoBot) 的定制版本，专门用于加密货币三角套利交易。

## 🎯 项目特点

- **界面定制**: 应用了参考网站的设计风格（米白色背景、深绿色文字、大圆角）
- **功能精简**: 移除了社区、帮助、关于等菜单，专注于交易功能
- **云服务禁用**: 完全离线运行，不连接OctoBot官方服务器
- **三角套利**: 配置用于ETH/SOL/USDT三角套利交易
- **模拟交易**: 支持虚拟盘测试，初始资金1000 USDT

## 📁 目录结构

```
octo/
├── config/              # OctoBot配置文件
│   ├── config.json     # 主配置文件
│   └── profiles/       # 交易策略配置
├── templates/          # 定制的HTML模板
│   ├── layout.html     # 主布局文件（已修改导航栏）
│   └── navbar.html     # 导航栏组件
├── static/             # 定制的CSS样式
│   └── style.css       # 主样式文件（已应用参考网站设计）
├── docs/               # 文档
│   ├── 深度定制完整指南.md
│   ├── 系统配置与运行报告.md
│   └── 三角套利系统完整使用手册.md
└── scripts/            # 部署和管理脚本
```

## 🚀 快速开始

### 1. 部署到服务器

```bash
# 克隆仓库
git clone https://github.com/zillafan80-Maxzilla/octo.git
cd octo

# 使用Docker运行
docker run -d \
  --name OctoBot \
  -p 5001:5001 \
  -v $(pwd)/config:/octobot/user \
  -e DISABLE_COMMUNITY=true \
  -e DISABLE_WEB_INTERFACE_UPDATES=true \
  drakkarsoftware/octobot:stable
```

### 2. 访问Web界面

```
访问地址: http://your-server-ip:5001
默认用户: admin
默认密码: (首次运行时设置)
```

### 3. 配置交易对

1. 登录Web界面
2. 进入"配置文件"（Profile）
3. 选择"Grid Trading"或自定义策略
4. 添加交易对：ETH/USDT, SOL/USDT
5. 设置初始资金：1000 USDT
6. 应用更改并重启

## 📖 详细文档

- [深度定制完整指南](docs/深度定制完整指南.md) - 完整的定制步骤和配置说明
- [系统配置与运行报告](docs/系统配置与运行报告.md) - 系统配置详情和运行状态
- [三角套利系统完整使用手册](docs/三角套利系统完整使用手册.md) - 功能说明和操作指南

## 🎨 界面定制

本项目应用了以下设计风格：

- **背景色**: 米白色/奶油色 (#F5F1E8)
- **文字色**: 深绿色 (#2D5016)
- **圆角**: 大圆角设计 (20px)
- **参考网站**: https://quitenice.com/products/prebiotic-oatmeal-2-plan

### 已修改的文件

1. **templates/layout.html** - 删除了社区、帮助、关于菜单
2. **static/style.css** - 应用了参考网站的设计风格

## ⚙️ 配置说明

### Docker环境变量

```bash
DISABLE_COMMUNITY=true                    # 禁用社区功能
DISABLE_WEB_INTERFACE_UPDATES=true       # 禁用自动更新
```

### 主配置文件 (config/config.json)

```json
{
  "local_data_identifier": "",
  "notification": {
    "enabled": false,
    "global-info": false,
    "price-alerts": false,
    "trades": false
  },
  "crypto-currencies": {
    "Ethereum": {
      "pairs": ["ETH/USDT"]
    },
    "Solana": {
      "pairs": ["SOL/USDT"]
    }
  },
  "trader-simulator": {
    "enabled": true,
    "starting-portfolio": {
      "USDT": 1000
    }
  }
}
```

## 🔧 常用命令

```bash
# 查看容器状态
docker ps | grep OctoBot

# 查看日志
docker logs OctoBot --tail 100

# 重启容器
docker restart OctoBot

# 进入容器
docker exec -it OctoBot bash

# 备份配置
docker cp OctoBot:/octobot/user ./backup_$(date +%Y%m%d)
```

## ⚠️ 重要提醒

1. **安全**: 请务必更改默认密码
2. **备份**: 定期备份配置和数据
3. **测试**: 在使用真实资金前，必须充分测试
4. **风险**: 加密货币交易存在高风险，可能导致资金损失

## 📊 系统要求

- **操作系统**: Ubuntu 22.04 LTS 或更高版本
- **Docker**: 20.10 或更高版本
- **内存**: 至少 2GB RAM
- **存储**: 至少 10GB 可用空间
- **网络**: 稳定的互联网连接（用于交易所API）

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

本项目基于OctoBot开源项目，遵循其原有许可证。

## 🔗 相关链接

- [OctoBot官方网站](https://www.octobot.cloud/)
- [OctoBot GitHub](https://github.com/Drakkar-Software/OctoBot)
- [OctoBot文档](https://www.octobot.info/)

## 📞 技术支持

如有问题，请查看文档或提交Issue。

---

**版本**: 1.0  
**基于**: OctoBot 2.0.16  
**最后更新**: 2026-01-06
