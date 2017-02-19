/**  保存一些枚举型变量   **/
var dropdowns = {};
var enums = {};
dropdowns['chips'] = [{
	'label': '9830',
	'value': '9830'
}, {
	'label': '9832',
	'value': '9832'
}, {
	'label': '9860',
	'value': '9860'
}];

dropdowns['is_solved'] = [{
	label: '已解决',
	value: 'solved'
}, {
	label: '未解决',
	value: 'unsolved'
}];

dropdowns['sendTestType'] = [{
	'label': '新入库',
	'value': 'new_to_warehouse'
}, {
	'label': '报备测试',
	'value': 'report_to_test'
}];

dropdowns['operationSystem'] = [{
	'label': 'Android 5.1',
	'value': 'Android_5.1'
}, {
	'label': 'Android 6.0',
	'value': 'Android_6.0'
}, {
	'label': 'Android 7.0',
	'value': 'Android_7.0'
}, {
	'label': 'YunOS 3.2',
	'value': 'YunOS_3.2'
}, {
	'label': 'YunOS 5.3.0',
	'value': 'YunOS_5.3.0'
}];

dropdowns['rePA'] = [{
	'label': 'Skyworks',
	'value': 'Skyworks'
}, {
	'label': 'SmartMarco',
	'value': 'SmartMarco'
}, {
	'label': 'RDA',
	'value': 'RDA'
}, {
	'label': '其他',
	'value': 'others'
}];

dropdowns['TDLTE'] = [{
	'label': 'B38',
	'value': 'B38'
}, {
	'label': 'B39',
	'value': 'B39'
}, {
	'label': 'B40',
	'value': 'B40'
}, {
	'label': 'B41',
	'value': 'B41'
}];

dropdowns['FDDLTE'] = [{
	'label': 'B1',
	'value': 'B1'
}, {
	'label': 'B3',
	'value': 'B3'
}, {
	'label': 'B4',
	'value': 'B4'
}, {
	'label': 'B7',
	'value': 'B7'
}, {
	'label': 'B8',
	'value': 'B8'
}, {
	'label': 'B12',
	'value': 'B12'
}, {
	'label': 'B17',
	'value': 'B17'
}, {
	'label': 'B20',
	'value': 'B20'
}];

dropdowns['TDSCDMA'] = [{
	'label': 'B34',
	'value': 'B34'
}, {
	'label': 'B39',
	'value': 'B39'
}];

dropdowns['is_left_question'] = [{
	label: '全部问题',
	value: 'all_question'
}, {
	label: '遗留问题',
	value: 'is_left_question'
}];

dropdowns['WCDMA'] = [{
	'label': 'B1',
	'value': 'B1'
}, {
	'label': 'B2',
	'value': 'B2'
}, {
	'label': 'B5',
	'value': 'B5'
}, {
	'label': 'B8',
	'value': 'B8'
}];

dropdowns['GSM'] = [{
	'label': 'B2',
	'value': 'B2'
}, {
	'label': 'B3',
	'value': 'B3'
}, {
	'label': 'B5',
	'value': 'B5'
}, {
	'label': 'B8',
	'value': 'B8'
}];

dropdowns['testRage'] = [{
	'label': 'V1',
	'value': 'V1'
}, {
	'label': 'V2',
	'value': 'V2'
}, {
	'label': 'V3',
	'value': 'V3'
}, {
	'label': '复验',
	'value': 'Approving'
}];

dropdowns['groups'] = [{
	'label': 'Modem',
	'value': 'Modem'
}, {
	'label': 'PLD',
	'value': 'PLD'
}, {
	'label': 'WCN',
	'value': 'WCN'
}, {
	'label': 'HW',
	'value': 'HW'
}, {
	'label': 'Test',
	'value': 'Test'
}, {
	'label': 'FAE',
	'value': 'FAE'
}, {
	'label': 'Custom',
	'value': 'Custom'
}, {
	'label': 'Ali',
	'value': 'Ali'
}];

dropdowns['actions'] = [{
	'label': '客户复现',
	'value': 'guestRepeat'
}, {
	'label': '仪表复现',
	'value': 'watchRepeat'
}, {
	'label': '外场复现',
	'value': 'outRepeat'
}, {
	'label': '客户复现',
	'value': 'guestRepeat'
}, {
	'label': '约中移环境',
	'value': 'cmccRepeat'
}, {
	'label': '研发分析',
	'value': 'developRepeat'
}, {
	'label': '提供TR报告',
	'value': 'trReport'
}, {
	'label': '环境问题',
	'value': 'envirRepeat'
}, {
	'label': '代码合入',
	'value': 'codeRepeat'
}];

dropdowns['diff_onmeeting'] = [{
	'label': 'YES',
	'value': 'YES'
}, {
	'label': 'NO',
	'value': 'NO'
}];

