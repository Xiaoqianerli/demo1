
define(function (require) {

    var ko = require('knockout');
    var router = require('plugins/router');
    var drag = require('cab/drag');
	var bootstrap = require('bootstrap');
	
    function shell() {

        var that = this;
        
        that.router = router;

        that.activate = function () {

            var router = [{ route: ['', 'home'], moduleId: 'home/index', title: '首页', nav: 1 }];
           
            that.router.map(router).buildNavigationModel().activate();
        };
    };

    return shell;
});