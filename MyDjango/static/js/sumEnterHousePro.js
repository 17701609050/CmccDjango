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

	$scope.sumEnterHouseTime = false;
	$scope.sumEnterHousePro = true;
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
			if(value) {
				$scope.queryForm[i].value = value;
			}
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
			value: (function() {
				var date = new Date();
				var t = date.getTime() - (1000 * 60 * 60 * 24 * window.beforeDays);
				date = new Date(t);
				return getDate(date);
			})(),
			required: {
				message: '客户名称不能为空'
			}
		},
		end_date: {
			label: '至',
			value: (function() {
				var date = new Date();
				return getDate(date);
			})(),
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
	}
	$scope.initQueryForm();

	$scope.$watch('queryForm', function() {

		window.summary_type = $scope.queryForm.summary_type.value;
		if(!window.pageReady) {
			return;
		}
		for(i in $scope.summaryFunctions) {
			$scope.summaryFunctions[i].fun($scope.queryForm);

		}
	}, true);

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

	$('#selectAll').select2({
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
				})
				return {
					results: results
				}
			}
		}
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

	$scope.summaryFunctions = {
		summaryProByPassOrSend: {
			fun: summaryProByPassOrSend,
			label: '统计通过或者pass的项目数'
		},
		summaryProByVersion: {
			fun: summaryProByVersion,
			label: '按通过轮次统计项目数'
		}
	}
	for(i in $scope.summaryFunctions) {
		$scope.summaryFunctions[i].fun($scope.queryForm);
	}
});

function summaryProByPassOrSend(queryForm) {

	var t = {};
	for(i in queryForm) {
		t[i] = queryForm[i].value;
	}
	t['type'] = 'sumSendAndPassPro';
	t['period_type'] = t['summary_type'];
	window.HighchartsHight = getContentHeightHalf();

	$.ajax({
		type: "get",
		url: "/ajaxproject",
		async: true,
		data: t,
		success: function(response) {
			response = eval('(' + response + ')');
			if(response.state == 200) {
				var data = response.data;
				var weeks = data.pass_result.map(function(item) {
					return {
						year: item[0].substring(0, 4),
						month: init0to9(item[0].substring(4)),
						pass_result: item[1],
						year_and_month: item[0].substring(0, 4) + '' + init0to9(item[0].substring(4))
					}
				});
				weeks = weeks.sort(function(first, next) {
					return first.year_and_month - next.year_and_month;
				});
				var columns = weeks.map(function(item) {
					if(window.summary_type == window.enums.summary_type.week.value) {
						return item.year + '年' + item.month + '周';
					} else {
						return item.year + '年' + item.month + '月';
					}

				});

				var pass_result = weeks.map(function(item) {
					return item.pass_result;
				});

				pass_result = {
					name: '通过项目数',
					data: pass_result,
					color: window.colorsPassOrTest.pass
				}

				var currentData = 0;
				var weeksTotal = weeks.map(function(item) {
					currentData = currentData + item.pass_result;
					return {
						year: item.year,
						month: item.month,
						pass_result: currentData,
						year_and_month: item.year_and_month
					}
				});

				var pass_result_total = weeksTotal.map(function(item) {
					return item.pass_result;
				});
				pass_result_total = {
					name: '通过项目数',
					data: pass_result_total,
					color: window.colorsPassOrTest.pass
				}

				var weeks = data.test_result.map(function(item) {
					return {
						year: item[0].substring(0, 4),
						month: item[0].substring(4),
						test_result: item[1],
						year_and_month: item[0].substring(0, 4) + '' + init0to9(item[0].substring(4))
					}
				});

				weeks = weeks.sort(function(first, next) {
					return first.year_and_month - next.year_and_month;
				});

				var test_result = weeks.map(function(item) {
					return item.test_result;
				});

				test_result = {
					name: '送测项目数',
					data: test_result,
					color: window.colorsPassOrTest.test
				}

				var currentData = 0;
				var weeksTotal = weeks.map(function(item) {
					currentData = currentData + item.test_result;
					return {
						year: item.year,
						month: item.month,
						test_result: currentData,
						year_and_month: item.year_and_month
					}
				});

				var test_result_total = weeksTotal.map(function(item) {
					return item.test_result;
				});
				test_result_total = {
					name: '送测项目数(累计)',
					data: test_result_total,
					color: window.colorsPassOrTest.test
				}

				var serius = [pass_result, test_result];
				summaryProByPassOrSendDetail(columns, serius);

				var seriusTotal = [pass_result_total, test_result_total];
				summaryProByPassOrSendTotalDetail(columns, seriusTotal);

			}
		}
	});
}

