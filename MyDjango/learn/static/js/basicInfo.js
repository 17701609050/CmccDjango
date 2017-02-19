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

app.controller("basicInfo", function($scope, $http, $timeout, $interval) {

	var project_id = $('#project_id_div').attr('data');
	var userName = $("#passed-username").attr("data");
	$scope.projectForm = window.projectInfo;

	$scope.projectFormManager = angular.copy($scope.projectForm);

	$scope.dropdowns = window.dropdowns;

	$scope.$watch('projectForm.send_test_type.value', function(newValue, oldValue) {
		$scope.projectForm.send_test_type.valueShow = getLable(window.dropdowns['sendTestType'], newValue);
	});
	$scope.$watch('projectForm.Radiofrequency_PA.value', function(newValue, oldValue) {
		$scope.projectForm.Radiofrequency_PA.valueShow = getLable(window.dropdowns['rePA'], newValue);
	});
	$scope.$watch('projectForm.operate_system.value', function(newValue, oldValue) {
		$scope.projectForm.operate_system.valueShow = getLable(window.dropdowns['operationSystem'], newValue);
	});
	for(i in $scope.projectFormManager) {
		$scope.projectFormManager[i] = 'read';
	}
	$scope.toggleSelection = function(selection, item) {
		var idx = selection.indexOf(item);
		if(idx > -1) {
			selection.splice(idx, 1);
		} else {
			selection.push(item);
		}
	}

	$scope.toModify = function(item) {
		if(!$scope.couldWrite) {
			return;
		}
		for(i in $scope.projectFormManager) {
			$scope.projectFormManager[i] = 'read';
		}
		$scope.projectFormManager[item] = 'modify';
	}

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

	$scope.getLabel = function(userId) {
		var user = '';
		if(!$scope.users || !$scope.users.length) {
			return user;
		}
		$scope.users.some(function(item) {
			if(!item.id) {
				return false;
			}
			if(userId == item.id) {
				user = item.text;
				return true;
			}
		});
		return user;
	};

	$interval(function() {
		$scope.couldSubmitUser = chechValid();
	}, 500);

	$http({
		method: 'GET',
		url: '/project/get_project_basic_question/' + project_id
	}).then(function(response) {
		var projectInfo = response.data.data;
		window.projectInfoForm = projectInfo;
		if(response.data.state != 200) {
			alert('获取项目信息失败');
			return;
		}
		for(i in projectInfo) {
			if($scope.projectForm[i]) {
				$scope.projectForm[i].value = projectInfo[i];
			}
		}
		for(i in projectInfo['Project_owner']) {
			if($scope.projectForm[i]) {
				$scope.projectForm[i].value = projectInfo['Project_owner'][i];
				$scope.projectForm[i].valueContent = projectInfo['Project_owner'][i];
			}
		}
		for(i in projectInfo['Network_type']) {
			if($scope.projectForm[i]) {
				$scope.projectForm[i].value = (function() {
					if(!projectInfo['Network_type'][i]) {
						return [];
					} else {
						return projectInfo['Network_type'][i].split(',');
					}
				})();
			}
		}
		$('#wrapperContainer').removeClass('displayNone');

		$scope.couldWrite = couldWrite(projectInfo['Project_owner'], userName, projectInfo['project_status']);
		$('#titlePage').text($scope.projectForm.project_name.value + '-基本信息');
	}, function(response) {

	});

	$scope.saveBasic = function() {

		var submitData = $scope.createProjectTools.buildData();
		$http({
			method: 'POST',
			data: {
				data: JSON.stringify(submitData)
			},
			url: '/project/modify_project_basicinfo'
		}).then(function(response) {
			var res = response.data;
			if(res.state == 200) {
				window.location.reload();
			} else {
				alert('修改失败');
			}
		});
	}

	$scope.$watch('projectForm.CPM.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#cpmEditor', newValue);
		}
	});
	$scope.$watch('projectForm.SW_TAM.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#sw_tamEditor', newValue);
		}
	});
	$scope.$watch('projectForm.HW_TAM.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#HW_TAMEditor', newValue);
		}
	});
	$scope.$watch('projectForm.HW_TAM.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#HW_TAMEditor', newValue);
		}
	});

	$scope.$watch('projectForm.HW_RF.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#HW_RFEditor', newValue);
		}
	});
	$scope.$watch('projectForm.Audio_PL.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#Audio_PLEditor', newValue);
		}
	});

	$scope.$watch('projectForm.Power_PL.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#Power_PLEditor', newValue);
		}
	});

	$scope.$watch('projectForm.FT_FO.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#FT_FOEditor', newValue);
		}
	});

	$scope.$watch('projectForm.PLD_PM.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#PLD_PMEditor', newValue);
		}
	});

	$scope.$watch('projectForm.CSD_PM.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#CSD_PMEditor', newValue);
		}
	});

	$scope.$watch('projectForm.PHY_PL.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#PHY_PLEditor', newValue);
		}
	});

	$scope.$watch('projectForm.Test_PL.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#Test_PLEditor', newValue);
		}
	});

	$scope.$watch('projectForm.PICLAB_FO.value', function(newValue, oldValue) {
		if(window.pageReady && !window.changeIgnore) {
			initUserSelect('#PICLAB_FOEditor', newValue);
		}
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

});

