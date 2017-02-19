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

app.controller("projectManager", function($scope, $http, $timeout) {

	var project_id = $('#project_id_div').attr('data');
	var fromFlag = $('#fromFlag_div').attr('data');
	var message = $('#message_div').attr('data');
	var state = $('#state_div').attr('data');
	var userName = $("#passed-username").attr("data");
	if(fromFlag == 'fromQuestionManager') {
		if(parseInt(state) == 200) {
			setTimeout(function() {
				alert('导入成功');
			}, 250);
		} else {
			setTimeout(function() {
				alert(message);
			}, 250);
		}
	}

	var time;
	window.project_id = project_id;
	window.last_question_id = '';

	$scope.wareHouseModel = {
		testRangeLabel: "",
		testRage: '',
		plan_sendtest_time: '',
		actual_sendtest_time: '',
		software_version: 0,
		left_question: 0,
		fluence_question: 0,
		modify_question: 0,
		close_question: 0,
	};

	$scope.modifyForm = {
		to_solve_the_problem_rounds: {
			label: '关闭轮次',
			value: '',
			required: {
				message: '关闭轮次不能为空'
			}
		},
		difference_meeting: {
			label: '影响上会',
			value: ['yes'],
			required: {
				message: '影响上会不能为空'
			}
		},
		groups: {
			label: 'groups',
			value: '',
			required: {
				message: 'groups不能为空'
			}
		},
		action: {
			label: 'action',
			value: '',
			required: {
				message: 'action不能为空'
			}
		},
		question_num: {
			label: 'action',
			value: ''
		}
	};
	$scope.checkFormData = [];

	$scope.queryForm = {
		to_solve_the_problem_rounds: {
			label: '遗留问题',
			value: 'all_question'
		},
		difference_meeting: {
			label: '是否影响上会',
			value: ''
		},
		action: {
			label: 'action',
			value: ''
		},
		groups: {
			label: 'groups',
			value: ''
		},
		question_status: {
			label: '问题状态',
			value: ''
		},
		model_name: {
			label: '模块名称',
			value: ''
		}
	}

	$scope.wareHouse = [];

	$scope.dropdowns = window.dropdowns;
	$scope.questionForm = window.questionForm;
	$scope.projectForm = angular.copy(window.projectInfo);

	var testRangeData = [];

	$scope.toggleSelection = function(selection, item) {
		if(!selection) {
			selection = [];
		}
		var idx = selection.indexOf(item);
		if(item == 'yes') {
			selection = [];
			selection.push('yes');
		} else {
			selection = [];
			selection.push('no');
		}
	}

	$scope.showBugzilla = false;
	$scope.guestQuestion = true;

	$scope.showToBugzilla = function() {
		$scope.showBugzilla = true;
		$scope.guestQuestion = false;
	}

	$scope.showGuestQuestion = function() {
		$scope.showBugzilla = false;
		$scope.guestQuestion = true;
	}

	$scope.modifyQuestion = function() {
		$http({
			method: 'POST',
			url: '/issue/modify',
			data: {
				project_id: project_id,
				group: $scope.modifyForm.groups.value,
				action: $scope.modifyForm.action.value,
				close_range: $scope.modifyForm.to_solve_the_problem_rounds.value,
				difference_meeting: $scope.modifyForm.difference_meeting.value,
				question_num: $scope.modifyForm.question_num.value
			}
		}).then(function(response) {
			var res = response.data;
			if(res.state == 200) {
				$('#bugList').bootstrapTable('refresh');
				$('#modifyQuestion').modal('hide');
			}
		});
	};

	$scope.showQueryQuestion = function() {
		$('#queryFormContainer').slideToggle();
	}

	var refreshEnterInfo = function() {
		$http({
			method: 'GET',
			url: '/project/get_project_basic_question/' + project_id
		}).then(function(response) {
			var projectInfo = response.data.data;
			if(response.data.state != 200) {
				alert('获取项目信息失败');
				return;
			}

			$scope.wareHouse = [];
			var wareHouseModel = angular.copy($scope.wareHouseModel);
			wareHouseModel['testRage'] = 'V1';
			wareHouseModel['testRangeLabel'] = '第一轮测试';
			wareHouseModel['actual_sendtest_time'] = projectInfo['v1_sendtest_time'];
			wareHouseModel['plan_sendtest_time'] = projectInfo['plan_sendtest_time'];
			wareHouseModel['software_version'] = projectInfo['v1_software_version'];
			wareHouseModel['left_question'] = projectInfo['v1_num']['totalnum'];
			wareHouseModel['fluence_question'] = projectInfo['v1_num']['mettingnum'];
			wareHouseModel['modify_question'] = projectInfo['v1_num']['modifynum'];
			wareHouseModel['close_question'] = projectInfo['v1_num']['closenum'];
			$scope.wareHouse.push(wareHouseModel);

			var wareHouseModel = angular.copy($scope.wareHouseModel);
			wareHouseModel['testRage'] = 'V2';
			wareHouseModel['testRangeLabel'] = '第二轮测试';
			wareHouseModel['actual_sendtest_time'] = projectInfo['v2_sendtest_time'];
			wareHouseModel['plan_sendtest_time'] = projectInfo['v2_plan_sendtest_time'];
			wareHouseModel['software_version'] = projectInfo['v2_software_version'];
			wareHouseModel['left_question'] = projectInfo['v2_num']['totalnum'];
			wareHouseModel['fluence_question'] = projectInfo['v2_num']['mettingnum'];
			wareHouseModel['modify_question'] = projectInfo['v2_num']['modifynum'];
			wareHouseModel['close_question'] = projectInfo['v2_num']['closenum'];
			$scope.wareHouse.push(wareHouseModel);

			var wareHouseModel = angular.copy($scope.wareHouseModel);
			wareHouseModel['testRage'] = 'V3';
			wareHouseModel['testRangeLabel'] = '第三轮测试';
			wareHouseModel['actual_sendtest_time'] = projectInfo['v3_sendtest_time'];
			wareHouseModel['plan_sendtest_time'] = projectInfo['v3_plan_sendtest_time'];
			wareHouseModel['software_version'] = projectInfo['v3_software_version'];
			wareHouseModel['left_question'] = projectInfo['v3_num']['totalnum'];
			wareHouseModel['fluence_question'] = projectInfo['v3_num']['mettingnum'];
			wareHouseModel['modify_question'] = projectInfo['v3_num']['modifynum'];
			wareHouseModel['close_question'] = projectInfo['v3_num']['closenum'];
			$scope.wareHouse.push(wareHouseModel);
			window.currentVersion = getCurrentVersion($scope.wareHouse);
			$scope.wareHouseManager = angular.copy($scope.wareHouse);
			$scope.wareHouseManager.forEach(function(item) {
				for(i in item) {
					item[i] = 'read';
				}
			});

			$scope.toModify = function(managerData, item) {
				$scope.wareHouseManager.forEach(function(item) {
					for(i in item) {
						item[i] = 'read';
					}
				});
				managerData[item] = 'modify';
			};

			setTimeout(function() {
				$('.timeRange').datetimepicker({
					lang: 'ch',
					timepicker: false,
					format: 'Y-m-d'
				});
			}, 100);

		}, function(response) {

		});
	};

	$scope.refreshAllInfo = function() {

		$http({
			method: 'GET',
			url: '/project/get_project_basic_question/' + project_id
		}).then(function(response) {
			
			if(response.data.state != 200  ) {
				alert('获取项目信息失败');
				return;
			}
			var projectInfo = response.data.data;
			window.project_name = projectInfo.project_name;
			$scope.wareHouse = [];
			var wareHouseModel = angular.copy($scope.wareHouseModel);
			wareHouseModel['testRage'] = 'V1';
			wareHouseModel['testRangeLabel'] = '第一轮测试';
			wareHouseModel['actual_sendtest_time'] = projectInfo['v1_sendtest_time'];
			wareHouseModel['plan_sendtest_time'] = projectInfo['plan_sendtest_time'];
			wareHouseModel['software_version'] = projectInfo['v1_software_version'];
			wareHouseModel['left_question'] = projectInfo['v1_num']['totalnum'];
			wareHouseModel['fluence_question'] = projectInfo['v1_num']['mettingnum'];
			wareHouseModel['modify_question'] = projectInfo['v1_num']['modifynum'];
			wareHouseModel['close_question'] = projectInfo['v1_num']['closenum'];
			$scope.wareHouse.push(wareHouseModel);

			var wareHouseModel = angular.copy($scope.wareHouseModel);
			wareHouseModel['testRage'] = 'V2';
			wareHouseModel['testRangeLabel'] = '第二轮测试';
			wareHouseModel['actual_sendtest_time'] = projectInfo['v2_sendtest_time'];
			wareHouseModel['plan_sendtest_time'] = projectInfo['v2_plan_sendtest_time'];
			wareHouseModel['software_version'] = projectInfo['v2_software_version'];
			wareHouseModel['left_question'] = projectInfo['v2_num']['totalnum'];
			wareHouseModel['fluence_question'] = projectInfo['v2_num']['mettingnum'];
			wareHouseModel['modify_question'] = projectInfo['v2_num']['modifynum'];
			wareHouseModel['close_question'] = projectInfo['v2_num']['closenum'];
			$scope.wareHouse.push(wareHouseModel);

			var wareHouseModel = angular.copy($scope.wareHouseModel);
			wareHouseModel['testRage'] = 'V3';
			wareHouseModel['testRangeLabel'] = '第三轮测试';
			wareHouseModel['actual_sendtest_time'] = projectInfo['v3_sendtest_time'];
			wareHouseModel['plan_sendtest_time'] = projectInfo['v3_plan_sendtest_time'];
			wareHouseModel['software_version'] = projectInfo['v3_software_version'];
			wareHouseModel['left_question'] = projectInfo['v3_num']['totalnum'];
			wareHouseModel['fluence_question'] = projectInfo['v3_num']['mettingnum'];
			wareHouseModel['modify_question'] = projectInfo['v3_num']['modifynum'];
			wareHouseModel['close_question'] = projectInfo['v3_num']['closenum'];
			$scope.wareHouse.push(wareHouseModel);
			window.currentVersion = getCurrentVersion($scope.wareHouse);
			$scope.wareHouseManager = angular.copy($scope.wareHouse);
			$scope.wareHouseManager.forEach(function(item) {
				for(i in item) {
					item[i] = 'read';
				}
			});

			$scope.toModify = function(managerData, item) {
				if(!$scope.couldWrite) {
					return;
				}
				$scope.wareHouseManager.forEach(function(item) {
					for(i in item) {
						item[i] = 'read';
					}
				});
				managerData[item] = 'modify';
			};

			for(i in projectInfo) {
				if($scope.projectForm[i]) {
					$scope.projectForm[i].value = projectInfo[i];
				}
			}

			$('.file-caption-name').addClass('floatRight');
			$('#wrapperContainer').removeClass('displayNone');
			$('#titlePage').text($scope.projectForm.project_name.value + '-入库详情');
			$scope.couldWrite = couldWrite(projectInfo['Project_owner'], userName, projectInfo['project_status']);
			window.couldWriteFlag = $scope.couldWrite;
			setTimeout(function() {
				$('.timeRange').datetimepicker({
					lang: 'ch',
					timepicker: false,
					format: 'Y-m-d'
				});
			}, 100);
		}, function(response) {

		});

	}

	$scope.refreshAllInfo();

	$scope.$watch('queryForm', function() {
		if(!window.pageReady) {
			return;
		}
		var queryParams = {};
		for(i in $scope.queryForm) {
			queryParams[i] = $scope.queryForm[i].value;
		}
		window.grid.load(queryParams);
	}, true);

	$scope.questionOperationManager = function(event) {

		var event = window.event || arguments[0] || event;
		var obj = event.srcElement ? event.srcElement : event.target;

		var question_num = $(obj).attr('question_num');
		var operation_type = $(obj).attr('operationType');

		var singleQuestion = window.grid.findRow(function(item) {
			if(item.question_num == question_num) {
				return true;
			}
		});

		if(operation_type == 'check') {
			for(i in singleQuestion) {
				if(!window.questionForm[i]) {
					continue;
				}
				$scope.checkFormData[i] = {
					label: window.questionForm[i].label,
					value: singleQuestion[i],
					required: {
						message: window.questionForm[i].required.message
					}
				};
			}
			$scope.checkFormData['question_content'].valueContent = $.trim(initStringLong(singleQuestion['question_content']));
			if(window.last_question_id == question_num) {
				$('#checkQuestion').modal('toggle');
			} else {
				$('#checkQuestion').modal('show');
			}
			window.last_question_id = question_num;
			$scope.showBugzilla = false;
			$scope.guestQuestion = true;
		}

	}

	$scope.refreshMeetingInfo = function() {
		$http({
			method: 'GET',
			url: '/project/get_project_basic_question/' + project_id
		}).then(function(response) {
			var projectInfo = response.data.data;
			if(response.data.state != 200) {
				alert('获取项目信息失败');
				return;
			}
			for(i in projectInfo) {
				if($scope.projectForm[i]) {
					$scope.projectForm[i].value = projectInfo[i];
				}
			}

		}, function(response) {

		});
	}

	$scope.saveMeetingInfo = function() {
		var submitData = {
			'onmeeting_time': $scope.projectForm.onmeeting_time.value,
			'project_id': project_id,
			'passed_time': $scope.projectForm.passed_time.value
		}
		$http({
			method: 'POST',
			data: submitData,
			url: '/project/modify_mettingtime'
		}).then(function(response) {
			var res = response.data;
			if(res.state == 200) {
				alert('保存成功');
				$scope.refreshMeetingInfo();
			} else {
				alert('保存失败');
			}
		});
	}

	$scope.saveEnterInfo = function() {
		var submitData = $scope.wareHouse.map(function(item) {
			return {
				'test_round': item.testRage,
				'testRangeLabel': item.testRangeLabel,
				'atual_delivery_time': item.actual_sendtest_time,
				'plan_sendtest_time': item.plan_sendtest_time,
				'software_version': item.software_version,
				project_id: project_id
			}
		});
		$http({
			method: 'POST',
			data: {
				data: JSON.stringify(submitData)
			},
			url: '/project/modify_project_detail'
		}).then(function(response) {
			var res = response.data;
			if(res.state == 200) {
				alert('保存成功');
				refreshEnterInfo();
			} else {
				alert('保存失败');
			}

		});
	}
});

