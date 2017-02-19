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
	$scope.sumEnterHousePro = false;
	$scope.sumQuestionNum = true;

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
	}
	$scope.initQueryForm();

	$scope.$watch('queryForm', function() {

		window.summary_type = $scope.queryForm.summary_type.value;
		if(!window.pageReady) {
			return;
		}
		summaryQuestion($scope.queryForm);
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

	summaryQuestionByModel();
	summaryQuestionByAction();
	summaryQuestionByGroup();
	summaryQuestion($scope.queryForm);

});

function summaryQuestion(queryForm) {

	var t = {};
	for(i in queryForm) {
		t[i] = queryForm[i].value;
	}
	t['period_type'] = t['summary_type'];

	$.ajax({
		type: "get",
		url: "/summary/modal",
		async: true,
		data: t,
		success: function(response) {
			response = eval('(' + response + ')');
			if(response.state == 200) {
				var data = response.data;

				var columnsModelName = data.modal_name.map(function(item) {
					return item.model_name;
				});

				var total = 0;
				data.modal_name.forEach(function(item) {
					total = total + item.COUNT;
				});

				var datasModelName = data.modal_name.map(function(item) {
					return {
						name: item.model_name,
						y: divGT(item.COUNT, total),
						yNum: item.COUNT
					}
				});
				summaryQuestionByModel(datasModelName);

				var total = 0;
				data.group.forEach(function(item) {
					total = total + item.COUNT;
				});

				var groupName = data.group.map(function(item) {
					return {
						name: item.groups,
						y: divGT(item.COUNT, total),
						yNum: item.COUNT
					}
				});
				summaryQuestionByGroup(groupName);

				var total = 0;
				data.action.forEach(function(item) {
					total = total + item.COUNT;
				});

				var actions = data.action.map(function(item) {
					return {
						name: item.action,
						y: divGT(item.COUNT, total),
						yNum: '  ' + item.COUNT
					}
				});
				summaryQuestionByAction(actions);

			}
		}
	});
}

function summaryQuestionByModel(serious) {

	$('#summaryQuestionByModel').highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '按模块名称分类'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.2f} {point.yNum}%',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> count :<b style="margin-left:10px;">  {point.yNum}</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.2f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: 'Brands',
			colorByPoint: true,
			data: serious
		}]
	});

}

function summaryQuestionByAction(actions) {

	$('#summaryQuestionByAction').highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '按action分类问题数'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.2f} {point.yNum}%',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> count :<b style="margin-left:10px;">  {point.yNum}</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.2f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: 'Brands',
			colorByPoint: true,
			data: actions
		}]
	});

}

function summaryQuestionByGroup(groupName) {

	$('#summaryQuestionByGroup').highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: '按Group分类问题数'
		},
		credits: {
			enabled: false // 禁用版权信息
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> count :<b style="margin-left:10px;">  {point.yNum}</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.2f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: 'Brands',
			colorByPoint: true,
			data: groupName
		}]
	});

}

$(document).ready(function() {

	window.pageReady = 1;
});