define(function(require) {

	var ko = require('knockout');
	var box = require('cab/box');
	var msg = require('cab/msg');

	var detail = function(p) {

		var that = this;

		that.id = ko.observable(p);
		that.user = ko.observable({
			id: ko.observable(''),
			name: ko.observable('')
		});

		that.ok = function() {
			box.post('test/save', {
				user: that.user
			}, function() {
				msg.success('保存成功！').then(function() {
					return box.close(that, true);
				});
			});
		};

		that.cancel = function() {
			return box.close(that, false);
		};

		that.activate = function() {
			box.post('test/find', {
				id: that.id
			}, function(p) {
				if (p != null) {
					that.user().id(p.id);
					that.user().name(p.name);
				}
			});
		};
	}

	detail.show = function(p) {
		return box.show(new detail(p));
	};

	return detail;
});