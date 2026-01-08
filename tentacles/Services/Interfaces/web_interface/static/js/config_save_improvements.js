// OctoBot配置保存用户体验改进
// 添加保存成功提示、重启进度条、自动刷新

(function() {
    'use strict';
    
    // 1. 添加保存成功提示函数
    function showSaveNotification(message, type = 'success') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        
        notification.innerHTML = `
            <strong>${type === 'success' ? '✅ 成功！' : '⚠️ 提示：'}</strong> ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动消失
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // 2. 添加重启进度条
    function showRestartProgress() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'restart-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // 创建进度卡片
        const card = document.createElement('div');
        card.style.cssText = `
            background: #fdf6e3;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        `;
        
        card.innerHTML = `
            <h3 style="color: #859900; margin-bottom: 20px;">
                🔄 OctoBot正在重启...
            </h3>
            <div class="progress" style="height: 25px; margin-bottom: 15px;">
                <div id="restart-progress-bar" class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" style="width: 0%; background-color: #859900;">
                    <span id="restart-progress-text">0%</span>
                </div>
            </div>
            <p style="color: #586e75; margin-bottom: 10px;">
                预计需要60秒，请耐心等待...
            </p>
            <p style="color: #93a1a1; font-size: 14px;">
                重启完成后页面将自动刷新
            </p>
        `;
        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        // 进度条动画
        let progress = 0;
        const progressBar = document.getElementById('restart-progress-bar');
        const progressText = document.getElementById('restart-progress-text');
        
        const interval = setInterval(() => {
            progress += 1.67; // 60秒完成
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // 显示完成消息
                card.innerHTML = `
                    <h3 style="color: #859900;">
                        ✅ 重启完成！
                    </h3>
                    <p style="color: #586e75; margin-top: 15px;">
                        页面即将刷新...
                    </p>
                `;
                
                // 2秒后刷新页面
                setTimeout(() => {
                    window.location.reload(true); // 强制刷新
                }, 2000);
            }
            
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '%';
        }, 1000);
    }
    
    // 3. 拦截保存按钮点击事件
    function interceptSaveButtons() {
        // 拦截"SAVE"按钮
        const saveButton = document.getElementById('save-config');
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                // 延迟显示通知，确保保存操作已触发
                setTimeout(() => {
                    showSaveNotification('配置已保存！请点击"APPLY CHANGES AND RESTART"使配置生效。', 'warning');
                }, 500);
            });
        }
        
        // 拦截"APPLY CHANGES AND RESTART"按钮
        const saveAndRestartButton = document.getElementById('save-config-and-restart');
        if (saveAndRestartButton) {
            saveAndRestartButton.addEventListener('click', function(e) {
                // 延迟显示通知和进度条
                setTimeout(() => {
                    showSaveNotification('配置已保存！OctoBot正在重启...', 'success');
                    
                    // 2秒后显示进度条
                    setTimeout(() => {
                        showRestartProgress();
                    }, 2000);
                }, 500);
            });
        }
    }
    
    // 4. 添加操作提示横幅
    function addOperationGuide() {
        const profileContent = document.querySelector('.card-body');
        if (!profileContent) return;
        
        const guide = document.createElement('div');
        guide.className = 'alert alert-info';
        guide.style.cssText = `
            background-color: #eee8d5;
            border-color: #268bd2;
            color: #073642;
            margin-bottom: 20px;
        `;
        
        guide.innerHTML = `
            <h5 style="color: #268bd2; margin-bottom: 10px;">
                💡 配置保存说明
            </h5>
            <ol style="margin-bottom: 0; padding-left: 20px;">
                <li>修改配置参数后，点击页面底部的 <strong>"APPLY CHANGES AND RESTART"</strong> 按钮</li>
                <li>等待约60秒让OctoBot完全重启</li>
                <li>页面将自动刷新并显示新配置</li>
            </ol>
            <p style="margin-top: 10px; margin-bottom: 0; font-size: 14px; color: #586e75;">
                <strong>提示：</strong>如果只点击"SAVE"按钮，配置会保存但不会立即生效，需要手动重启OctoBot。
            </p>
        `;
        
        profileContent.insertBefore(guide, profileContent.firstChild);
    }
    
    // 5. 改进按钮文字
    function improveButtonLabels() {
        const saveButton = document.getElementById('save-config');
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-save"></i> 保存配置（需手动重启）';
            saveButton.title = '仅保存配置到文件，不会立即生效';
        }
        
        const saveAndRestartButton = document.getElementById('save-config-and-restart');
        if (saveAndRestartButton) {
            saveAndRestartButton.innerHTML = '<i class="fas fa-sync-alt"></i> 保存并立即重启（推荐）';
            saveAndRestartButton.title = '保存配置并重启OctoBot，配置立即生效';
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            interceptSaveButtons();
            addOperationGuide();
            improveButtonLabels();
        });
    } else {
        interceptSaveButtons();
        addOperationGuide();
        improveButtonLabels();
    }
})();
