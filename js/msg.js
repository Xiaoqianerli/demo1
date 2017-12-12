//======================================================
//  Author:         小白菜
//  Create Date:    2017.03.14
//  Describe:       消息提示
//======================================================
define(function() {

	var dialog = require('plugins/dialog');

	var _confirm = function(pMessage, pTitle) {
		var org_t = pTitle || '确认';

		var m = ['<table>',
			'<tr>',
			'<td style="height:68px;width:80px;">',
			'<img src="img/message/info.png">',
			'</td>',
			'<td style="height:68px;width:250px;">',
			pMessage,
			'</td>',
			'<tr>',
			'</table>'
		].join('\n');

		return dialog.showMessage(m, org_t, ['确认', '取消']);
	};

	var _info = function(pMessage, pTitle, pCallBack) {

		var org_t = pTitle || '信息';

		var m = ['<table>',
			'<tr>',
			'<td style="height:68px;width:80px;">',
			'<img src="img/message/info.png">',
			'</td>',
			'<td style="height:68px;width:250px;">',
			pMessage,
			'</td>',
			'<tr>',
			'</table>'
		].join('\n');

		return dialog.showMessage(m, org_t, ['确认']);
	};

	var _error = function(pMessage, pTitle) {

		var org_t = pTitle || '错误';

		var m = ['<table>',
			'<tr>',
			'<td style="height:68px;width:80px;">',
			'<img src="img/message/error.png">',
			'</td>',
			'<td style="height:68px;width:250px;">',
			pMessage,
			'</td>',
			'<tr>',
			'</table>'
		].join('\n');

		return dialog.showMessage(m, org_t, ['确认']);
	};

	var _success = function(pMessage, pTitle) {
		var org_t = pTitle || '成功';

		var m = ['<table>',
			'<tr>',
			'<td style="height:68px;width:80px;">',
			'<img src="img/message/success.png">',
			'</td>',
			'<td style="height:68px;width:250px;">',
			pMessage,
			'</td>',
			'<tr>',
			'</table>'
		].join('\n');
		return dialog.showMessage(m, org_t, ['确认']);
	};

	var _warning = function(pMessage, pTitle) {
		var org_t = pTitle || '警告';

		var m = ['<table>',
			'<tr>',
			'<td style="height:68px;width:80px;">',
			'<img src="img/message/warning.png">',
			'</td>',
			'<td style="height:68px;width:250px;">',
			pMessage,
			'</td>',
			'<tr>',
			'</table>'
		].join('\n');

		return dialog.showMessage(m, org_t, ['确认']);
	};

	return {
		confirm: _confirm,
		info: _info,
		error: _error,
		success: _success,
		warning: _warning
	}
});