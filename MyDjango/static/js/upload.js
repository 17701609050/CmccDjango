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


});