$(document).ready(function() {
	window.pageReady = 1;
	$('.timeRange').datetimepicker({
		lang: 'ch',
		timepicker: false,
		format: 'Y-m-d'
	});

});

function initUserSelect(domInput, newValue) {
	clearTimeout(window.timeStore);
	window.timeStore = setTimeout(function() {
		$.ajax({
			type: "get",
			url: '/project/get_ALLowners_by_Name?q=' + newValue,
			async: true,
			success: function(response) {
				response = eval('(' + response + ')');
				if(response.state == 200) {
					var users = response.data;
					$('#selectUserContainer>ul').html('');

					var index = 0;
					users = users.filter(function(item) {
						index = index + 1;
						if(index <= 9) {
							return true;
						} else {
							return false;
						}
					});
					users.forEach(function(item) {
						var option = $('<option>').text(item.Name + '(' + item.EName + ')').val(item.EName).attr('title', (item.Name + '(' + item.EName + ')'));
						$(option).click(function() {
							$(domInput).val($(this).val());
							$('#selectUserContainer').addClass('displayNone');
							window.changeIgnore = true;
							$(domInput).trigger('input');
							window.changeIgnore = false;
						});
						$('#selectUserContainer>ul').append(option);
					});
					if(users.length > 0) {
						var left = $(domInput).offset().left;
						var top = $(domInput).offset().top;
						$('#selectUserContainer').removeClass('displayNone');
						$('#selectUserContainer').css({
							'left': left + 'px',
							top: top + 30 + 'px'
						});
						$(domInput).parent().parent().find('.requiredValid').remove();

					} else {
						$('#selectUserContainer').addClass('displayNone');
						$(domInput).parent().parent().find('.requiredValid').remove();
						var span = $('<span>').addClass('requiredValidClass requiredValid').text('关系人不存在');
						$(domInput).parent().after(span);
					}
					$(domInput).unbind('blur');
					$(domInput).blur(function() {
						setTimeout(function() {
							$('#selectUserContainer').addClass('displayNone');
							var userName = $(domInput).val();
							$(domInput).parent().parent().find('.requiredValid').remove();
							validateUser(userName, domInput);
						}, 500);
					});
				}
			}
		});
	}, 250);
}

function validateUser(userName, domInput) {
	$.ajax({
		type: "get",
		url: "/project/check_owners_by_Name",
		async: true,
		data: {
			q: userName
		},
		success: function(response) {
			response = eval('(' + response + ')');
			if(response.state == 200 && response.data == 0) {
				$(domInput).parent().parent().find('.requiredValid').remove();
				var span = $('<span>').addClass('requiredValidClass requiredValid').text('关系人不存在');
				$(domInput).parent().after(span);
			}
		}
	});
}

function chechValid() {
	if($('.requiredValid').length > 0) {
		return true;
	} else {
		return false;
	}
}