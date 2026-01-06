# OctoBot深度定制完整指南

**服务器**: 8.211.158.208  
**访问地址**: https://www.inarbit.work  
**登录凭据**: admin / zilla80527  
**日期**: 2026-01-06

---

## 📋 工作总结

### ✅ 已完成的工作

#### 1. 界面定制
- **导航栏修改**: 已从HTML模板中删除社区、帮助、关于三个菜单
  - 文件位置: `/octobot/tentacles/Services/Interfaces/web_interface/templates/components/navbar.html`
  - 备份位置: `/tmp/octobot_backup_20260106/navbar_original.html`

- **CSS样式定制**: 应用了参考网站的设计风格
  - 米白色/奶油色背景 (#F5F1E8)
  - 深绿色文字 (#2D5016)
  - 大圆角设计 (20px)
  - 文件位置: `/octobot/tentacles/Services/Interfaces/web_interface/static/style.css`

#### 2. 云服务禁用
- **Docker环境变量**: 
  ```bash
  DISABLE_COMMUNITY=true
  DISABLE_WEB_INTERFACE_UPDATES=true
  ```

- **配置文件设置**:
  ```json
  {
    "local_data_identifier": "",
    "notification": {
      "enabled": false,
      "global-info": false,
      "price-alerts": false,
      "trades": false
    }
  }
  ```

#### 3. 系统运行状态
- ✅ OctoBot容器正常运行
- ✅ Grid Trading模式已激活
- ✅ 模拟交易正常工作
- ✅ 正在BTC/USDT上创建买卖订单

### ⚠️ 未完成的任务

#### 1. 三角套利配置
- **目标**: 配置ETH/SOL/USDT三角套利交易对
- **当前状态**: 使用Grid Trading + BTC/USDT
- **原因**: OctoBot的profile配置系统会自动迁移配置格式，导致手动修改被覆盖

#### 2. Web界面认证
- **问题**: 系统仍然要求登录
- **原因**: OctoBot 2.0.16版本的默认安全机制
- **解决方案**: 需要更深入的代码修改

#### 3. 完全删除官方连接
- **目标**: 删除所有与OctoBot官网的连接代码
- **状态**: 部分完成（已禁用云服务，但源代码中仍有链接）

---

## 🎯 手动配置三角套利交易对

### 方法1: 通过Web界面配置（推荐）

#### 步骤1: 登录系统
```
访问: https://www.inarbit.work
用户名: admin
密码: zilla80527
```

#### 步骤2: 选择配置文件
1. 点击顶部导航栏的"配置文件"（Profile）
2. 如果看到欢迎页面，点击"USE CUSTOM STRATEGIES"
3. 向下滚动找到"Grid Trading"配置
4. 点击"Proceed with this profile"按钮

#### 步骤3: 配置交易所
1. 点击"Exchanges"（交易所）标签
2. 确认Binance已选择为SPOT（现货）模式
3. 如果需要实盘交易，添加API密钥（模拟交易不需要）

#### 步骤4: 配置交易对
1. 点击"Currencies"（货币）标签
2. 点击币种下拉菜单
3. 依次添加以下交易对：
   - **ETH/USDT**: 选择Ethereum，点击ADD
   - **SOL/USDT**: 选择Solana，点击ADD
   - **ETH/SOL**: 如果Binance支持，也添加此交易对

#### 步骤5: 配置初始资金
1. 点击"Trading"（交易）标签
2. 找到"Trader simulator"部分
3. 设置"Starting portfolio":
   ```json
   {
     "USDT": 1000,
     "ETH": 0,
     "SOL": 0
   }
   ```

#### 步骤6: 应用更改
1. 点击页面底部的"APPLY CHANGES AND RESTART"按钮
2. 等待系统重启（约40秒）
3. 访问首页查看投资组合是否正确显示

### 方法2: 通过SSH修改配置文件

#### 步骤1: 连接服务器
```bash
ssh -i ~/.ssh/id_rsa_octobot root@8.211.158.208
```

#### 步骤2: 停止OctoBot
```bash
docker stop OctoBot
```

#### 步骤3: 编辑配置文件
```bash
docker exec -it OctoBot vi /octobot/user/config.json
```

修改以下部分：
```json
{
  "crypto-currencies": {
    "Bitcoin": {
      "pairs": []
    },
    "Ethereum": {
      "pairs": ["ETH/USDT"]
    },
    "Solana": {
      "pairs": ["SOL/USDT"]
    }
  },
  "trader-simulator": {
    "enabled": true,
    "fees": {
      "maker": 0.1,
      "taker": 0.1
    },
    "starting-portfolio": {
      "USDT": 1000,
      "ETH": 0,
      "SOL": 0
    }
  }
}
```

#### 步骤4: 清理历史数据
```bash
docker exec OctoBot rm -rf /octobot/user/data/live/*
```

#### 步骤5: 启动OctoBot
```bash
docker start OctoBot
```

#### 步骤6: 验证
```bash
# 查看日志
docker logs OctoBot --tail 50

# 应该看到类似输出：
# Starting OctoBot with simulated trader on binance[spot] trading ETH/USDT, SOL/USDT
```

---

## 🔍 查找并删除OctoBot官方连接

### 1. 免责声明页面

**文件位置**: `/octobot/tentacles/Services/Interfaces/web_interface/templates/terms.html`

**查找方法**:
```bash
ssh -i ~/.ssh/id_rsa_octobot root@8.211.158.208
docker exec OctoBot find /octobot -name "terms.html" -o -name "disclaimer.html"
```

**修改内容**:
- 删除"ACCEPT AND GO TO OCTOBOT"按钮中的官网链接
- 删除底部的社交媒体链接（OctoBot、GitHub、Twitter等）

**备份并下载**:
```bash
docker cp OctoBot:/octobot/tentacles/Services/Interfaces/web_interface/templates/terms.html /tmp/
scp -i ~/.ssh/id_rsa_octobot root@8.211.158.208:/tmp/terms.html ~/
```

**修改后上传**:
```bash
scp -i ~/.ssh/id_rsa_octobot ~/terms_custom.html root@8.211.158.208:/tmp/
docker cp /tmp/terms_custom.html OctoBot:/octobot/tentacles/Services/Interfaces/web_interface/templates/terms.html
docker restart OctoBot
```

### 2. 欢迎页面

**文件位置**: `/octobot/tentacles/Services/Interfaces/web_interface/templates/welcome.html`

**需要删除的内容**:
- "OctoBot cloud"相关链接
- "USE CLOUD STRATEGIES"按钮
- 底部的社交媒体链接

### 3. 配置文件选择页面

**文件位置**: `/octobot/tentacles/Services/Interfaces/web_interface/templates/profiles_selector.html`

**需要删除的内容**:
- "Join the OctoBot community"注册表单
- "FROM OCTOBOT CLOUD"标签页
- 社交媒体链接

### 4. 导航栏（已完成）

**文件位置**: `/octobot/tentacles/Services/Interfaces/web_interface/templates/components/navbar.html`

**已删除内容**:
- 社区菜单
- 帮助菜单
- 关于菜单

### 5. Python后端代码

**查找所有官网连接**:
```bash
docker exec OctoBot grep -r "octobot.cloud" /octobot/tentacles/ 2>/dev/null
docker exec OctoBot grep -r "octobot.online" /octobot/tentacles/ 2>/dev/null
docker exec OctoBot grep -r "community" /octobot/tentacles/ | grep -i "url\|link\|http"
```

**常见文件位置**:
- `/octobot/tentacles/Services/Interfaces/web_interface/`
- `/octobot/octobot/community/`
- `/octobot/octobot/constants.py`

### 6. JavaScript前端代码

**查找方法**:
```bash
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/static -name "*.js" -exec grep -l "octobot.cloud\|community" {} \;
```

**需要检查的文件**:
- `common.js`
- `components.js`
- 任何包含"community"或"cloud"的JS文件

### 7. 完整删除脚本

创建一个自动化脚本来删除所有官方连接：

```bash
#!/bin/bash
# cleanup_official_links.sh

# 备份
docker exec OctoBot mkdir -p /tmp/backup
docker exec OctoBot cp -r /octobot/tentacles/Services/Interfaces/web_interface/templates /tmp/backup/

# 删除社交媒体链接
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/templates -name "*.html" -exec sed -i 's|href=".*octobot\.cloud.*"|href="#"|g' {} \;
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/templates -name "*.html" -exec sed -i 's|href=".*github\.com.*"|href="#"|g' {} \;
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/templates -name "*.html" -exec sed -i 's|href=".*twitter\.com.*"|href="#"|g' {} \;
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/templates -name "*.html" -exec sed -i 's|href=".*t\.me.*"|href="#"|g' {} \;
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/templates -name "*.html" -exec sed -i 's|href=".*discord\..*"|href="#"|g' {} \;
docker exec OctoBot find /octobot/tentacles/Services/Interfaces/web_interface/templates -name "*.html" -exec sed -i 's|href=".*youtube\.com.*"|href="#"|g' {} \;

# 重启OctoBot
docker restart OctoBot

echo "✅ 官方连接已删除！"
```

---

## 🧪 全面测试清单

### 1. 界面测试

- [ ] 访问首页，确认导航栏没有社区、帮助、关于菜单
- [ ] 检查页面样式是否正确（米白色背景、深绿色文字）
- [ ] 确认所有页面的官方链接都已删除或禁用

### 2. 功能测试

- [ ] 登录系统（admin / zilla80527）
- [ ] 查看投资组合页面，确认初始资金为1000 USDT
- [ ] 查看交易页面，确认交易对为ETH/USDT和SOL/USDT
- [ ] 查看市场监控，确认图表正常显示
- [ ] 查看日志，确认没有云服务连接错误

### 3. 系统测试

```bash
# 检查容器状态
docker ps | grep OctoBot

# 查看日志
docker logs OctoBot --tail 100

# 检查配置
docker exec OctoBot cat /octobot/user/config.json | jq '.profile'
docker exec OctoBot cat /octobot/user/config.json | jq '."crypto-currencies"'

# 检查数据库
docker exec OctoBot ls -lh /octobot/user/data/live/

# 检查网络连接
docker exec OctoBot netstat -an | grep ESTABLISHED
```

### 4. 性能测试

- [ ] 系统运行24小时后，检查内存使用情况
- [ ] 查看是否有交易订单生成
- [ ] 检查数据库文件大小是否合理
- [ ] 确认没有异常的网络连接

---

## 📚 参考资料

### 配置文件位置
```
/octobot/user/config.json                          # 主配置文件
/octobot/user/profiles/grid_trading/profile.json   # Grid Trading配置
/octobot/user/data/live/                           # 运行时数据
/octobot/tentacles/Services/Interfaces/            # Web界面文件
```

### 常用命令
```bash
# SSH连接
ssh -i ~/.ssh/id_rsa_octobot root@8.211.158.208

# Docker操作
docker ps                           # 查看容器状态
docker logs OctoBot                 # 查看日志
docker exec OctoBot <command>       # 在容器中执行命令
docker restart OctoBot              # 重启容器
docker stop OctoBot                 # 停止容器
docker start OctoBot                # 启动容器

# 文件操作
docker cp OctoBot:/path/to/file /local/path     # 从容器复制文件
docker cp /local/path OctoBot:/path/to/file     # 复制文件到容器

# 备份
tar -czf octobot_backup_$(date +%Y%m%d).tar.gz /tmp/octobot_backup_20260106/
```

### 故障排查

**问题1: 系统要求登录**
- 原因: OctoBot的安全机制
- 解决: 使用 admin / zilla80527 登录

**问题2: 配置被自动覆盖**
- 原因: OctoBot会自动迁移配置格式
- 解决: 通过Web界面修改，或在修改后立即重启

**问题3: 投资组合显示错误**
- 原因: 历史数据未清理
- 解决: 删除 `/octobot/user/data/live/` 目录下的所有文件

**问题4: 交易对未生效**
- 原因: profile配置未正确加载
- 解决: 检查 `config.json` 中的 `profile` 字段是否为 `grid_trading`

---

## 🎯 下一步建议

### 短期目标（1-3天）

1. **完成三角套利配置**
   - 通过Web界面手动添加ETH/USDT和SOL/USDT交易对
   - 设置初始资金为1000 USDT
   - 验证系统正常运行

2. **删除所有官方连接**
   - 使用上述脚本批量删除链接
   - 手动检查关键页面（欢迎页、免责声明页）
   - 测试所有功能确保正常工作

3. **优化界面翻译**
   - 修复"Oc到Bot"等翻译错误
   - 统一术语翻译
   - 改善用户体验

### 中期目标（1-2周）

1. **性能优化**
   - 监控系统资源使用
   - 优化数据库查询
   - 清理不必要的日志

2. **安全加固**
   - 更改默认密码
   - 配置防火墙规则
   - 设置自动备份

3. **功能测试**
   - 运行模拟交易1-2周
   - 分析交易记录
   - 评估策略效果

### 长期目标（1个月+）

1. **策略优化**
   - 根据测试结果调整参数
   - 尝试不同的交易对组合
   - 优化风险管理

2. **系统维护**
   - 定期备份配置和数据
   - 监控系统健康状态
   - 更新安全补丁

3. **文档完善**
   - 记录所有定制修改
   - 创建操作手册
   - 建立故障排查知识库

---

## 📞 技术支持

### 系统信息
- **服务器IP**: 8.211.158.208
- **SSH密钥**: ~/.ssh/id_rsa_octobot
- **Web访问**: https://www.inarbit.work
- **OctoBot版本**: 2.0.16
- **Docker容器**: OctoBot

### 备份位置
- **配置备份**: /tmp/octobot_backup_20260106/
- **本地备份**: /home/ubuntu/octobot_backup_20260106.tar.gz

### 重要提醒

⚠️ **安全警告**:
- 切勿在生产环境中使用默认密码
- 定期备份配置和数据
- 监控系统日志，及时发现异常

⚠️ **交易风险**:
- 模拟交易不代表真实交易结果
- 在使用真实资金前，必须充分测试
- 加密货币交易存在高风险，可能导致资金损失

---

**文档版本**: 1.0  
**最后更新**: 2026-01-06  
**作者**: Manus AI Assistant
