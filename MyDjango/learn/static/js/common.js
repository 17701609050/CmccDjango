/**这个文件主要就是存储一些公共的JS方法  **/

jQuery.cookie = function(name, value, options) {
	if(typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if(value === null) {
			value = '';
			options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
			options.expires = -1;
		}
		var expires = '';
		if(options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if(typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
		// NOTE Needed to parenthesize options.path and options.domain
		// in the following expressions, otherwise they evaluate to undefined
		// in the packed version for some reason...
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if(document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for(var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if(cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};

/**兼容IE8的数组操作的方法**/
if(!('indexOf' in Array.prototype)) {
	Array.prototype.indexOf = function(find, i /*opt*/ ) {
		if(i === undefined) i = 0;
		if(i < 0) i += this.length;
		if(i < 0) i = 0;
		for(var n = this.length; i < n; i++)
			if(i in this && this[i] === find)
				return i;
		return -1;
	};
}
if(!('lastIndexOf' in Array.prototype)) {
	Array.prototype.lastIndexOf = function(find, i /*opt*/ ) {
		if(i === undefined) i = this.length - 1;
		if(i < 0) i += this.length;
		if(i > this.length - 1) i = this.length - 1;
		for(i++; i-- > 0;) /* i++ because from-argument is sadly inclusive */
			if(i in this && this[i] === find)
				return i;
		return -1;
	};
}
if(!('forEach' in Array.prototype)) {
	Array.prototype.forEach = function(action, that /*opt*/ ) {
		for(var i = 0, n = this.length; i < n; i++)
			if(i in this)
				action.call(that, this[i], i, this);
	};
}
if(!('map' in Array.prototype)) {
	Array.prototype.map = function(mapper, that /*opt*/ ) {
		var other = new Array(this.length);
		for(var i = 0, n = this.length; i < n; i++)
			if(i in this)
				other[i] = mapper.call(that, this[i], i, this);
		return other;
	};
}
if(!('filter' in Array.prototype)) {
	Array.prototype.filter = function(filter, that /*opt*/ ) {
		var other = [],
			v;
		for(var i = 0, n = this.length; i < n; i++)
			if(i in this && filter.call(that, v = this[i], i, this))
				other.push(v);
		return other;
	};
}
if(!('every' in Array.prototype)) {
	Array.prototype.every = function(tester, that /*opt*/ ) {
		for(var i = 0, n = this.length; i < n; i++)
			if(i in this && !tester.call(that, this[i], i, this))
				return false;
		return true;
	};
}
if(!('some' in Array.prototype)) {
	Array.prototype.some = function(tester, that /*opt*/ ) {
		for(var i = 0, n = this.length; i < n; i++)
			if(i in this && tester.call(that, this[i], i, this))
				return true;
		return false;
	};
}

/**函数冻结**/
window.processor = {
	timeoutId: null,
	performProcessing: function() {

	},
	process: function() {
		clearTimeout(this.timeoutId);
		var that = this;
		this.timeoutId = setTimeout(function() {
			that.performProcessing();
		}, 250);
	}
}

function getLable(dropdown, value) {
	var label = value;
	dropdown.forEach(function(item) {
		if($.trim(item.value) == $.trim(value)) {
			label = item.label;
		}
	});
	return label;
}

function initSelect(dropdown) {
	var select = $('<select class="form-control input-sm">');
	dropdown.forEach(function(item) {
		var option = $('<option>').attr('value', item.value).text(item.label);
		select.append(option);
	});
	select.click(function(event) {
		event.stopPropagation();
	});
	return select;
}

function initStringLong(s) {
	if(s.length > 90) {
		return s.substring(0, 90) + '...'
	} else {
		return s;
	}
}

function couldWrite(Project_owner, userName, status) {
	var flag = false;
	for(i in Project_owner) {
		if($.trim(Project_owner[i]) == $.trim(userName)) {
			flag = true;
		}
	}
	if(status == 'Cancel') {
		flag = false;
	}
	return flag;
}

function init0to9(num) {
	if(parseInt(num) <= 9) {
		return '0' + num;
	} else {
		return num;
	}

}

//yyyy-MM-dd
function getDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	return year + "-" + init0to9(month) + "-" + init0to9(day);
}
//yyyy-MM-dd HH:mm:SS
function getDateTime(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();
	return year + "-" + init0to9(month) + "-" + init0to9(day) + " " + hh + ":" + mm + ":" + ss;
}

function divGT(first, second) {
	if(second) {
		return parseFloat((first / second).toFixed(2));
	} else {
		return 0;
	}
}

function getContentHeightHalf() {
	var h = ($(document).height() - 250) / 2;
	if(h < 200) {
		h = 200;
	}
	return h;
}

function getContentHeight() {
	var h = $(document).height() - 300;
	if(h < 250) {
		h = 250;
	}
	return h;
}