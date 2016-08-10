var DpHttp = function(Utils, httpUtils) {
	this.Utils = Utils;
	this.httpUtils = httpUtils;
	this.reportLocation = null;
	this.reportPush = null;
}

/**
 * 请求系统配置参数
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.systemSettings = function(onSuccess, onFailure) {
	var pointer = this;
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/basic/system_settings', null, function(responseJson) {
		pointer.httpUtils.saveSystemSettings(responseJson.sheetmetal_category_id, responseJson.maintenance_category_id);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 返回一个数组
 * 第一个元素是钣喷类别ID  sheetmetal_category_id
 * 第二个元素是保养类别ID  maintenance_category_id
 */
DpHttp.prototype.getSystemSettings = function() {
	var SystemSettingsArray = new Array();
	//钣喷类别ID
	var sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id') || false;
	//保养类别ID
	var maintenance_category_id = plus.storage.getItem('maintenance_category_id') || false;
	!maintenance_category_id && this.systemSettings();
	SystemSettingsArray.push(plus.storage.getItem('sheetmetal_category_id'));
	SystemSettingsArray.push(plus.storage.getItem('maintenance_category_id'));
	return SystemSettingsArray;
}

/**
 * 根据未完成的订单中是否有待取车和还车中的状态
 * 有就实时定位
 * @param {Object} unfinisheds
 */
DpHttp.prototype.isUploadLocation = function(unfinisheds) {
	var pointer = this;

	if(unfinisheds) {
		var flag = true;
		for(index in unfinisheds) {
			if(unfinisheds[index].status == Constant.orderStatus.STATUS_WAIT_COLLECT) {
				flag = false;
				pointer.uploadLocation(false);
				break;
			} else if(unfinisheds[index].status == Constant.orderStatus.STATUS_RETURNING) {
				flag = false;
				pointer.uploadLocation(false);
				break;
			}
		}
		if(flag) {
			pointer.uploadLocation(true);
		}
	} else {
		pointer.uploadLocation(true);
	}
}

/**
 * 上传地理位置 
 * @param {Object} isCancel
 */
DpHttp.prototype.uploadLocation = function(isCancel) {
	var pointer = this;
	if(isCancel) {
		pointer.Utils.getGeoCode(function(position) {
			pointer.Utils.getAdressInfo(position);
			var getParamsMap = new Map();
			getParamsMap.put('baidu_latitude', pointer.Utils.base64_encode(position.coords.latitude));
			getParamsMap.put('baidu_longitude', pointer.Utils.base64_encode(position.coords.longitude));
			pointer.httpUtils.httpGetAndCheckAccessToken('/adapi/drivers/location', getParamsMap, function(responseJson) {
				var main = plus.webview.getWebviewById('main');
				if(main) {
					mui.fire(main, 'newAddress');
				}
			}, function(errorJson) {});
		});
	} else {
		pointer.reportLocation = window.setInterval(function() {
			pointer.Utils.getGeoCode(function(position) {
				pointer.Utils.getAdressInfo(position);
				var getParamsMap = new Map();
				getParamsMap.put('baidu_latitude', pointer.Utils.base64_encode(position.coords.latitude));
				getParamsMap.put('baidu_longitude', pointer.Utils.base64_encode(position.coords.longitude));
				pointer.httpUtils.httpGetAndCheckAccessToken('/adapi/drivers/location', getParamsMap, function(responseJson) {}, function(errorJson) {});
				var main = plus.webview.getWebviewById('main');
				if(main) {
					mui.fire(main, 'newAddress');
				}
			});
		}, ApiConfig.UPLOADLOCATIONTIME * 1000);
	}

	if(isCancel) {
		if(pointer.reportLocation) {
			window.clearInterval(pointer.reportLocation);
		}
	}
}

/**
 * 循环绑定cid
 */
DpHttp.prototype.isReportPushCid = function() {
	var pointer = this;
	this.reportPushCid(function(responseJson) {

	}, function(errorJson) {
		pointer.reportPush = window.setInterval(function() {
			pointer.reportPushCid(function(responseJson) {
				if(pointer.reportPush) {
					window.clearInterval(pointer.reportPush);
				}
			}, function(errorJson) {

			});
		}, ApiConfig.ISREPORTPUSHCID * 1000);
	});

}