dropdowns['finishStatus'] = [{
	'label': 'NT',
	'value': 'NT'
}, {
	'label': 'Testing',
	'value': 'Testing'
}, {
	'label': 'Finished',
	'value': 'Finished'
}];
dropdowns['testResult'] = [{
	'label': 'Pass',
	'value': 'Pass'
}, {
	'label': 'Fail',
	'value': 'Fail'
}];

dropdowns['project_status'] = [{
	label: 'Approving',
	value: 'Approving'
}, {
	label: 'Testing',
	value: 'Testing'
}, {
	label: 'Plan',
	value: 'Plan'
}, {
	label: 'Pass',
	value: 'Pass'
}, {
	label: 'Cancel',
	value: 'Cancel'
}];

dropdowns['testItem'] = [{
	'label': '音频调试(窄带)',
	'value': 'music_modify_tape'
}, {
	'label': '音频调试(宽带)',
	'value': 'music_modify_broad'
}, {
	'label': '天线调试(自由空间)',
	'value': 'free_space_check'
}, {
	'label': '天线调试(人手模型)',
	'value': 'wireless_hand_modal'
}, {
	'label': '射频调试(CMCC RF check list)',
	'value': 'cmcc_rf_check_list'
}, {
	'label': 'MTBF(测试)',
	'value': 'mtbf_check'
}, {
	'label': 'VoLTE功耗测试',
	'value': 'volte_waste_check'
}, {
	'label': 'LTE RRM 7.1.2',
	'value': 'lte_rrm_712'
}, {
	'label': '软件配置检查(PreCheckApk)',
	'value': 'softConfigCheck'
}, {
	'label': '外场自动化自检',
	'value': 'outAutoCheck'
}];

enums['summary_type'] = {
	month: {
		label: '按月',
		value: 'month'
	},
	week: {
		label: '按周',
		value: 'week'
	}
}
enums['diff_onmeeting'] = {
	YES: {
		label: 'YES',
		value: 'YES'
	},
	NO: {
		label: 'NO',
		value: 'NO'
	}
}
window.enums = enums;
window.dropdowns = dropdowns;

