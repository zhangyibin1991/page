function Page(data){
	
	this.prototype = Object.prototype;

	_DEFAULT_OPTIONS = {
		TOTAL_PAGE_COUNT: -1,		/* 总的页数 */
		TOTAL_RECODE_COUNT: -1,		/* 总的记录条数 */
		CURRENT_PAGE: 1,			/* 当前页 */
		PAGE_SIZE: 20,				/* 每页显示的记录条数 */
		PAGE_BUTTON_COUNT: -1,		/* 页面显示总的按钮数量, <= 0时显示全部 */
		TOTAL_PAGE_ENABLE: false,	/* 是否显示总的页数 */
		TOTAL_RECODE_ENABLE: false,	/* 是否显示总的条数 */
		JUMP_ENABLE: false,			/* 是否显示跳转 */
		FIRST_END_ENABLE: true,	/* 是否显示首页和末页 */
		
		REQUEST_TYPE: "JSON",
		REQUEST_URL: "#"
	}


	this.options = {
		i18n: {
			total: "共&nbsp;{0}&nbsp;条",
			totalPage: "{0}&nbsp;页",
			first: "首页",
			last: "末页",
			prev: "上一页",
			next: "下一页",
			more: "...",
			jump: "跳转到{0}页",
			go: "GO"
		},
		
		/* 总的页数 */
		totalPage: _DEFAULT_OPTIONS.TOTAL_PAGE_COUNT,
		/* 总的记录条数 */
		totalRecode: _DEFAULT_OPTIONS.TOTAL_RECODE_COUNT,
		/* 当前页 */
		currentPage: _DEFAULT_OPTIONS.CURRENT_PAGE,
		/* 每页显示的记录条数 */
		pageSize: _DEFAULT_OPTIONS.PAGE_SIZE,
		/* 页面显示总的按钮数量, <= 0时显示全部 */
		pageButtonCount: _DEFAULT_OPTIONS.PAGE_BUTTON_COUNT,
		/* 是否显示总的页数 */
		showTotalPage: _DEFAULT_OPTIONS.TOTAL_PAGE_ENABLE,
		/* 是否显示总的条数 */
		showTotalRecode: _DEFAULT_OPTIONS.TOTAL_RECODE_ENABLE,
		/* 是否显示首页、末页 */
		showFirstEnd: _DEFAULT_OPTIONS.FIRST_END_ENABLE,
		/* 是否显示跳转 */
		showJump: _DEFAULT_OPTIONS.JUMP_ENABLE,
		/* 数据提交方式 */
		type: _DEFAULT_OPTIONS.REQUEST_TYPE,
		/* JSON获取的URL */
		url: _DEFAULT_OPTIONS.REQUEST_URL,
		/* JSON回调函数 */
		callBack: function(){},
		/* 请求的参数 */
		param:{},
		/* 是否前端分页 */
		isFront: false,
		/* 前端分页所持有的记录数据 */
		data:{}
	}
	
	this.default_param = {
		currentPageParam: "current-page"
	}
	
	_init_data= function(){
		var _this = this;
		if(data && data.options){
			$.extend(true, _this.options, data.options) 
		}
		
		if(data && data.params){
			$.extend(true, _this.default_param, data.param);
		}
		
		/* 判断是否前端分页 */
		if(_this.options.isFront){
			// 检测pageSize数据有效性
			if(isNaN(_this.options.pageSize) || _this.options.pageSize < 1){
				_this.options.pageSize = _this._DEFAULT_OPTIONS.PAGE_SIZE;
			}
			// 计算totalRecode
			// _this.options.data需要是数组，否则无法遍历
			if(_this.options.data && _this.options.data.constructor == Array){
				_this.options.totalRecode = _this.options.data.length;
			}else{
				_this.options.totalRecode = 0;
			}
			
			// 计算totalPage
			_this.options.totalPage = Math.ceil(_this.options.totalRecode / _this.options.pageSize);
			
		}else{
			// FORM提交方式请求数据，可以不需要totalRecode, 设置totalRecode可以用来显示总共有几页;
			// FORM提交方式请求数据，不需要pageSize
			// 设置了totalPage（要求符合要求）之后忽略totalRecode和pageSize;
			if(_this.options.totalPage == null
				|| _this.options.totalPage == undefined
				|| isNaN(_this.options.totalPage)
				|| _this.options.totalPage < 1){
				// 根据pageSize和totalRecode计算totalPage
				// 检测pageSize数值有效性，不存在/非数值/<1的情况下，设置为默认值。
				if(!_this.options.pageSize || isNaN(_this.options.pageSize) || _this.options.pageSize <= 0){
					_this.options.pageSize = _DEFAULT_OPTIONS.PAGE_SIZE;		
				}
				
				// 检测totalRecode数值有效性，不存在/非数值/<1的情况下，设置为默认值。
				if(!_this.options.totalRecode || isNaN(_this.options.totalRecode) || _this.options.totalRecode < 0){
					_this.options.totalRecode = _DEFAULT_OPTIONS.TOTAL_RECODE_COUNT;
				}
				
				// 根据pageSize和totalRecode计算总的页数。
				_this.options.totalPage 
					= Math.ceil(_this.options.totalRecode / _this.options.pageSize);
			}
		}
		
		// 判断currentPage有效性
		if(!_this.options.currentPage || _this.options.currentPage < 0){
			_this.options.currentPage = _DEFAULT_OPTIONS.CURRENT_PAGE;
		} else if(_this.options.currentPage > _this.options.totalPage) {
			_this.options.currentPage = _this.options.totalPage;
		}
		
		return true;
	}

	/* 组装分页组件 */
	_assemble= function(){
		var _this = this;
		if(!_this.options.totalPage){
			console.debug("Has no page: Total page ==> 0!");
			return false;
		}
		var $ul = $("<ul/>", {"class": "page"});
		
		// 是否显示总的页数
		// 是否显示总的记录条数
		if(_this.options.showTotalPage || _this.options.showTotalRecode){
			var $li = $("<li/>", {"class": "info"});
			var content = "";
			var totalPageContent = "";
			var totalRecodeContent = "";
			// 显示总的记录条数
			if(_this.options.showTotalRecode){
				totalRecodeContent = getMessage(_this.options.i18n.total, [_this.options.totalRecode]);
			}
			// 显示总的页数
			if(_this.options.showTotalPage){
				totalPageContent = getMessage(_this.options.i18n.totalPage, [_this.options.totalPage]);
			}
			
			if(_this.options.showTotalPage && _this.options.showTotalRecode){
				content = totalRecodeContent + "&nbsp;|&nbsp;" + totalPageContent;
			}else if(_this.options.showTotalPage && !_this.options.showTotalRecode){
				content = totalPageContent;
			}else{
				content = totalRecodeContent;
			}
			$li.html(content).appendTo($ul);
		}
		
		// 显示分页按钮
		if(_this.options.showFirstEnd){
			// 首页
			var $first = $("<li/>", {"class": "first"})
						.html(getMessage(_this.options.i18n.first))
						.appendTo($ul);
		}
		// 上一页
		var $prev = $("<li/>", {"class": "prev"})
						.html(getMessage(_this.options.i18n.prev))
						.appendTo($ul);
		if(_this.options.currentPage == 1){
			$first.addClass("disabled");
			$prev.addClass("disabled");
		}
		// 页号
		// 是否显示全部页号
		var lis;
		if(_this.options.pageButtonCount < 1
			|| (_this.options.pageButtonCount > 0 
				&&_this.options.pageButtonCount >= _this.options.totalPage)){
			// 全部显示
			lis = _createPageButton.apply(_this);
		}else {
			var buttonCount = _this.options.pageButtonCount;
			// 部分显示
			if(_this.options.pageButtonCount % 2 == 0){
				// 偶数
				// 使其变成奇数，利于处理
				buttonCount = _this.options.pageButtonCount - 1;
			}
			// 使当前页能够处于所有按钮的中间
			var from = 1;
			var end = buttonCount + from - 1;
			// 1 2 3 4 5 6 7...
			// ... 2 3 4 5 6 7 8 ...
			// ... 6 7 8 9 10 11
			var harf = (buttonCount -1) / 2;
			if(_this.options.currentPage < harf){
				
			}else if(_this.options.currentPage > _this.options.totalPage - harf){
				from = _this.options.totalPage - buttonCount + 1;
				end = _this.options.totalPage;
			}else{
				from = _this.options.currentPage - harf;
				end = _this.options.currentPage + harf ;
			}
			
			lis = _createPageButton.apply(_this,[from, end]);
			var $more = $("<li/>", {"class": "more"})
						.html(_this.options.i18n.more);
			if(_this.options.currentPage < harf){
				lis.push($more.clone().addClass("right-more").get(0));
			}else if(_this.options.currentPage > _this.options.totalPage - harf){
				lis.unshift($more.clone().addClass("left-more").get(0));
			}else{
				lis.unshift($more.clone().addClass("left-more").get(0))
				lis.push($more.clone().addClass("right-more").get(0));
			}
		}
		
		$(lis).each(function(){
			if($(this).data("page") == _this.options.currentPage){
				$(this).addClass("current-page");
			}
			$(this).appendTo($ul);
		});
		// 下一页
		var $next = $("<li/>", {"class": "next"})
						.html(_this.options.i18n.next)
						.appendTo($ul);
		if(_this.options.showFirstEnd){
			// 末页
			var $last = $("<li/>", {"class": "last"})
					.html(_this.options.i18n.last)
					.appendTo($ul);
		}
		
		if(_this.options.currentPage == _this.options.totalPage){
			$next.addClass("disabled");
			$last.addClass("disabled");
		}
		
		// 是否显示跳转
		if(_this.options.showJump){
			var $jump = $("<li/>", {"class": "goto"})
					.html(getMessage(_this.options.i18n.jump, ["<input type='text' id='goto-page' />"])
						+ "&nbsp;"
				).append($("<a/>", {href: "#", id: "goto"}).html(_this.options.i18n.go))
				.appendTo($ul);
		}
		$(_this.options.parent).append($ul);
		
		return $ul;
	}
	
	_createPageButton= function(from, length){
		var _this = this;
		var lis = [];
		if(!from){
			from = 1;
		}
		
		if(!length){
			length = _this.options.totalPage;
		}
		
		for(var index = from; index <= length; index++){
			lis.push($("<li/>", {"data-page": index,
									"class": "page-button"})
				.html(index)
				.get(0));
		}
		return lis;
	}
	
	_addEvent = function(){
		var _this = this;
		var currentPage = 1;
		_$ul.delegate(".first:not('.disabled')", "click", function(){
			currentPage = 1;
			_request.apply(_this, [currentPage]);
			return false;
		});
		
		_$ul.delegate(".prev:not('.disabled')", "click", function(){
			currentPage = _this.options.currentPage - 1;
			currentPage = _validateCurrentPage.apply(_this, [currentPage]);
			_request.apply(_this, [currentPage]);
			return false;
		});
		
		_$ul.delegate(".next:not('.disabled')", "click", function(){
			currentPage = _this.options.currentPage + 1;
			currentPage = _validateCurrentPage.apply(_this, [currentPage]);
			_request.apply(_this, [currentPage]);
			return false;
		});
		
		_$ul.delegate(".last:not('.disabled')", "click", function(){
			currentPage = _this.options.totalPage;
			currentPage = _validateCurrentPage.apply(_this, [currentPage]);
			_request.apply(_this, [currentPage]);
			return false;
		});
		
		_$ul.delegate(".page-button:not('.current-page')", "click", function(){
			currentPage = $(this).data("page");
			currentPage = _validateCurrentPage.apply(_this, [currentPage]);
			_request.apply(_this, [currentPage]);
			return false;
		})
		
		_$ul.delegate("a#goto", "click", function(){
			currentPage = _$ul.find("#goto-page").val();
			currentPage = _validateCurrentPage.apply(_this, [currentPage]);
			_request.apply(_this, [currentPage]);
			return false;
		});
	}
	
	_validateCurrentPage = function(currentPage){
		var _this = this;
		if(currentPage == null || currentPage == undefined
			|| isNaN(currentPage) || currentPage < 0){
			return _DEFAULT_OPTIONS.CURRENT_PAGE;		
		}
		return currentPage <= _this.options.totalPage ? currentPage : _this.options.totalPage;
	}
	
	_request = function(page){
		var _this = this;
		if(_this.options.isFront){
			var offset = (page - 1) * _this.options.pageSize;
			var recodes = [];
			for(var index = 0; index < _this.options.pageSize; index++){
				recodes.push(_this.options.data[index + offset]);
			}
			_this.options.callBack.apply(_this, [recodes]);
			_this.flush(page);
			return false;
		}else{
			var formData = {};
				formData[_this.default_param.currentPageParam] = page;
			if(_this.options.type == "JSON"){
				// ajax请求
				$.getJSON(_this.options.url,
					$.extend(true, _this.options.param, formData),
					function(data, status, xhr){
						_this.options.callBack.apply(_this, [data, status, xhr]);
						_this.flush(page);
					})
				return false;
			}else{
				// form提交方式
				var $form;
				$form = $("<form/>", {action: _this.options.url, method: "POST"});
				$.extend(true, formData, _this.options.param)
				for(var attr in formData){
					$form.append($("<input/>", {type: "hidden",
						name: attr,
						value: formData[attr]}))
				}
				$form.submit();
				return false;
			}
		}
	}
	
//	_display = function(){
//		var parent = this.options.parent;
//		if(!parent){
//			parent = document.body;
//		}
//		$(parent).append(_$ul);
//	}
	
	_init_data.apply(this);
	_$ul = _assemble.apply(this);
	
	if(_$ul){
		_addEvent.apply(this);
//		_display.apply(this);
	}
	
	this.getComponent= function(){
		return _$ul;
	}
	
	this.flush= function(currentPage){
		var _this = this;
		currentPage = _validateCurrentPage.apply(this, [currentPage]);
		_this.options.currentPage = currentPage;
		if(currentPage == 1){
			_$ul.find(".first,.prev").addClass("disabled");
		}else{
			_$ul.find(".first,.prev").removeClass("disabled")
		}
		
		if(currentPage == this.options.totalPage){
			_$ul.find(".next,.last").addClass("disabled");
		}else{
			_$ul.find(".next,.last").removeClass("disabled");
		}
		
		if(_this.options.pageButtonCount < 1
			|| (_this.options.pageButtonCount > 0 
				&&_this.options.pageButtonCount >= _this.options.totalPage)){
			// 全部显示
			_$ul.find(".current-page").removeClass("current-page");
			_$ul.find(".page-button").each(function(){
				if($(this).data("page") == currentPage){
					$(this).addClass("current-page");
				}
			});
		}else {
			var buttonCount = _this.options.pageButtonCount;
			// 部分显示
			if(_this.options.pageButtonCount % 2 == 0){
				// 偶数
				// 使其变成奇数，利于处理
				buttonCount = _this.options.pageButtonCount - 1;
			}
			// 使当前页能够处于所有按钮的中间
			var from = 1;
			var end = buttonCount + from - 1;
			// 1 2 3 4 5 6 7...
			// ... 2 3 4 5 6 7 8 ...
			// ... 6 7 8 9 10 11
			var harf = (buttonCount -1) / 2;
			var $more = $("<li/>", {"class": "more"})
						.html(_this.options.i18n.more);
			if(_this.options.currentPage <= harf){
				_$ul.find(".left-more").remove();
				if(_$ul.find(".right-more").size() == 0){
					_$ul.find(".next").before($more.clone().addClass("right-more")[0]);
				}
			}else if(_this.options.currentPage > _this.options.totalPage - harf){
				from = _this.options.totalPage - buttonCount + 1;
				end = _this.options.totalPage;
				
				_$ul.find(".right-more").remove();
				
				if(_$ul.find(".left-more").size() == 0){
					_$ul.find(".prev").after($more.clone().addClass("left-more")[0]);
				}
			}else{
				from = _this.options.currentPage - harf;
				end = _this.options.currentPage + harf;
				
				if(_$ul.find(".right-more").size() == 0){
					_$ul.find(".next").before($more.clone().addClass("right-more")[0]);
				}
				
				if(_$ul.find(".left-more").size() == 0){
					_$ul.find(".prev").after($more.clone().addClass("left-more")[0]);
				}
			}
			
			_$ul.find(".page-button").each(function(index){
				var $new = $("<li/>", {"class": "page-button", "data-page": index + from})
						.html(index + from)
						.data("page", index + from)
				if(index + from == currentPage){
					$new.addClass("current-page");
				}
				
				$(this).replaceWith($new);
			});
		}
	}
	
	return this;
}