function initBugListTable() {
	window.dropdownTestRage = window.dropdowns.testRage.map(function(item) {
		return {
			id: item.value,
			text: item.label
		}
	});
	window.dropdownDiffOnmeeting = window.dropdowns.diff_onmeeting.map(function(item) {
		return {
			id: item.value,
			text: item.label
		}
	});

	window.dropdownGroups = window.dropdowns.groups.map(function(item) {
		return {
			id: item.value,
			text: item.label
		}
	});
	window.dropdownAction = window.dropdowns.actions.map(function(item) {
		return {
			id: item.value,
			text: item.label
		}
	});
	window.miniRenders = {};
	window.miniRenders.initQuestion = function(e) {
		return '<a class="checkA" question_num="' + e.row.question_num + '" operationType ="check"  >' + e.row.question_num + '</a>'
	}
	window.miniRenders.initBugId = function(e) {
		if(e.row.bug_id) {
			return '<a class="checkA" target="_blank" href="http://bugzilla.spreadtrum.com/bugzilla/show_bug.cgi?id=' + e.row.bug_id + '"  >' + e.row.bug_id + '</a>'
		} else {
			return '';
		}

	}
	window.miniRenders.validate = function(e) {
		if(e.field == 'close_range') {
			if(e.value > window.currentVersion) {
				alert('项目正处于' + window.currentVersion + '轮测试,不能把关闭轮次改为' + e.value);
				e.cancel = true;
			}
		}
	}

	window.miniRenders.couldWrite = function(e) {
		if(!window.couldWriteFlag) {
			e.cancel = true;
		}
	}

	mini.parse();

	window.grid = mini.get("bugList");
	window.grid.load();
}

