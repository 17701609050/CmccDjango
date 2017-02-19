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

app.controller("chipRelatedManager", function($scope, $http, $timeout) {

	var project_id = $('#project_id_div').attr('data');
	$scope.dropdowns = window.dropdowns;
	$scope.projectForm = window.projectInfo;
	var userName = $("#passed-username").attr("data");

	$scope.chipModels = [];

	$scope.addModel = false;

	$scope.beginAdd = function() {
		$scope.addModel = true;
	}

	$scope.submitChipAdd = function() {
		$http({
			method: 'POST',
			url: '/setting/chipset',
			data: {
				chip_name: $scope.chipModelAdd.chip_name.value
			}
		}).then(function(response) {
			var data = response.data;
			if(data.state == 200) {
				window.location.reload();
			} else {
				alert(data.message);
			}

		});
	}

	$scope.cancelChipAdd = function() {
		$scope.addModel = false;
	}

	$scope.chipModelAdd = {
		chipid: {
			label: 'chipid',
			value: ''
		},
		chip_name: {
			label: '芯片名称',
			value: ''
		}
	}

	$scope.chipModel = {
		chipid: {
			label: 'chipid',
			value: ''
		},
		chip_name: {
			label: '芯片名称',
			value: ''
		},
		CPM: {
			label: 'CPM',
			value: ''
		},
		SW_TAM: {
			label: 'SW_TAM',
			value: ''
		},
		HW_TAM: {
			label: 'HW_TAM',
			value: ''
		},
		HW_RF: {
			label: 'HW_RF',
			value: ''
		},
		Audio_PL: {
			label: 'Audio_PL',
			value: ''
		},
		Power_PL: {
			label: 'Power_PL',
			value: ''
		},
		PPM: {
			label: 'PPM',
			value: ''
		},
		Ali_PM: {
			label: 'Ali_PM',
			value: ''
		},
		PLD_PM: {
			label: 'PLD_PM',
			value: ''
		},
		CSD_PM: {
			label: 'CSD_PM',
			value: ''
		},
		PHY_PL: {
			label: 'PHY_PL',
			value: ''
		},
		Test_PL: {
			label: 'Test_PL',
			value: ''
		},
		PICLAB_FO: {
			label: 'PICLAB_FO',
			value: ''
		},
		FT_FO: {
			label: 'FT_FO',
			value: ''
		}
	};

	$scope.chipModelSubmit = angular.copy($scope.chipModel);

	$scope.$watch('chipModelSubmit.chip_name.value', function(newValue, oldValue) {
		if(newValue == oldValue) {
			return;
		}
		$scope.chipModels.forEach(function(item) {
			if(item.chip_name.value == newValue) {
				for(i in $scope.chipModelSubmit) {
					$scope.chipModelSubmit[i].value = item[i].value;
				}
			}
		});
	});

	$scope.saveModify = function() {
		var submitData = {};
		for(i in $scope.chipModelSubmit) {
			submitData[i] = $scope.chipModelSubmit[i].value;
		}
		$http({
			method: 'POST',
			url: '/setting/related_person/modify',
			data: submitData
		}).then(function(response) {
			var data = response.data;
			if(data.state == 200) {
				window.location.reload();
			} else {
				alert(data.message);
			}
		});
	}

	$scope.deleteChip = function() {

		var chip_name = $scope.chipModelSubmit.chip_name.value;
		var flag = confirm('确认删除芯片' + chip_name + '?');
		if(!flag) {
			return;
		}
		$http({
			method: 'GET',
			url: '/setting/chipset/delete?chip_name='+chip_name
		}).then(function(response) {
			var data = response.data;
			if(data.state == 200) {
				alert('删除成功');
				window.location.reload();
			} else {
				alert('删除失败');
			}
		});
	}

	$http({
		method: 'GET',
		url: '/setting/chipset/all'
	}).then(function(response) {
		var data = response.data;
		if(data.state == 200) {
			$scope.chipModels = data.data.map(function(item) {
				var re = {};
				for(i in item) {
					re[i] = {
						label: $scope.chipModel[i].label,
						value: item[i]
					}
				}
				return re;
			});
			for(i in $scope.chipModelSubmit) {
				$scope.chipModelSubmit[i].value = $scope.chipModels[0][i].value;
			}
		}
		$('#wrapperContainer').removeClass('displayNone');
	});

});