window.projectInfo = {
	question_num: {
		label: '问题编号',
		value: '',
		required: {
			message: '问题编号不能为空'
		}
	},
	Cust_Model: {
		label: 'Cust_Model',
		value: '',
		required: {
			message: 'Cust_Model不能为空'
		}
	},
	project_id: {
		label: 'project_id',
		value: '',
		required: {
			message: 'Project ID不能为空'
		}
	},
	chip_name: {
		label: '芯片名称',
		value: '',
		required: {
			message: '芯片名称不能为空'
		}
	},
	cust_name: {
		label: '客户名称',
		value: '',
		required: {
			message: '客户名称不能为空'
		}
	},
	project_name: {
		label: '项目名称',
		value: '',
		required: {
			message: '项目名称不能为空'
		}
	},
	send_test_type: {
		label: '送测类型',
		value: '',
		required: {
			message: '送测类型不能为空'
		}
	},
	test_range: {
		label: '测试范围',
		value: '',
		required: {
			flag: 0,
			message: '测试范围不能为空'
		}
	},
	plan_sendtest_time: {
		label: '计划送测时间',
		value: '',
		required: {
			message: '计划送测时间不能为空'
		}
	},
	operate_system: {
		label: '操作系统',
		value: '',
		required: {
			message: '操作系统不能为空'
		}
	},
	Radiofrequency_PA: {
		label: '射频PA',
		value: '',
		required: {
			message: '射频PA不能为空'
		}
	},
	Network_type: {
		label: '网络类型',
		value: '',
		required: {
			message: '网络类型不能为空'
		}
	},
	TDLTE: {
		label: 'TDLTE',
		value: ['B39', 'B40', 'B41'],
		required: {
			message: 'TDLTE不能为空'
		},
		getValue: function() {
			return this.value.join(',');
		}
	},
	FDDLTE: {
		label: 'FDDLTE',
		value: ['B3', 'B7'],
		required: {
			message: 'FDDLTE不能为空'
		},
		getValue: function() {
			return this.value.join(',');
		}
	},
	TDSCDMA: {
		label: 'TDSCDMA',
		value: ['B34', 'B39'],
		required: {
			message: 'TDSCDMA不能为空'
		},
		getValue: function() {
			return this.value.join(',');
		}
	},
	WCDMA: {
		label: 'WCDMA',
		value: ['B1', 'B2', 'B5'],
		required: {
			message: 'WCDMA不能为空'
		},
		getValue: function() {
			return this.value.join(',');
		}
	},
	GSM: {
		label: 'GSM',
		value: ['B2', 'B3', 'B8'],
		required: {
			message: 'GSM不能为空'
		},
		getValue: function() {
			return this.value.join(',');
		}
	},
	CPM: {
		label: 'CPM',
		value: '',
		required: {
			message: 'CPM不能为空'
		}
	},
	SW_TAM: {
		label: 'SW_TAM',
		value: '',
		required: {
			message: 'SW_TAM不能为空'
		}
	},
	HW_TAM: {
		label: 'HW_TAM',
		value: '',
		required: {
			message: 'HW_TAM不能为空'
		}
	},
	HW_RF: {
		label: 'HW_RF',
		value: '',
		required: {
			message: 'HW_RF不能为空'
		}
	},
	Audio_PL: {
		label: 'Audio_PL',
		value: '',
		required: {
			message: 'Audio_PL不能为空'
		}
	},
	Power_PL: {
		label: 'Power_PL',
		value: '',
		required: {
			message: 'Power_PL不能为空'
		}
	},
	All_PM: {
		label: 'All_PM',
		value: '',
		required: {
			message: 'All_PM不能为空'
		}
	},
	PLD_PM: {
		label: 'PLD_PM',
		value: '',
		required: {
			message: 'PLD_PM不能为空'
		}
	},
	CSD_PM: {
		label: 'CSD_PM',
		value: '',
		required: {
			message: 'CSD_PM不能为空'
		}
	},
	PHY_PL: {
		label: 'PHY_PL',
		value: '',
		required: {
			message: 'PHY_PL不能为空'
		}
	},
	Test_PL: {
		label: 'Test_PL',
		value: '',
		required: {
			message: 'Test_PL不能为空'
		}
	},
	PICLAB_FO: {
		label: 'PICLAB_FO',
		value: '',
		required: {
			message: 'PICLAB_FO不能为空'
		}
	},
	FT_FO: {
		label: 'FT_FO',
		value: '',
		required: {
			message: 'FT_FO不能为空'
		}
	},
	Ali_PM: {
		label: 'Ali_PM',
		value: '',
		required: {
			message: 'Ali_PM不能为空'
		}
	},
	passed_time: {
		label: '入库通过时间',
		value: '',
		required: {
			message: '入库通过时间不能为空'
		}
	},
	onmeeting_time: {
		label: '上会时间',
		value: '',
		required: {
			message: '上会时间不能为空'
		}
	},
	recheck_num: {
		label: '复检问题数',
		value: '',
		required: {
			message: '复检问题数不能为空'
		}
	},
	project_status: {
		label: '项目状态',
		value: '',
		required: {
			message: '项目状态不能为空'
		}
	},
	onmeeting_days: {
		label: '上会天数',
		value: '',
		required: {
			message: '上会天数不能为空'
		}
	}
};

