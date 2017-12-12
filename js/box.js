//======================================================
//  Author:         小白菜
//  Create Date:    2017.03.14
//  Describe:       封装常用操作的盒子
//======================================================
define(function(require) {

	var ko = require('knockout');
	var system = require('durandal/system');
	var dialog = require('plugins/dialog');
	var config = require('./config');
	var msg = require('./msg');

	var _show = function(p) {
		return dialog.show(p);
	};

	var _close = function(p, r) {
		if (r != undefined)
			return dialog.close(p, r);
		return dialog.close(p);
	};

	var _log = function() {
		var slice = Array.prototype.slice;
		if ((slice.call(arguments)).length == 1 && typeof slice.call(arguments)[0] == 'string') {
			system.log((slice.call(arguments)).toString());
		} else {
			system.log.apply(system, slice.call(arguments));
		}
	};

	var _post = function(api, data, success) {
		$.ajax({
			url: config.path + api,
			data: ko.toJS(data),
			type: 'POST',
			dataType: 'JSON',
			headers: {
				//TODO: 需要处理为从登录cookie中获取
				'token': "ef7f58803b634c96abfc291f80a2b390"
			}
		}).then(function(result) {
			var code = result.code;
			if (code == 200) { /* 成功 */
				if (typeof success === 'function') {
					success(result.data);
				}
			} else if (code == 300) { /* 业务异常 */
				msg.info(result.message);
			} else if (code == 301) { /* 系统错误，后台异常 */
				msg.error('系统错误，请联系管理员！');
			} else if (code == 403) {
				msg.info('未获得授权，请重新登录！').then(function() {
					// 重新登录 清除cookie
					// location.href = 'login.html';
				});
			} else if (code == 201) {
				msg.info('登录过期，请重新登录！').then(function() {
					// 重新登录 清除cookie
					// location.href = 'login.html';
				});
			} else {
				msg.error('未知错误，错误编码: ' + code);
			}
		}).fail(function(a, b, c) {
			if (a.status == 403) {
				msg.info("拒绝访问，没有权限！");
			} else {
				msg.error('系统错误，请联系管理员！');
			}
		});
	};

	return {
		show: _show,
		close: _close,
		path: config.path,
		log: _log,
		post: _post
	};
});