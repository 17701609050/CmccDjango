app = angular.module('myApp', []);

app.config(['$interpolateProvider',
	function($interpolateProvider) {
		$interpolateProvider.startSymbol('{[');
		$interpolateProvider.endSymbol(']}');
	}
]);

app.config(['$httpProvider',
	function($httpProvider) {
		//initialize get if not there
		if(!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {};
		}

		// Answer edited to include suggestions from comments
		// because previous version of code introduced browser-related errors
		//disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		// extra
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}
]);
app.config(['$httpProvider', function($httpProvider) {
	// Intercept POST requests, convert to standard form encoding
	$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
		var key, result = [];

		if(typeof data === "string")
			return data;

		for(key in data) {
			if(data.hasOwnProperty(key))
				result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
		}
		return result.join("&");
	});
}]);

app.controller("summaryEnterHouse", function($scope, $http, $timeout) {

	$scope.dropdowns = window.dropdowns;
	$scope.enums = window.enums;

	$scope.showProjectByPassOrSend = true;
	$scope.showProjectByVersion = false;

	$scope.sumEnterHouseTime = true;
	$scope.sumEnterHousePro = false;
	$scope.sumQuestionNum = false;

	$scope.jumpTo = function(url) {
		url = url + '?difference_meeting=' + $scope.queryForm.difference_meeting.value + '&chip_name=' + $scope.queryForm.chip_name.value + '&cust_name=' + encodeURI($scope.queryForm.cust_name.value) + '&start_date=' + $scope.queryForm.start_date.value + '&end_date=' + $scope.queryForm.end_date.value + '&summary_type=' + $scope.queryForm.summary_type.value;
		window.location.href = url;
	}

	$scope.initQueryForm = function() {
		var params = window.location.search.substring(1).split('&');
		params = params.map(function(item) {
			var t = item.split('=');
			return {
				id: t[0],
				value: t[1]
			}
		});
		for(i in $scope.queryForm) {
			var value = '';
			params.forEach(function(param) {
				if(param.id == i) {
					value = param.value;
				}
			});
			$scope.queryForm[i].value = value;
		}
		$scope.queryForm.cust_name.value = decodeURI($scope.queryForm.cust_name.value)
		var option = $('<option>').val($scope.queryForm.cust_name.value).text($scope.queryForm.cust_name.value);
		$('#selectAll').append(option);
		var sel = $('#selectAll').select2({
			ajax: {
				url: function() {
					var t = (new Date()).getTime();
					return '/project/get_project_name/all?chip_name=' + $scope.queryForm.chip_name.value + '&t=' + t;
				},
				delay: 250,
				processResults: function(data) {
					data = eval('(' + data + ')');
					var results = [];
					results = data.data.map(function(item) {
						return {
							id: item,
							text: item
						}
					});
					results.unshift({
						id: '',
						text: '--全部--'
					});

					return {
						results: results
					}

				}
			}

		});
		sel.val($scope.queryForm.cust_name.value).trigger("change");
		setTimeout(function() {
			$('#searchFormContainer').removeClass('displayNone');
		}, 100);
	}

	$scope.queryForm = {
		chip_name: {
			label: '芯片',
			value: '',
			required: {
				message: '芯片名称不能为空'
			}
		},
		cust_name: {
			label: '客户',
			value: '',
			required: {
				message: '客户名称不能为空'
			}
		},
		start_date: {
			label: '从',
			value: '',
			required: {
				message: '客户名称不能为空'
			}
		},
		end_date: {
			label: '至',
			value: '',
			required: {
				message: ''
			}
		},
		summary_type: {
			label: '统计方式',
			value: window.enums.summary_type.month.value,
			required: {
				message: '客户名称不能为空'
			}
		},
		difference_meeting: {
			label: '影响上会',
			value: window.enums['diff_onmeeting'].YES.value,
			required: {
				message: '客户名称不能为空'
			}
		}
	};
	$scope.initQueryForm();

	$http({
		method: 'GET',
		url: '/project/get_chip_name'
	}).then(function(response) {
		$scope.dropdowns['chips'] = response.data.data.map(function(item) {
			return {
				label: item[0],
				value: item[0]
			}
		});
	});

	$scope.toggPassOrSend = function() {
		$scope.showProjectByPassOrSend = true;
		$scope.showProjectByVersion = false;
	}
	$scope.togVersion = function() {
		$scope.showProjectByPassOrSend = false;
		$scope.showProjectByVersion = true;
	}

	$('.timeRange').datetimepicker({
		lang: 'ch',
		timepicker: false,
		format: 'Y-m-d'
	});
	$scope.$watch('queryForm', function() {
		window.summary_type = $scope.queryForm.summary_type.value;
		if(!window.pageReady) {
			return;
		}
		summaryProByVersionTotal($scope.queryForm);
	}, true);
	summaryProByVersionTotal($scope.queryForm);
});