/**
 * * 上报推送接口
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.reportPushCid = function(onSuccess, onFailure) {
	var pointer = this;
	var info = plus.push.getClientInfo();
	ApiConfig.staticToast(info.clientid);
	var getParams = new Map();
	getParams.put('cid', info.clientid);
	getParams.put("provider", "igetui");
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/users/report_push_cid', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 取消推送接口
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.cancelPushCid = function(onSuccess, onFailure) {
	var pointer = this;
	var info = plus.push.getClientInfo();
	var getParams = new Map();
	getParams.put('cid', info.clientid);
	getParams.put("provider", "igetui");
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/users/cancel_push_cid', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 登录方法
 * @param {Object} username
 * @param {Object} passwords
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.login = function(username, passwords, onSuccess, onFailure) {
	var pointer = this;
	var Url = 'http://api2.mimixiche.com/adapi/users/login';
	if(ApiConfig.DEBUG) {
		Url = 'http://addev.mimixiche.cn/adapi/users/login';
	}
	var getParams = new Map();
	var utils = new Utils();
	switch(plus.os.name) {
		case "Android":
			getParams.put('unique_id', utils.getDeviceId());
			getParams.put('ver', ApiConfig.VER);
			getParams.put('timestamp', pointer.httpUtils.phptime());
			Url += pointer.httpUtils.getUrl(getParams);
			getParams.remove('ver');
			Url += pointer.httpUtils.getSignature(getParams)

			var postParams = new Map();
			postParams.put('username', username);
			postParams.put('password', passwords);
			postParams.put('device[unique_id]', utils.getDeviceId());
			postParams.put('device[device_type]', 'Android');
			pointer.httpUtils.httpPost(Url, postParams, function(responseJson) {
				//存储用户信息
				pointer.httpUtils.saveLoginInfo(responseJson.appid, responseJson.appsecret, responseJson.access_token, responseJson.access_token, responseJson.expires_in, JSON.stringify(responseJson.user));
				pointer.systemSettings();
				if(typeof onSuccess == "function") {
					pointer.isReportPushCid();
					onSuccess(responseJson);
				}
			}, function(errorJson) {
				if(typeof onFailure == "function") {
					if(errorJson == null) {
						onFailure(httpUtils.errorMessage(errorJson));
						ApiConfig.staticShowToast(httpUtils.errorMessage('null'));
					} else {
						onFailure(httpUtils.errorMessage(errorJson.error_code));
						ApiConfig.staticShowToast(httpUtils.errorMessage(errorJson.error_code));
					}
				}
			});
			break;
		case "iOS":
			getParams.put('unique_id', plus.device.uuid);
			getParams.put('ver', ApiConfig.VER);
			getParams.put('timestamp', pointer.httpUtils.phptime());

			Url += httpUtils.getUrl(getParams);
			getParams.remove('ver');
			Url += pointer.httpUtils.getSignature(getParams)

			var postParams = new Map();
			postParams.put('username', username);
			postParams.put('password', passwords);
			postParams.put('device[unique_id]', plus.device.uuid);
			postParams.put('device[device_type]', 'iOS');
			pointer.httpUtils.httpPost(Url, postParams, function(responseJson) {
				//存储用户信息
				pointer.httpUtils.saveLoginInfo(responseJson.appid, responseJson.appsecret, responseJson.access_token, responseJson.access_token, responseJson.expires_in, JSON.stringify(responseJson.user));
				pointer.systemSettings();
				if(typeof onSuccess == "function") {
					pointer.isReportPushCid();
					onSuccess(responseJson);
				}
			}, function(errorJson) {
				if(typeof onFailure == "function") {
					if(errorJson == null) {
						onFailure(httpUtils.errorMessage(errorJson));
						ApiConfig.staticShowToast(httpUtils.errorMessage('null'));
					} else {
						onFailure(httpUtils.errorMessage(errorJson.error_code));
						ApiConfig.staticShowToast(httpUtils.errorMessage(errorJson.error_code));
					}
				}
			});
			break;
		default:
			// 其它平台
			break;
	}
}

/**
 * 注销登录
 * 取消上报cid接口和地理位置接口
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.logout = function(onSuccess, onFailure) {
	var pointer = this;
	pointer.cancelPushCid();
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/users/logout', null, function(responseJson) {
		pointer.httpUtils.deleteInfo();
		if(pointer.reportPush) {
			window.clearInterval(reportPush);
		}
		if(pointer.reportLocation) {
			window.clearInterval(pointer.reportLocation);
		}
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 当订单支付金额为0的时候直接将状态改为完成
 * @param {Object} order
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.Ordersfinded = function(order, onSuccess, onFailure) {
	var pointer = this;
	var arrayStatus = new Array();
	//钣喷类别ID
	var sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id') || false;
	//保养类别ID
	var maintenance_category_id = plus.storage.getItem('maintenance_category_id') || false;
	!maintenance_category_id && this.systemSettings();
	sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id');
	maintenance_category_id = plus.storage.getItem('maintenance_category_id');
	if(Constant.orderStatus.STATUS_RETURNING) {
		arrayStatus.push(Constant.orderStatus.STATUS_SUCCESS);
	}
	if(arrayStatus.length > 0) {
		this.changeOrdersStauts(order._id, arrayStatus[0], function(responseJson) {
			if(typeof onSuccess == "function")
				onSuccess(responseJson);
		}, function(errorJson) {
			if(typeof onFailure == "function")
				onFailure(errorJson);
		});
	}
}

/**
 * 修改订单状态
 * 先获取订单类别(钣喷类和保养类)如果为undefined则重新调用systemSettings函数
 * 判断是哪个类别的订单,将属于这个订单的状态取出来,删掉不能修改的状态
 * 选择该订单的下一个状态,修改订单状态
 * @param {Object} order
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.checkOrdersStatus = function(order, onSuccess, onFailure) {
	var pointer = this;
	var arrayStatus = new Array();
	//钣喷类别ID
	var sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id') || false;
	//保养类别ID
	var maintenance_category_id = plus.storage.getItem('maintenance_category_id') || false;
	!maintenance_category_id && this.systemSettings();
	sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id');
	maintenance_category_id = plus.storage.getItem('maintenance_category_id');

	if(order.main_product_category._id == maintenance_category_id) {
		/**
		 * 待客服确认	STATUS_WAIT_SERVICE
		 * 待取车		STATUS_WAIT_COLLECT
		 * 已取车		STATUS_COLLECTED
		 * 施工中		STATUS_CONSTRUCTION
		 * 施工完成		STATUS_CONSTRUCTED
		 * 正在还车		STATUS_RETURNING
		 */
		switch(order.status) {
			case Constant.orderStatus.STATUS_WAIT_SERVICE:
				arrayStatus.push(Constant.orderStatus.STATUS_WAIT_COLLECT);
				break;
			case Constant.orderStatus.STATUS_WAIT_COLLECT:
				arrayStatus.push(Constant.orderStatus.STATUS_COLLECTED);
				break;
			case Constant.orderStatus.STATUS_COLLECTED:
				arrayStatus.push(Constant.orderStatus.STATUS_CONSTRUCTION);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTION:
				arrayStatus.push(Constant.orderStatus.STATUS_CONSTRUCTED);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTED:
				arrayStatus.push(Constant.orderStatus.STATUS_RETURNING);
				break;
		}
	} else if(order.main_product_category._id == sheetmetal_category_id) {
		/**
		 * 待客服确认	STATUS_WAIT_SERVICE
		 * 待取车		STATUS_WAIT_COLLECT
		 * 已取车		STATUS_COLLECTED
		 * 施工中		STATUS_CONSTRUCTION
		 * 施工完成		STATUS_CONSTRUCTED
		 * 正在还车		STATUS_RETURNING
		 */
		switch(order.status) {
			case Constant.orderStatus.STATUS_WAIT_SERVICE:
				arrayStatus.push(Constant.orderStatus.STATUS_WAIT_COLLECT);
				break;
			case Constant.orderStatus.STATUS_WAIT_COLLECT:
				arrayStatus.push(Constant.orderStatus.STATUS_COLLECTED);
				break;
			case Constant.orderStatus.STATUS_COLLECTED:
				arrayStatus.push(Constant.orderStatus.STATUS_CONSTRUCTION);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTION:
				arrayStatus.push(Constant.orderStatus.STATUS_CONSTRUCTED);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTED:
				arrayStatus.push(Constant.orderStatus.STATUS_RETURNING);
				break;
		}
	} else {
		switch(order.service_category) {
			//1 	耗材	
			case Constant.productServiceCategory.CATEGORYSUPPLIES:
				//TODO 
				break;
				//2	    安装维修
			case Constant.productServiceCategory.CATEGORYMAINTENANCE:
				//TODO
				break;
				//3		饰品配件	
			case Constant.productServiceCategory.CATEGORYJEWELRYACCESSORIES:
				//TODO
				break;
			case Constant.productServiceCategory.CATEGORYSCLAIM:
				switch(order.status) {
					case Constant.orderStatus.STATUS_WAIT_SERVICE:
						arrayStatus.push(Constant.orderStatus.STATUS_WAIT_COLLECT);
						break;
					case Constant.orderStatus.STATUS_WAIT_COLLECT:
						arrayStatus.push(Constant.orderStatus.STATUS_COLLECTED);
						break;
					case Constant.orderStatus.STATUS_COLLECTED:
						arrayStatus.push(Constant.orderStatus.STATUS_CONSTRUCTION);
						break;
					case Constant.orderStatus.STATUS_CONSTRUCTION:
						arrayStatus.push(Constant.orderStatus.STATUS_CONSTRUCTED);
						break;
					case Constant.orderStatus.STATUS_CONSTRUCTED:
						arrayStatus.push(Constant.orderStatus.STATUS_RETURNING);
						break;
				}
				break;
		}
	}
	if(arrayStatus.length > 0) {
		this.changeOrdersStauts(order._id, arrayStatus[0], function(responseJson) {
			if(typeof onSuccess == "function")
				onSuccess(responseJson);
		}, function(errorJson) {
			if(typeof onFailure == "function")
				onFailure(errorJson);
		});
	}
}