function getMessage(str, param){
	var regexp = new RegExp("\{\\d+\}","g");
	var result;
	while((result = regexp.exec(str)) != null){
		// alert(result + regexp.lastIndex);
		var fromIndex = result.index;
		var paramIndex = result[0].substring(1, result[0].length - 1);
		var paramValue;
		if(param[paramIndex] == undefined 
			|| param[paramIndex] == null){
			paramValue = result[0]
		}else{
			paramValue = param[paramIndex];
		}
		str = str.substring(0, fromIndex) 
				+ paramValue
				+ str.substring(regexp.lastIndex, str.length);
		regexp.lastIndex = 0;
	}
	
	return str;
}

$.fn.page = function(options, params){
	var default_params = {
		totalPageDataParam: "total-page", 	/* 总的页数传递参数名，默认方式data-total-page */
		totalRecodeDataParam: "total-recode",/* 总的记录条数参数名，默认方式data-total-recode */
		pageSizeDataParam: "page-size",		/* 每页显示条数参数名，默认方式data-page-size */
	
		currentPageParam: "current-page"
	}
	
	var data = {};
	if(options){
		data.options = options;
	}
	
	if(params){
		data.param = $.extend(true, default_params, params);
	}
	
	// 获取totalPageCount
	if(!isNaN(this.data(default_params.totalPageDataParam))
		&& this.data(default_params.totalPageDataParam) > 0){
		data.options.totalPage = this.data(default_params.totalPageDataParam);
	}
	// 获取pageSize
	if(!isNaN(this.data(default_params.pageSizeDataParam))
		&& this.data(default_params.pageSizeDataParam) > 0){
		data.options.pageSize = this.data(default_params.pageSizeDataParam);
	}
	
	// 获取currentPage
	if(!isNaN(this.data(default_params.currentPageParam))
		&& this.data(default_params.currentPageParam) > 0){
		data.options.currentPage = this.data(default_params.currentPageParam);
	}
	// 获取totalRecodeCount
	if(!isNaN(this.data(default_params.totalRecodeDataParam))
		&& this.data(default_params.totalRecodeDataParam) > 0){
		data.options.totalRecode = this.data(default_params.totalRecodeDataParam);
	}
	data.parent = this;
	var page = new Page(data);
	var companent = page.getComponent();
	this.append(companent);
}