function summaryProByVersionTotalDetails(columns, serious) {
	
	$('#summaryProByVersionTotal').highcharts({
		title: {
			text: '项目通过时间(累计)',
			x: -20 //center
		},
		chart:{
			height:getContentHeight()
		},

		xAxis: {
			categories: columns
		},
		yAxis: {
			title: {
				text: '天数'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: '天'
		},
		legend: {
			align: 'center',
			verticalAlign: 'bottom',
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		series: serious
	});
}

function summaryProByVersionTotal(queryForm) {
	var t = {};
	for(i in queryForm) {
		t[i] = queryForm[i].value;
	}
	t['type'] = 'sumPassCycletime';
	t['period_type'] = t['summary_type'];
	$.ajax({
		type: "get",
		url: "/summary/project",
		data: t,
		async: true,
		success: function(response) {
			response = eval('(' + response + ')');
			if(response.state == 200) {
				var responseData = response.data;
				var pass_times = responseData.pass_time;
				var pass_totals = responseData.total;
				var weeks = pass_times.map(function(item) {
					return {
						year: item[0].substring(0, 4),
						month: init0to9(item[0].substring(4)),
						pass_time: item[1],
						year_and_month: item[0].substring(0, 4) + '' + init0to9(item[0].substring(4))
					}
				});

				weeks_pass_time = weeks.sort(function(first, next) {
					return first.year_and_month - next.year_and_month;
				});

				var columns = weeks_pass_time.map(function(item) {
					if(window.summary_type == window.enums.summary_type.week.value) {
						return item.year + '年' + item.month + '周';
					} else {
						return item.year + '年' + item.month + '月';
					}
				});

				var pass_time = weeks_pass_time.map(function(item) {
					return item.pass_time;
				});
				pass_time = {
					name: '通过项目的平均时间',
					data: pass_time,
					color:window.passTimeColor.single
				}

				var pass_totals = responseData.total;
				var weeks = pass_totals.map(function(item) {
					return {
						year: item[0].substring(0, 4),
						month: init0to9(item[0].substring(4)),
						total: item[1],
						year_and_month: item[0].substring(0, 4) + '' + init0to9(item[0].substring(4))
					}
				});
				weeks = weeks.sort(function(first, next) {
					return first.year_and_month - next.year_and_month;
				});

				var totalDays = 0;
				var totalProjects = 0;
				var pass_time_total = weeks.map(function(item) {
					var avgTime = 0;
					weeks_pass_time.forEach(function(itemSub) {
						if(item.year_and_month == itemSub.year_and_month) {
							totalDays = totalDays + (itemSub.pass_time * item.total);
							totalProjects = totalProjects + item.total;
							if(totalProjects) {
								avgTime = totalDays / totalProjects;
								avgTime = parseFloat(avgTime.toFixed(2));
							} else {
								avgTime = 0;
							}

						}
					});
					return avgTime;
				});
				pass_time_total = {
					name: '通过项目的平均时间（累计）',
					data: pass_time_total,
					color:window.passTimeColor.avg
				}

				summaryProByVersionTotalDetails(columns, [pass_time, pass_time_total]);
			}
		}
	});
}

$(document).ready(function() {
	window.pageReady = 1;
});