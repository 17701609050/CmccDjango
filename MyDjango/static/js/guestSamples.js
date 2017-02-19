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

app.controller("sampleGuest", function($scope, $http, $timeout) {

	$scope.sampleGuests = [];

	var project_id = $('#project_id_div').attr('data');
	$scope.projectForm = window.projectInfo;
	var userName = $("#passed-username").attr("data");

	$scope.addSampleGuest = function() {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var date = date.getDate();
		var dateString = (year + '') + '-' + (month < 10 ? '0' + month : month + '') + '-' + (date < 10 ? '0' + date : date + '');

		$scope.sampleGuests.push({
			place: '',
			sample_num: 0,
			ready_time: dateString,
			selected: ''
		});
		$scope.sampleGuestsManager = angular.copy($scope.sampleGuests);

		$scope.sampleGuestsManager.forEach(function(item, data, index) {
			for(i in item) {
				item[i] = 'read';
			}
		});
	}

	$scope.$watch('sampleGuests', function() {
		$scope.sampleGuests.forEach(function(item) {
			if(item.sample_num < 0) {
				alert('数量不能为负数');
				item.sample_num = 0;
			}
		});
	}, true);

	$scope.sampleGuestsManager = angular.copy($scope.sampleGuests);

	$scope.sampleGuestsManager.forEach(function(item, data, index) {
		for(i in item) {
			item[i] = 'read';
		}
	});

	$scope.toModify = function(index, item) {
		if(!$scope.couldWrite) {
			return;
		}
		$scope.sampleGuestsManager = angular.copy($scope.sampleGuests);

		$scope.sampleGuestsManager.forEach(function(item, data, index) {
			for(i in item) {
				item[i] = 'read';
			}
		});
		$scope.sampleGuestsManager[index][item] = 'modify';
		setTimeout(function() {
			$('.timeRange').datetimepicker({
				lang: 'ch',
				timepicker: false,
				format: 'Y-m-d'
			});
		}, 200);

	}

	$scope.delete = function(sampleGuest) {
		var flag = confirm('确认要删除？');
		if(!flag) {
			return;
		}
		$scope.sampleGuests = $scope.sampleGuests.filter(function(item) {
			if(sampleGuest == item) {
				return false;
			}
			return true;
		});
	}

	$scope.saveGuestSample = function() {
		$http({
			method: 'POST',
			data: {
				cust_model: JSON.stringify($scope.sampleGuests),
				project_id: project_id
			},
			url: '/project/modify_cust_model'
		}).then(function(response) {
			var res = response.data;
			if(res.state == 200) {
				window.location.reload();
			} else {
				alert('修改失败');
			}
		});
	}

	$scope.deleteSampleGuest = function() {
		$scope.sampleGuests = $scope.sampleGuests.filter(function(item) {
			if(!item.selected) {
				return true;
			}
		});
		$scope.sampleGuestsManager = angular.copy($scope.sampleGuests);
		$scope.sampleGuestsManager.forEach(function(item, data, index) {
			for(i in item) {
				item[i] = 'read';
			}
		});
	}

	$scope.selectedAll = false;

	$scope.$watch('selectedAll', function() {
		if($scope.selectedAll) {
			$scope.sampleGuests.forEach(function(item, data, index) {
				item['selected'] = true;
			});
		} else {
			$scope.sampleGuests.forEach(function(item, data, index) {
				item['selected'] = false;
			});
		}
	});

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
		for(i in projectInfo['Project_owner']) {
			if($scope.projectForm[i]) {
				$scope.projectForm[i].value = projectInfo['Project_owner'][i];
			}
		}
		$scope.sampleGuests = $scope.projectForm['Cust_Model'].value;
		if(!$scope.sampleGuests) {
			$scope.sampleGuests = [];
		}

		$scope.sampleGuestsManager = angular.copy($scope.sampleGuests);
		$scope.sampleGuestsManager.forEach(function(item, data, index) {
			for(i in item) {
				item[i] = 'read';
			}
		});
		$('#wrapperContainer').removeClass('displayNone');
		$('#titlePage').text($scope.projectForm.project_name.value + '-客户样机准备');
		$scope.couldWrite = couldWrite(projectInfo['Project_owner'], userName, projectInfo['project_status']);
	}, function(response) {

	});
});