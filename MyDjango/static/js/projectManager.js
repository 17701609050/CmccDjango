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

window.currentUser = $('#passed-username').attr('data');

app.controller("projectManager", function($scope, $http, $timeout) {

	$scope.dropdowns = window.dropdowns;

	$http({
		method: 'GET',
		url: '/project/get_chip_name'
	}).then(function(response) {
		$scope.dropdowns['chips'] = response.data.data.map(function(item) {
			return {
				label: item,
				value: item
			}
		});
	});

	var timer = null;

	$scope.toggleSelection = function(selection, item) {
		var idx = selection.indexOf(item);
		if(idx > -1) {
			selection.splice(idx, 1);
		} else {
			selection.push(item);
		}
	}

	$scope.showBasic = true;
	$scope.showRelationPerson = false;
	$scope.showMyProject = true;
	$scope.showAllProject = false;

	$scope.modifyToMyProject = function() {
		$scope.showMyProject = true;
		$scope.showAllProject = false;
	}
	$scope.modifyToAllProject = function() {
		$scope.showMyProject = false;
		$scope.showAllProject = true;
	}
	$scope.modifyToShowBasic = function() {
		$scope.showBasic = true;
		$scope.showRelationPerson = false;
	}
	$scope.modifyToShowRelation = function() {
		$scope.showBasic = false;
		$scope.showRelationPerson = true;
	}
	$scope.projectForm = angular.copy(window.projectInfo);

	$scope.createProjectTools = {};

	$scope.createProjectTools.buildData = function() {
		var postData = {};
		for(i in $scope.projectForm) {
			var label = (function() {
				if($scope.projectForm[i].getLabel) {
					return $scope.projectForm[i].getLabel();
				} else {
					return i;
				}
			})();
			var value = (function() {
				if($scope.projectForm[i].getValue) {
					return $scope.projectForm[i].getValue();
				} else {
					return $scope.projectForm[i].value;
				}

			})();
			postData[label] = value;
		}
		return postData;
	}

	$scope.showCreateProject = function() {
		$('#createProject').modal('show');
		$scope.projectForm = angular.copy(window.projectInfo);
		$scope.createProjectForm.$setPristine();
	}

	$scope.saveProject = function() {
		var postData = $scope.createProjectTools.buildData();
		alert(postData);
		$http({
			method: 'POST',
			data: {
				data: JSON.stringify(postData)
			},
			url: "/project/createProject/",
			headers: {"X-CSRFToken":getCookie("csrftoken")}
		}).then(function(response) {
			var data = response.data;
			if(data.state == 200) {
				$('#projectPlan').bootstrapTable('refresh');
				$('#projectAll').bootstrapTable('refresh');
				$('#createProject').modal('hide');
			} else {
				alert(response.message);
			}
		}, function(response) {

		});
	}

	$scope.$watch('projectForm.chip_name.value', function() {
		if(!$scope.projectForm.chip_name.value) {
			return;
		}
		$timeout.cancel(timer);
		timer = $timeout(function() {
			$http({
				method: 'GET',
				url: '/project/queryPersonByChip/' + $scope.projectForm.chip_name.value
			}).then(function(response) {
				if(response.data.state == 200) {
					var relations = response.data.data[0];
					for(i in relations) {
						if($scope.projectForm[i]) {
							$scope.projectForm[i].value = relations[i];
						}
					}
					alert('项目干系人已经用芯片干系人重置了');
				}
			}, function(response) {

			});
		}, 250);

	});

	$scope.$watch('projectForm.send_test_type.value', function() {
		if($scope.projectForm.send_test_type.value == 'report_to_test' && !$scope.projectForm.test_range.value) {
			$scope.projectForm.test_range.required.flag = 1;
		} else {
			$scope.projectForm.test_range.required.flag = 0;
		}
	});
	$scope.$watch('projectForm.test_range.value', function() {
		if($scope.projectForm.send_test_type.value == 'report_to_test' && !$scope.projectForm.test_range.value) {
			$scope.projectForm.test_range.required.flag = 1;
		} else {
			$scope.projectForm.test_range.required.flag = 0;
		}
	});

	$scope.approvingForm = {
		chip_name: {
			label: '芯片名称',
			value: []
		},
		cust_name: {
			label: '客户名称',
			value: ''
		}
	}

	$scope.$watch('approvingForm', function() {
		var t = (new Date()).getTime();
		var url = '/projects/status?status=Approving&user_name=' + window.currentUser + '&chip_name=' + $scope.approvingForm.chip_name.value + '&cust_name=' + (!$scope.approvingForm.cust_name.value ? '' : $scope.approvingForm.cust_name.value) + '&t=' + t;
		refreshApprovingProject(url);
	}, true);

	$scope.testingForm = {
		chip_name: {
			label: '芯片名称',
			value: []
		},
		cust_name: {
			label: '客户名称',
			value: ''
		},
		test_range: {
			label: '测试轮次',
			value: ''
		}
	}
	$scope.$watch('testingForm', function() {
		var t = (new Date()).getTime();
		var url = '/projects/status?status=Testing&user_name=' + window.currentUser + '&chip_name=' + $scope.testingForm.chip_name.value + '&cust_name=' + (!$scope.testingForm.cust_name.value ? '' : $scope.testingForm.cust_name.value) + '&test_round=' + $scope.testingForm.test_range.value + '&t=' + t;
		refreshTestingProject(url);
	}, true);

	$scope.planForm = {
		chip_name: {
			label: '芯片名称',
			value: []
		},
		cust_name: {
			label: '客户名称',
			value: ''
		},
		send_test_type: {
			label: '送测类型',
			value: ''
		}
	}
	$scope.$watch('planForm', function() {
		var t = (new Date()).getTime();
		var url = '/projects/status?status=Plan&user_name=' + window.currentUser + '&chip_name=' + $scope.planForm.chip_name.value + '&cust_name=' + (!$scope.planForm.cust_name.value ? '' : $scope.planForm.cust_name.value) + '&send_test_type=' + $scope.planForm.send_test_type.value + '&t=' + t;
		refreshPlanProject(url);
	}, true);

	$scope.passForm = {
		chip_name: {
			label: '芯片名称',
			value: []
		},
		cust_name: {
			label: '客户名称',
			value: ''
		},
		passed_round: {
			label: '通过轮次',
			value: ''
		}
	}

	$scope.$watch('passForm', function() {
		var t = (new Date()).getTime();
		var url = '/projects/status?status=Pass&user_name=' + window.currentUser + '&chip_name=' + $scope.passForm.chip_name.value + '&cust_name=' + (!$scope.passForm.cust_name.value ? '' : $scope.passForm.cust_name.value) + '&passed_round=' + $scope.passForm.passed_round.value + '&t=' + t;
		refreshPassProject(url);
	}, true);

	$scope.cancelForm = {
		chip_name: {
			label: '芯片名称',
			value: []
		},
		cust_name: {
			label: '客户名称',
			value: ''
		}
	}
	$scope.$watch('cancelForm', function() {
		var t = (new Date()).getTime();
		var url = '/projects/status?status=Cancel&user_name=' + window.currentUser + '&chip_name=' + $scope.cancelForm.chip_name.value + '&cust_name=' + (!$scope.cancelForm.cust_name.value ? '' : $scope.cancelForm.cust_name.value) + '&t=' + t;
		refreshCancelProject(url);
	}, true);

	$scope.allForm = {
		chip_name: {
			label: '芯片名称',
			value: []
		},
		cust_name: {
			label: '客户名称',
			value: ''
		},
		project_name: {
			label: '项目名称',
			value: ''
		},
		project_status: {
			label: '状态',
			value: ['Approving', 'Testing', 'Plan']
		}
	}
	$scope.$watch('allForm', function() {
		var t = (new Date()).getTime();
		var url = '/projects/all?project_status=' + $scope.allForm.project_status.value.join(',') + '&user_name=' + window.currentUser + '&chip_name=' + $scope.allForm.chip_name.value + '&cust_name=' + (!$scope.allForm.cust_name.value ? '' : $scope.allForm.cust_name.value) + '&project_name=' + $scope.allForm.project_name.value + '&t=' + t;
		refreshAllProject(url);
	}, true);

	initSelect('#selectApproving', '/project/get_project_name/Approving');
	initSelect('#selectTesting', '/project/get_project_name/Testing');
	initSelect('#selectPlan', '/project/get_project_name/Plan');
	initSelect('#selectPass', '/project/get_project_name/Pass');
	initSelect('#selectCancel', '/project/get_project_name/Cancel');
	$('#selectAll').select2({
		ajax: {
			url: function() {
				var t = (new Date()).getTime();
				return '/project/get_project_name/all?chip_name=' + $scope.allForm.chip_name.value+'&t='+t;
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

});

function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
		var cookie = jQuery.trim(cookies[i]);
		// Does this cookie string begin with the name we want?
		if (cookie.substring(0, name.length + 1) == (name + '=')) {
		cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		break;
		}
		}
		}
		return cookieValue;
	}

function initSelect(domId, url) {
	$(domId).select2({
		ajax: {
			url: url,
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
}

$('.timeRange').datetimepicker({
	lang: 'ch',
	timepicker: false,
	format: 'Y-m-d'
});

function refreshApprovingProject(url) {
	$('#projectApproving').bootstrapTable('destroy');
	$('#projectApproving').bootstrapTable({
		columns: [{
			'field': 'chip_name',
			'title': window.projectInfo.chip_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'cust_name',
			'title': window.projectInfo.cust_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'project_name',
			'title': window.projectInfo.project_name.label,
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'onmeeting_time',
			'title': '上会时间',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'remaining_question',
			'title': '遗留问题',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'onmeeting_days',
			'title':  window.projectInfo.onmeeting_days.label,
			'align': 'center',
			'width': '17%'
		}],
		url: url,
		classes: 'table  table-hover',
		pageList: [10, 25, 50, 100, 'All'],
		pagination: true,
		pageSize: 10,
		sidePagination: 'server',
		onClickRow: jumpToDetails
	});

}

function refreshTestingProject(url) {
	$('#projectTesting').bootstrapTable('destroy');
	$('#projectTesting').bootstrapTable({
		columns: [{
			'field': 'chip_name',
			'title': window.projectInfo.chip_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'cust_name',
			'title': window.projectInfo.cust_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'project_name',
			'title': window.projectInfo.project_name.label,
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'this_round_sendtest_time',
			'title': '本轮送测时间',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'test_round_number',
			'title': '送测轮次',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'sendtested_days',
			'title': '已经测试天数',
			'align': 'center',
			'width': '17%'
		}],
		url: url,
		classes: 'table  table-hover',
		pageList: [10, 25, 50, 100, 'All'],
		pagination: true,
		pageSize: 10,
		sidePagination: 'server',
		onClickRow: jumpToDetails
	});
}

function refreshPlanProject(url) {
	$('#projectPlan').bootstrapTable('destroy');
	$('#projectPlan').bootstrapTable({
		columns: [{
			'field': 'chip_name',
			'title': window.projectInfo.chip_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'cust_name',
			'title': window.projectInfo.cust_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'project_name',
			'title': window.projectInfo.project_name.label,
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'plan_sendtest_time',
			'title': '计划送测时间',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'send_test_type',
			'title': '送测类型',
			'align': 'center',
			'width': '17%',
			formatter: function(value, row) {
				return getLable(window.dropdowns.sendTestType, value);
			}
		}, {
			'field': 'sendtested_days',
			'title': '送测天数',
			'align': 'center',
			'width': '14%'
		}],
		url: url,
		classes: 'table  table-hover',
		pageList: [10, 25, 50, 100, 'All'],
		pagination: true,
		pageSize: 10,
		sidePagination: 'server',
		onClickRow: jumpToDetails
	});

}

function refreshPassProject(url) {
	$('#projectPass').bootstrapTable('destroy');
	$('#projectPass').bootstrapTable({
		columns: [{
			'field': 'chip_name',
			'title': window.projectInfo.chip_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'cust_name',
			'title': window.projectInfo.cust_name.label,
			'align': 'center',
			'width': '16%'
		}, {
			'field': 'project_name',
			'title': window.projectInfo.project_name.label,
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'passed_time',
			'title': '通过时间',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'passed_round_number',
			'title': '通过轮次',
			'align': 'center',
			'width': '17%'
		}, {
			'field': 'passed_days',
			'title': '通过天数',
			'align': 'center',
			'width': '17%'
		}],
		url: url,
		classes: 'table  table-hover',
		pageList: [10, 25, 50, 100, 'All'],
		pagination: true,
		pageSize: 10,
		sidePagination: 'server',
		onClickRow: jumpToDetails
	});

}

function refreshCancelProject(url) {
	$('#projectCancel').bootstrapTable('destroy');
	$('#projectCancel').bootstrapTable({
		columns: [{
			'field': 'chip_name',
			'title': window.projectInfo.chip_name.label,
			'align': 'center',
			'width': '33%'
		}, {
			'field': 'cust_name',
			'title': window.projectInfo.cust_name.label,
			'align': 'center',
			'width': '33%'
		}, {
			'field': 'project_name',
			'title': window.projectInfo.project_name.label,
			'align': 'center',
			'width': '33%'
		}],
		url: url,
		classes: 'table  table-hover',
		pageList: [10, 25, 50, 100, 'All'],
		pagination: true,
		pageSize: 10,
		sidePagination: 'server',
		onClickRow: jumpToDetails
	});
}

function refreshAllProject(url) {
	$('#projectAll').bootstrapTable('destroy');
	$('#projectAll').bootstrapTable({
		columns: [{
			'field': 'chip_name',
			'title': window.projectInfo.chip_name.label,
			'align': 'center',
			'width': '25%'
		}, {
			'field': 'cust_name',
			'title': window.projectInfo.cust_name.label,
			'align': 'center',
			'width': '25%'
		}, {
			'field': 'project_name',
			'title': window.projectInfo.project_name.label,
			'align': 'center',
			'width': '25%'
		}, {
			'field': 'project_status',
			'title': '状态',
			'align': 'center',
			'width': '25%'
		}],
		url: url,
		classes: 'table  table-hover',
		pageList: [10, 25, 50, 100, 'All'],
		pagination: true,
		pageSize: 10,
		sidePagination: 'server',
		onClickRow: jumpToDetails
	});

}

$(document).ready(function() {
	$('#wrapperContainer').removeClass('displayNone');
});

function jumpToDetails(row) {
	window.open('/enterHouse?project_id=' + row.project_id);
}