/**
 * 订单修改的接口
 * @param {Object} order_id
 * @param {Object} status
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.changeOrdersStauts = function(order_id, status, onSuccess, onFailure) {
	var pointer = this;
	var getParams = new Map();
	getParams.put('id', order_id);
	getParams.put('is_driver', '1');
	getParams.put('status', status);
	pointer.httpUtils.httpGetAndCheckAccessToken('/adapi/orders/status', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 编辑保养订单的备注
 * @param {Object} order_id
 * @param {Object} remark
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.changeOrderInfoRemark = function(order_id, remark, onSuccess, onFailure) {
	var getParams = new Map();
	getParams.put('id', order_id);
	getParams.put('remark', remark);
	this.httpUtils.httpPostAndCheckAccessToken('/adapi/orders/change_orderinfo', getParams, null, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 编辑保养订单的备注
 * @param {Object} order_id
 * @param {Object} explain
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.changeOrderInfoExplain = function(order_id, explain, onSuccess, onFailure) {
	var getParams = new Map();
	getParams.put('id', order_id);
	getParams.put('explain', explain);
	this.httpUtils.httpPostAndCheckAccessToken('/adapi/orders/change_orderinfo', getParams, null, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 编辑订单
 * @param {Object} order_id
 * @param {Object} collect_license
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.changeOrderInfoCollectLicense = function(order_id, collect_license, onSuccess, onFailure) {
	var getParams = new Map();
	getParams.put('id', order_id);
	getParams.put('collect_license', collect_license);
	this.httpUtils.httpPostAndCheckAccessToken('/adapi/orders/change_orderinfo', getParams, null, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 编辑保养订单的商品
 * @param {Object} order_id
 * @param {Object} products
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.changeOrderInfoProducts = function(order_id, products, onSuccess, onFailure) {
	var getParams = new Map();
	getParams.put('id', order_id);
	this.httpUtils.httpPostAndCheckAccessToken('/adapi/orders/change_orderinfo', getParams, products, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 获取订单详情信息
 * @param {Object} order_id
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.orderDetail = function(order_id, onSuccess, onFailure) {
	var pointer = this;
	var getParams = new Map();
	getParams.put('order_id', order_id);
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/products/order_detail', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 获取支付宝链接
 * @param {Object} order_id
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.alipayUrl = function(order_id, onSuccess, onFailure) {
	var pointer = this;
	var getParams = new Map();
	getParams.put('id', order_id);
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/trades/alipay_url', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 使用优惠券的消费码
 * @param {Object} order_id
 * @param {Object} consume_code
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.promotions = function(order_id, consume_code, onSuccess, onFailure) {
	var pointer = this;
	var getParams = new Map();
	getParams.put('order_id', order_id);
	getParams.put('consume_code', consume_code);
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/products/use_coupon', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}

/**
 * 
 * @param {Object} key_id
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
DpHttp.prototype.userPrivileges = function(key_id, onSuccess, onFailure) {
	var pointer = this;
	var getParams = new Map();
	getParams.put('key_id', key_id);
	this.httpUtils.httpGetAndCheckAccessToken('/adapi/user_privileges/check', getParams, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function")
			onFailure(errorJson);
	});
}