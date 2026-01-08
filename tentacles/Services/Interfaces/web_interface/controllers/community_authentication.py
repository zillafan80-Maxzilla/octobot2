#  Drakkar-Software OctoBot-Interfaces
#  Copyright (c) Drakkar-Software, All rights reserved.
#
#  LOCALIZED VERSION - Community authentication completely disabled
#  Modified for complete offline operation

import flask
import tentacles.Services.Interfaces.web_interface.login as login

def register(blueprint):
    @blueprint.route("/community_login")
    def community_login():
        """Community login disabled - redirect to home"""
        flask.flash("社区登录功能已禁用 - 本地化部署", "info")
        return flask.redirect("/")
    
    @blueprint.route("/community_register")
    def community_register():
        """Community register disabled - redirect to home"""
        flask.flash("社区注册功能已禁用 - 本地化部署", "info")
        return flask.redirect("/")
    
    @blueprint.route("/community_logout")
    def community_logout():
        """Community logout disabled - redirect to home"""
        return flask.redirect("/")
    
    @blueprint.route("/community/auth/<path:path>")
    def community_auth_catch_all(path):
        """Catch all community auth routes"""
        flask.flash("社区认证功能已禁用 - 本地化部署", "info")
        return flask.redirect("/")