function summaryProByVersion(queryForm) {

	var t = {};
	for(i in queryForm) {
		t[i] = queryForm[i].value;
	}
	t['type'] = 'sumPassVersion';
	t['period_type'] = t['summary_type'];
	window.HighchartsHight = getContentHeightHalf();

	$.ajax({
		type: "get",
		url: "/ajaxproject",
		async: true,
		data: t,
		success: function(response) {
			response = eval('(' + response + ')');
			if(response.state == 200) {
				var data = response.data;
				//首先排序  

				data = data.map(function(item) {
					return {
						year: item[0].substring(0, 4),
						month: item[0].substring(4),
						V1: item[1].V1,
						V2: item[1].V2,
						V3: item[1].V3,
						yearAndMonth: item[0].substring(0, 4) + '' + init0to9(item[0].substring(4))
					}
				});

				data.sort(function(first, second) {
					return parseInt(first.yearAndMonth) - parseInt(second.yearAndMonth);
				});

				//计算columns 
				var columns = data.map(function(item) {
					if(window.summary_type == window.enums.summary_type.week.value) {
						return item.year + '年' + item.month + '周';
					} else {
						return item.year + '年' + item.month + '月';
					}
				});

				// 计算v1 v2 v3 
				var v1s = data.map(function(item) {
					return item.V1;
				});
				v1s = {
					name: '第一轮',
					data: v1s,
					color: window.colorsRange.v1
				}

				var v2s = data.map(function(item) {
					return item.V2;
				});
				v2s = {
					name: '第二轮',
					data: v2s,
					color: window.colorsRange.v2
				}

				v3s = data.map(function(item) {
					return item.V3;
				});
				v3s = {
					name: '第三轮',
					data: v3s,
					color: window.colorsRange.v3
				}

				var currentData = 0;
				v1_totals = data.map(function(item) {
					currentData = currentData + item.V1;
					return currentData;
				});
				v1_totals = {
					name: '第一轮',
					data: v1_totals,
					color: window.colorsRange.v1
				}

				var currentData = 0;
				v2_totals = data.map(function(item) {
					currentData = currentData + item.V2;
					return currentData;
				});
				v2_totals = {
					name: '第二轮',
					data: v2_totals,
					color: window.colorsRange.v2
				}

				var currentData = 0;
				v3_totals = data.map(function(item) {
					currentData = currentData + item.V3;
					return currentData;
				});
				v3_totals = {
					name: '第三轮',
					data: v3_totals,
					color: window.colorsRange.v3
				}

				// 计算叠加   
				summaryProByVersionDetail(columns, [v3s, v2s, v1s]);
				summaryProByVersionTotalDetail(columns, [v3_totals, v2_totals, v1_totals]);

			}
		}
	});

}

function summaryProByPassOrSendDetail(columns, data) {
	$('#summaryProByPassOrSend').highcharts({
		chart: {
			type: 'column',
			width: getChartWidth(),
			height: window.HighchartsHight
		},
		title: {
			text: '项目数统计'
		},
		xAxis: {
			categories: columns
		},
		yAxis: {
			min: 0,
			title: {
				text: '项目数'
			}
			
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		legend: {
			align: 'center',
			verticalAlign: 'bottom',
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		tooltip: {
			headerFormat: '<b>{point.x}</b><br/>',
			pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'gray'
				}
			}
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		series: data
	});
	setTimeout(function(){
		removeZero();
	},100);
}

function summaryProByPassOrSendTotalDetail(columns, data) {
	$('#summaryProByPassOrSendTotal').highcharts({
		title: {
			text: '项目数统计(累计)'
		},
		chart: {
			width: getChartWidth(),
			height: window.HighchartsHight
		},
		xAxis: {
			categories: columns
		},
		yAxis: {
			title: {
				text: '项目数'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: '个'
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		legend: {
			align: 'center',
			verticalAlign: 'bottom',
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		series: data
	});
}

function summaryProByVersionTotalDetail(coumns, serious) {

	$('#summaryProByVersionTotal').highcharts({
		title: {
			text: '通过项目统计(累计)'
		},
		chart: {
			width: getChartWidth(),
			height: window.HighchartsHight
		},
		xAxis: {
			categories: coumns
		},
		yAxis: {
			title: {
				text: '项目数'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: '个'
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

function summaryProByVersionDetail(coumns, serious) {
	$('#summaryProByVersion').highcharts({
		chart: {
			type: 'column',
			width: getChartWidth(),
			height: window.HighchartsHight
		},
		title: {
			text: '通过项目统计'
		},
		xAxis: {
			categories: coumns
		},
		yAxis: {
			min: 0,
			title: {
				text: '项目数'
			}	
		},
		legend: {
			align: 'center',
			verticalAlign: 'bottom',
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		tooltip: {
			headerFormat: '<b>{point.x}</b><br/>',
			pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'gray'
				}
			}
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		series: serious
	});

}

function getChartWidth() {
	var doms = ['#summaryProByPassOrSend', '#summaryProByPassOrSendTotal', '#summaryProByVersion', '#summaryProByVersionTotal'];
	var domWidth = 0;
	for(i in doms) {
		if($(doms[i]).width() > 500) {
			domWidth = $(doms[i]).width();
			break;
		}
	}
	return domWidth;
}

$(document).ready(function() {
	window.pageReady = true;
});