window.questionForm = {
	question_num: {
		label: '问题编号',
		value: '',
		required: {
			label: '问题编号不能为空'
		},
		showType: 'guestInfo'
	},
	question_content: {
		label: '问题内容',
		value: '',
		required: {
			label: '问题内容不能为空'
		},
		showType: 'guestInfo'
	},
	question_serious: {
		label: '问题严重性',
		value: '',
		required: {
			label: '问题严重性不能为空'
		},
		showType: 'guestInfo'
	},
	model_name: {
		label: '模块名称',
		value: '',
		required: {
			label: '模块名称不能为空'
		},
		showType: 'guestInfo'
	},
	related_case: {
		label: '关联用例',
		value: '',
		required: {
			label: '关联用例不能为空'
		},
		showType: 'guestInfo'
	},
	action: {
		label: 'action',
		value: '',
		required: {
			label: 'action不能为空'
		},
		showType: 'guestInfo'
	},
	groups: {
		label: 'group',
		value: '',
		required: {
			label: 'group不能为空'
		},
		showType: 'guestInfo'
	},
	bug_id: {
		label: 'bug_id',
		value: '',
		required: {
			label: 'bug_id不能为空'
		},
		showType: 'bugzilla'
	},
	difference_meeting: {
		label: '影响上会',
		value: '',
		required: {
			label: '是否影响上会不能为空'
		},
		showType: 'guestInfo'
	},
	comments: {
		label: 'comment',
		value: '',
		required: {
			label: 'comment不能为空'
		},
		showType: 'guestInfo'
	},
	close_range: {
		label: '关闭轮次',
		value: '',
		required: {
			label: '关闭轮次不能为空'
		},
		showType: 'guestInfo'
	},
	bug_owner: {
		label: 'Bug Owner',
		value: '',
		required: {
			label: 'Bug Owner不能为空'
		},
		showType: 'bugzilla'
	},
	bug_status: {
		label: 'Bug Status',
		value: '',
		required: {
			label: 'Bug Status不能为空'
		},
		showType: 'bugzilla'
	},
	base_on_ver: {
		label: 'Base on Ver',
		value: '',
		required: {
			label: 'Base on Ver不能为空'
		},
		showType: 'bugzilla'
	},
	fix_on_ver: {
		label: 'Fix on Ver',
		value: '',
		required: {
			label: 'Fix on Ver不能为空'
		},
		showType: 'bugzilla'
	},
	question_title: {
		label: '问题标题',
		value: '',
		required: {
			label: '问题标题不能为空'
		},
		showType: 'guestInfo'
	},
	question_status: {
		label: '问题状态',
		value: '',
		required: {
			label: '问题状态不能为空'
		},
		showType: 'guestInfo'
	},
	model_name: {
		label: '模块名称',
		value: '',
		required: {
			label: '模块名称不能为空'
		},
		showType: 'guestInfo'
	},
	problem_category: {
		label: '问题类别',
		value: '',
		required: {
			label: '问题类别不能为空'
		},
		showType: 'guestInfo'
	},
	problem_properties: {
		label: '问题属性',
		value: '',
		required: {
			label: '问题属性不能为空'
		},
		showType: 'guestInfo'
	},
	manufacturer_name: {
		label: '厂商名称',
		value: '',
		required: {
			label: '厂商名称不能为空'
		},
		showType: 'guestInfo'
	},
	project_name: {
		label: '产品名称',
		value: '',
		required: {
			label: '产品名称不能为空'
		},
		showType: 'guestInfo'
	},
	the_product_line: {
		label: '产品线',
		value: '',
		required: {
			label: '产品线不能为空'
		},
		showType: 'guestInfo'
	},
	the_product_type: {
		label: '产品类型',
		value: '',
		required: {
			label: '产品类型不能为空'
		},
		showType: 'guestInfo'
	},
	business_type: {
		label: '商务类型',
		value: '',
		required: {
			label: '商务类型不能为空'
		},
		showType: 'guestInfo'
	},
	software_version: {
		label: '软件版本',
		value: '',
		required: {
			label: '软件版本不能为空'
		},
		showType: 'guestInfo'
	},
	imei: {
		label: 'imei',
		value: '',
		required: {
			label: 'imei不能为空'
		},
		showType: 'guestInfo'
	},
	use_cases: {
		label: '用例数',
		value: '',
		required: {
			label: '用例数不能为空'
		},
		showType: 'guestInfo'
	},
	ranges: {
		label: '发现问题轮次',
		value: '',
		required: {
			label: '发现问题轮次不能为空'
		},
		showType: 'guestInfo'
	},
	to_solve_the_problem_rounds: {
		label: '关闭轮次',
		value: '',
		required: {
			label: '解决问题轮次不能为空'
		},
		showType: 'guestInfo'
	},
	close_the_reason: {
		label: '关闭原因',
		value: '',
		required: {
			label: '关闭原因不能为空'
		},
		showType: 'guestInfo'
	},
	whether_or_not_to_discuss: {
		label: '是否讨论',
		value: '',
		required: {
			label: '是否讨论不能为空'
		},
		showType: 'guestInfo'
	},
	project: {
		label: '项目',
		value: '',
		required: {
			label: '项目不能为空'
		},
		showType: 'guestInfo'
	},
	organization: {
		label: '组织',
		value: '',
		required: {
			label: '组织不能为空'
		},
		showType: 'guestInfo'
	},
	organization: {
		label: '组织',
		value: '',
		required: {
			label: '组织不能为空'
		},
		showType: 'guestInfo'
	},
	business_types: {
		label: '业务类型',
		value: '',
		required: {
			label: '业务类型不能为空'
		},
		showType: 'guestInfo'
	},
	test_site: {
		label: '测试地点',
		value: '',
		required: {
			label: '测试地点不能为空'
		},
		showType: 'guestInfo'
	},
	creation_time: {
		label: '创建时间',
		value: '',
		required: {
			label: '创建时间不能为空'
		},
		showType: 'guestInfo'
	},
	closing_time: {
		label: '关闭时间',
		value: '',
		required: {
			label: '关闭时间不能为空'
		},
		showType: 'guestInfo'
	},
	comments: {
		label: '备注',
		value: '',
		required: {
			label: '评论不能为空'
		}
	}

}

window.beforeDays = 300;
window.HighchartsHight = 300;
window.colorsRange = {
	v1: '#33ff00',
	v2: '#FFC125',
	v3: '#FF0000'

}
window.colorsPassOrTest = {
	pass: '#33ff00',
	test: '#87CEFA'
}
window.passTimeColor = {
	avg: '#33ff00',
	single: '#87CEFA'
}

function removeZero() {
	$('tspan').filter(function() {
		if($(this).text() == 0) {
			return true;
		}

	}).css('display', 'none');

}