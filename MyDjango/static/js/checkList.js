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

app.controller("checkList", function($scope, $http, $timeout) {

	var project_id = $('#project_id_div').attr('data');
	$scope.dropdowns = window.dropdowns;
	$scope.projectForm = window.projectInfo;
	var userName = $("#passed-username").attr("data");

	var checkListInitData = (function() {
		var t = [];
		window.dropdowns['testItem'].forEach(function(item) {
			t.push({
				testItem: item.value,
				finishStatus: '',
				testResult: '',
				comment: '',
				testItemLable: getLable(window.dropdowns['testItem'], item.value)
			});
		});
		return t;
	})();

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
		var testItems = projectInfo['test_items'];
		if(!testItems || testItems.length == 0) {
			$scope.checkList = angular.copy(checkListInitData);
		} else {
			$scope.checkList = testItems;
		}
		$('#titlePage').text($scope.projectForm.project_name.value + '-自测试CheckList列表');
		$('#wrapperContainer').removeClass('displayNone');
		$scope.couldWrite = couldWrite(projectInfo['Project_owner'], userName , projectInfo['project_status'] );
	}, function(response) {

	});

	$scope.checkListManager = angular.copy(checkListInitData);

	$scope.checkListManager.forEach(function(item) {
		for(i in item) {
			item[i] = 'read'
		}
	});

	$scope.toModify = function(managerData, item) {
		if(!$scope.couldWrite){
			return ;
		}
		$scope.checkListManager.forEach(function(item) {
			for(i in item) {
				item[i] = 'read'
			}
		});
		managerData[item] = 'modify';
	}

	$scope.saveCheckList = function() {
		$http({
			method: 'POST',
			data: {
				test_items: JSON.stringify($scope.checkList),
				project_id: project_id
			},
			url: '/project/modify_check_list'
		}).then(function(response) {
			var res = response.data;
			if(res.state == 200) {
				window.location.reload();
			} else {
				alert('修改失败');
			}
		});
	}

});