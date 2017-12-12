define(function(require) {

	var ko = require('knockout');
	var box = require('cab/box');
	var detail = require('./detail');
	var msg = require('cab/msg');
	
	var pg = require('common/pageGrid');
	    
	function index() {

		var that = this;
		that.userList = ko.observableArray();

		that.grid = ko.observable();
        that.grid_refresh = ko.observable();
        that.grid_setting = {
            url: 'test/findListPage',
            isCheck: true,
            checkKey: 'id',
            pageSize: 2,
            columns: [
            	{ headerText: "编号", rowText: "id", width: '100px', place: 'left' },
                {
                    headerText: "姓名", key: 'id', rowText: "name", place: 'left', isOperate: true,
                    callback: function (key) {
                        detail.show(key).then(function(p) {
							if (p)
								that.find();
						});
                    }
                }
            ]
        };
        
        that.search = function () {
            if (typeof that.grid_refresh() === "function") {
                setTimeout(that.grid_refresh(), 10);
            }
        };
        
		that.remove = function(p) {
			msg.confirm('确认删除？').then(function(result) {
				if (result === '确认') {
					box.post('test/remove', {
						idArray: [p.id]
					}, function() {
						msg.success('删除成功！').then(function() {
							that.find();
						});
					});
				}
			});
		};

		that.add = function() {
			detail.show().then(function(p) {
				if (p)
					that.find();

			});
		};

		that.edit = function(p) {
			detail.show(p.id).then(function(p) {
				if (p)
					that.find();
			});
		};

		that.find = function() {
			box.post('test/findlist', {}, function(p) {
				box.log(p);
				that.userList(p);
			});
		};

		that.activate = function() {
			that.find();
			
			that.grid(new pg(that.grid_setting));
            that.grid_refresh(function () {
                that.grid().reload();
            });
            that.search();
            
			return true;
		};
	};

	return index;
});