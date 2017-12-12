//======================================================
//  Author:         小白菜
//  Create Date:    2017.03.14
//  Describe:       拖拽支持
//======================================================
var $window = $(window),
	$document = $(document),
	html = document.documentElement,
	isIE6 = !('minWidth' in html.style),
	isLosecapture = 'onlosecapture' in html,
	isSetCapture = 'setCapture' in html,
	clsSelect = 'getSelection' in window ? function() {
		window.getSelection().removeAllRanges();
	} : function() {
		try {
			document.selection.empty();
		} catch (e) {};
	};

var DragEvent = function() {
	var that = this,
		proxy = function(name) {
			var fn = that[name];
			that[name] = function() {
				return fn.apply(that, arguments);
			};
		};
	proxy('start');
	proxy('move');
	proxy('end');
};

DragEvent.prototype = {
	start: function(event) {
		$(document)
			.bind('mousemove', this.move)
			.bind('mouseup', this.end);

		this._sClientX = event.clientX;
		this._sClientY = event.clientY;
		this.onstart(event.clientX, event.clientY);
		return false;
	},
	move: function(event) {
		this._mClientX = event.clientX;
		this._mClientY = event.clientY;
		this.onmove(
			event.clientX - this._sClientX,
			event.clientY - this._sClientY
		);

		return false;
	},
	end: function(event) {
		$(document)
			.unbind('mousemove', this.move)
			.unbind('mouseup', this.end);

		this.onend(event.clientX, event.clientY);
		return false;
	}
};

var dragInit = function(event, $wrap, $title, $main) {

	var dragEvent = new DragEvent,
		wrap = $wrap[0],
		title = $title[0],
		main = $main[0],
		wrapStyle = wrap.style,
		mainStyle = main.style;

	var isFixed = wrap.style.position === 'fixed',
		minX = isFixed ? 0 : (0 - wrap.offsetWidth + 50), //$document.scrollLeft(),
		minY = isFixed ? 0 : $document.scrollTop(),
		maxX = $window.width() - 50, //$window.width() - wrap.offsetWidth + minX,
		maxY = $window.height() - 50; //$window.height() - wrap.offsetHeight + minY;

	var startWidth, startHeight, startLeft, startTop;

	// 对话框准备拖动
	dragEvent.onstart = function(x, y) {
		startLeft = wrap.offsetLeft;
		startTop = wrap.offsetTop;
		$document.bind('dblclick', dragEvent.end);
		if (!isIE6 && isLosecapture) {
			$title.bind('losecapture', dragEvent.end)
		} else {
			$window.bind('blur', dragEvent.end)
		};
		isSetCapture && title.setCapture();
		$wrap.addClass('message-state-drag');
		$title.css('cursor','move');
	};
	// 对话框拖动进行中
	dragEvent.onmove = function(x, y) {
		var left = Math.max(minX, Math.min(maxX, x + startLeft)),
			top = Math.max(minY, Math.min(maxY, y + startTop));

		wrapStyle.left = left + 'px';
		wrapStyle.top = top + 'px';
		clsSelect();
	};
	// 对话框拖动结束
	dragEvent.onend = function(x, y) {
		$document.unbind('dblclick', dragEvent.end);
		if (!isIE6 && isLosecapture) {
			$title.unbind('losecapture', dragEvent.end);
		} else {
			$window.unbind('blur', dragEvent.end)
		};
		isSetCapture && title.releaseCapture();
		$wrap.removeClass('message-state-drag');
		$title.css('cursor','');
	};
	dragEvent.start(event);
};

$(document).on('mousedown.drag', '.modalHost .modal-header', function (event) {
    var target = event.target;

    var $modalHost = $(target).parents().find('.modalHost:last');
    var $message = $modalHost.find('.modal-content');
    var $title = $modalHost.find('.modal-content').find('.modal-header');
    var $content = $modalHost.find('.modal-content').find('.modal-body');

    dragInit(event, $modalHost, $title, $content, $message);
    return false;
});