$(document).ready(function() {

	initBugListTable();

	$('#btnExportBtn').click(function() {
		window.open('/issues/export?project_id=' + window.project_id + '&project_name=' + window.project_name, '_blank');
	});

	$('#btnSaveQuestion').click(function() {
		var data = window.grid.getChanges();
		data = data.map(function(item) {
			return {
				project_id: item.project_id,
				group: item.groups,
				action: item.action,
				close_range: item.close_range,
				difference_meeting: item.difference_meeting,
				question_num: item.question_num,
				comments: item.comments
			}
		});
		var json = mini.encode(data);

		grid.loading("保存中，请稍后......");
		$.ajax({
			url: "/issue/modify",
			data: {
				data: JSON.stringify(data)
			},
			type: "post",
			success: function(text) {
				grid.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(jqXHR.responseText);
			}
		});

	});

	window.pageReady = 1;

});

function submitFile() {
	var actionUrl = encodeURI('/issues/inport?project_id=' + $('#project_id_div').attr('data') + '&project_name=' + encodeURIComponent(window.project_name) + '&formID=' + (new Date()).getTime());
	$(document.forms['importForm']).attr('action', actionUrl)
	document.forms['importForm'].submit();
}

function getCurrentVersion(wareHouse) {

	var currentDate = (new Date()).getTime();

	var ver = 'V0';

	(function() {
		var actual = wareHouse[0]['actual_sendtest_time'];
		if(!$.trim(actual)) {
			return;
		}
		var t = (new Date(actual)).getTime();
		if(t < currentDate) {
			ver = window.dropdowns['testRage'][0].value
		}
	})();

	(function() {
		var actual = wareHouse[1]['actual_sendtest_time'];
		if(!$.trim(actual)) {
			return;
		}
		var t = (new Date(actual)).getTime();
		if(t < currentDate) {
			ver = window.dropdowns['testRage'][1].value
		}
	})();

	(function() {
		var actual = wareHouse[2]['actual_sendtest_time'];
		if(!$.trim(actual)) {
			return;
		}
		var t = (new Date(actual)).getTime();
		if(t < currentDate) {
			ver = window.dropdowns['testRage'][2].value
		}
	})();

	return ver;

}