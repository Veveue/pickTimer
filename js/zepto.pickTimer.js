;
(function($, window, document, undefined) {
	'use strict';
	var pluginName = 'pickTimer',
		defaults = {},
		liH,
		startY,
		endY,
		distY,
		cTop,
		_top,
		timeS,
		distT,
		speed;

	function Plugin(element, options) {
		this.element = $(element);
		this.options = options;

		this.init(); // 初始化
		this.render(); //渲染
		this.handleEvent(); // 绑定事件
	}

	Plugin.prototype = {
		init: function() {
			this._defaults = defaults;
			this._name = pluginName;
		},
		render: function() {
			var _length = this.element.data('length');
			// console.log(_length);

			for(var i = 0; i < _length; i++) {
				this.element.find('.list').append('<li>' + (i >= 10 ? i : '0' + i) + '</li>')
			}

			this.element.find('li').eq(2).addClass('active');

			liH = this.element.find('li').eq(0).height();
		},
		handleEvent: function() {
			this.element.on('touchstart', this.startCallBack); // 下滑开始
			this.element.on('touchmove', this.moveCallBack); // 滑动的时候
			this.element.on('touchend', this.endCallBack); // 滑动结束的时候
		},
		startCallBack: function(e) {
			startY = e.touches[0].pageY;
			cTop = $(this).find('.list').position().top;
			timeS = new Date();
			console.log(cTop);

		},
		moveCallBack: function(e) {
			endY = e.touches[0].pageY;
			distY = endY - startY;
			console.log(distY);
			// console.log(this);

			if(cTop + distY > 0) {
				_top = 0;
			} else if(cTop + distY < $(this).height() - $(this).find('.list').height()) {
				_top = $(this).height() - $(this).find('.list').height();
			} else {
				_top = cTop + distY;
			}

			_top -= _top % liH;

			$(this).find('.list').css('top', _top);

			$(this).find('li').eq(Math.abs(_top / liH) + 2).addClass('active').siblings().removeClass('active');

		},
		endCallBack: function(e) {
			var $this = $(this);
			var dir = distY < 0 ? 1 : -1;
			distT = new Date() - timeS;

			speed = Math.abs(distY / distT); // 单位是px/ms
			console.log(dir);

			if(speed > 0.6) {
				if(dir == 1 && Math.abs(_top / liH) + 5 == $(this).find('li').length - 1)
					return;
			} else if(dir == -1 && _top == 0) {
				return;
			}

			setTimeout(function() {
				$this.find('.list').css('top', _top - 40 * dir);
				$this.find('li').eq(Math.abs(_top / liH) + 2 + dir).addClass('active').siblings().removeClass('active');
			}, 350)

		}

	}

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$(this).data('plugin_' + pluginName)) {
				$(this).data('plugin_' + pluginName, new Plugin(this, options));
			}
		})

	}

})(Zepto, window, document)