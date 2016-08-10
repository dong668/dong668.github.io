var HttpUtils = function(options) {
	this.host = ApiConfig.HOST;
	//this.host = (options.host ? options.host : "http://wx.mimixiche.com");
	//	options.async = (options.async ? true : options.async);
	//	options.async || options.async = true; 如果async等于undefined则async赋值 相当于初始化赋值
	//	onSuccess && onSuccess(); 如果onSuccess等于true则执行onSuccess()方法 
	var errorCodes = new Map();

	errorCodes.put("null", "请检查网络是否正常");
	//常规错误
	errorCodes.put("10001", "signature不正确");
	errorCodes.put("10002", "access_token不正确");
	errorCodes.put("10003", "access_token已过期");
	errorCodes.put("10004", "用户激活");
	errorCodes.put("10005", "用户已初始化");
	errorCodes.put("10006", "APPID不合法");
	errorCodes.put("10007", "参数不足");
	errorCodes.put("10008", "有参数非法");
	errorCodes.put("10009", "请求已过期或时间错误");
	errorCodes.put("10010", "用户不存在或者密码错");
	errorCodes.put("10011", "APPSECRET不合法");
	errorCodes.put("10012", "access_token无法获得");
	errorCodes.put("10013", "未找到数据");
	errorCodes.put("10014", "编辑用户错误");
	errorCodes.put("10015", "用户密码不正确");
	errorCodes.put("10016", "修改密码错误");
	errorCodes.put("10017", "用户已绑定微信");
	errorCodes.put("10018", "目标客户已绑定微信");
	errorCodes.put("10019", "数据同步中");
	errorCodes.put("10020", "数据同步失败");
	errorCodes.put("10021", "无效日期格式");
	errorCodes.put("10022", "图片文件过大");
	errorCodes.put("10023", "signature_invalid");
	errorCodes.put("10024", "无效的上传文件类别");
	errorCodes.put("10025", "操作失败");
	errorCodes.put("10026", "验证码过期");
	errorCodes.put("10027", "验证码不正确");
	errorCodes.put("10028", "用户账户异常");
	errorCodes.put("10029", "手机号码不正确");
	errorCodes.put("10030", "手机号码已注册");
	errorCodes.put("10031", "用户已绑定手机");
	errorCodes.put("10032", "用户绑定手机错误");
	errorCodes.put("10033", "微信已注册");
	errorCodes.put("10034", "用户绑定微信错误");
	errorCodes.put("10035", "请求被系统拒绝");
	errorCodes.put("10035", "请求被系统拒绝");
	errorCodes.put("10036", "admin账户异常");
	//设备及卡片信息错误
	errorCodes.put("20001", "设备已登记");
	errorCodes.put("20002", "设备类型不合法");
	errorCodes.put("20003", "设备已激活");
	errorCodes.put("20004", "设备初始化");
	errorCodes.put("20005", "设备参数缺失或不正确");
	errorCodes.put("20006", "设备未注册");
	errorCodes.put("20007", "设备激活失败");
	errorCodes.put("20008", "卡片注册失败");
	errorCodes.put("20009", "卡片不匹配");
	errorCodes.put("20010", "卡片已激活");
	errorCodes.put("20011", "微信已注册");
	errorCodes.put("20012", "卡片未激活");
	errorCodes.put("20013", "设备解绑失败");
	errorCodes.put("20014", "无效的手机号");
	//商户错误
	errorCodes.put("30001", "用户未注册店铺");
	errorCodes.put("30002", "商户处于异常状态");
	errorCodes.put("30003", "商户业务名称已存在");
	errorCodes.put("30004", "业务保存失败");
	errorCodes.put("30005", "商户业务不存在");
	errorCodes.put("30006", "商户业务不可删除");
	errorCodes.put("30007", "商户卡名称已存在");
	errorCodes.put("30008", "商户卡保存失败");
	errorCodes.put("30009", "商户卡不存在");
	errorCodes.put("30010", "商户设置失败");
	errorCodes.put("30011", "提现金额过低");
	errorCodes.put("30012", "超过可提现金额");
	errorCodes.put("30013", "提现申请失败");
	errorCodes.put("30014", "过多的提现申请");
	errorCodes.put("30015", "撤销提现申请失败");
	errorCodes.put("30016", "商户业务展示保存失败");
	errorCodes.put("30017", "担保退款已申请");
	errorCodes.put("30018", "优惠模板保存失败");
	errorCodes.put("30019", "优惠券保存失败");
	errorCodes.put("30020", "优惠券不适用于商户");
	errorCodes.put("30021", "优惠券已使用");
	errorCodes.put("30022", "优惠券已过期");
	errorCodes.put("30023", "优惠券类型错误");
	errorCodes.put("30024", "优惠券使用错误");
	errorCodes.put("30025", "优惠券消费码错误");
	errorCodes.put("30026", "用户卡未享受担保服务");
	errorCodes.put("30027", "优惠券不可兑换");
	errorCodes.put("30028", "微信卡劵核销失败");
	errorCodes.put("30029", "微信卡劵未支付");
	//交易类错误
	errorCodes.put("40000", "交易失败");
	errorCodes.put("40001", "交易不存在");
	errorCodes.put("40002", "余额不足");
	errorCodes.put("40003", "没找到用户的洗车卡");
	errorCodes.put("40004", "商户卡不存在");
	errorCodes.put("40005", "充值金额不在允许范围内");
	errorCodes.put("40006", "充值失败");
	errorCodes.put("40007", "赠送金额不在允许范围内");
	errorCodes.put("40008", "撤销交易失败");
	errorCodes.put("40009", "退用户卡失败");
	errorCodes.put("40010", "作废用户卡失败");
	errorCodes.put("40011", "二维码错误");
	errorCodes.put("40012", "交易请求已过期");
	errorCodes.put("40013", "订单状态不正确");
	errorCodes.put("40014", "交易已请求过");
	errorCodes.put("40015", "微信接口错误");
	errorCodes.put("40016", "支付宝接口错误");
	errorCodes.put("40017", "用户已购买促销活动洗车卡");
	errorCodes.put("40018", "没有合适的用户卡");
	errorCodes.put("40019", "未达到最小起购数");
	errorCodes.put("40020", "商品库存不足");
	errorCodes.put("40021", "订单提交失败");
	errorCodes.put("40022", "订单取消失败");
	errorCodes.put("40023", "商品未上架");
	errorCodes.put("40024", "");
	errorCodes.put("40025", "订单编辑失败");
	errorCodes.put("40026", "下单类型不支持");
	errorCodes.put("40027", "订单已完成支付");
	errorCodes.put("40028", "业务不支持该车型");
	//活动类错误
	errorCodes.put("50000", "活动不存在");
	errorCodes.put("50001", "用户不允许参与活动");
	errorCodes.put("50002", "活动奖品领取失败");
	errorCodes.put("50003", "不处于活动开放时间");
	errorCodes.put("50004", "字符长度非法");
	errorCodes.put("50005", "字符长度非法");
	errorCodes.put("50006", "活动创建失败");
	errorCodes.put("50007	", "抽奖次数不足");
	errorCodes.put("50008", "抽奖失败");
	this.errorCodes = errorCodes;
}

/**
 * 返回错误信息
 * @param {Object} errorCode
 */
HttpUtils.prototype.errorMessage = function(errorCode) {
	var message = this.errorCodes.get(errorCode);
	if(message == null) {
		message = "-1"
	} else if(message == undefined) {
		message = "-1"
	}
	if(message == "-1") {
		return "服务器忙碌,请稍后再次尝试";
	} else {
		return message;
	}
}

HttpUtils.prototype.toUtf8 = function(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if(c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

/**
 * 将map集合的value按字母排序
 * 并进行sha1的加密
 * @param {Object} getParamsMap
 */
HttpUtils.prototype.getSignature = function(getParamsMap) {
	var signature = "";
	var Keys = getParamsMap.keys();
	Keys = Keys.sort();
	for(var i = 0, len = getParamsMap.size(); i < len; i++) {
		var reg = /[\u4e00-\u9fa5]/g;
		if(reg.test(getParamsMap.get(Keys[i]))) {
			signature += this.toUtf8(getParamsMap.get(Keys[i]));
		} else {
			signature += getParamsMap.get(Keys[i]);
		}
	}
	var result = "signature=" + hex_sha1(signature);
	return result;
}

/**
 * 拼接url的Params
 * @param {Object} getParamsMap
 */
HttpUtils.prototype.getUrl = function(getParamsMap) {
	var Url = "?";
	var Keys = getParamsMap.keys();
	for(var i = 0, len = getParamsMap.size(); i < len; i++) {
		Url += Keys[i] + "=" + getParamsMap.get(Keys[i]) + "&";
	}
	return Url;
}

/**
 * 将postParamsMap中的post参数进行拼接
 * @param {Object} postParamsMap
 */
HttpUtils.prototype.getPostParams = function(postParamsMap) {
	var postParams = "";
	if(postParamsMap instanceof Array) {
		for(index in postParamsMap) {
			var Keys = postParamsMap[index].keys();
			for(var i = 0, len = postParamsMap[index].size(); i < len; i++) {
				postParams += Keys[i] + "=" + encodeURIComponent(postParamsMap[index].get(Keys[i])) + "&";
			}
		}
		return postParams.substring(0, postParams.length - 1);

	} else {
		var Keys = postParamsMap.keys();
		for(var i = 0, len = postParamsMap.size(); i < len; i++) {
			postParams += Keys[i] + "=" + encodeURIComponent(postParamsMap.get(Keys[i])) + "&";
		}
		return postParams.substring(0, postParams.length - 1);
	}
}

/**
 * 返回秒的时间戳 String
 */
HttpUtils.prototype.phptime = function() {
	var date = new Date();
	var timeInt = date.getTime();
	timeInt = (timeInt - (timeInt % 1000)) / 1000
	return timeInt + "";
}

/**
 * 返回秒的时间戳 number
 */
HttpUtils.prototype.phptimeInt = function() {
	var date = new Date();
	var timeInt = date.getTime();
	timeInt = (timeInt - (timeInt % 1000)) / 1000
	return timeInt;
}

/**
 * 将access_token等东西存储
 * @param {Object} appid
 * @param {Object} appsecret
 * @param {Object} access_token
 * @param {Object} access_token_old
 * @param {Object} expires_in
 * @param {Object} userInfo
 */
HttpUtils.prototype.saveLoginInfo = function(appid, appsecret, access_token, access_token_old, expires_in, userInfo) {
	var expires = this.phptimeInt();
	plus.storage.setItem("appid", appid);
	plus.storage.setItem("appsecret", appsecret);
	plus.storage.setItem("access_token", access_token);
	plus.storage.setItem("expires_in", expires_in + expires + "");
	plus.storage.setItem("access_token_old", access_token);
	plus.storage.setItem("userInfo", userInfo);
}

/*
 * 返回userInfo的Json数据
 */
HttpUtils.prototype.getUserInfo = function() {
	var userInfo = plus.storage.getItem('userInfo');
	return JSON.parse(userInfo);
}

/**
 * 储存系统配置参数
 * @param {Object} sheetmetal_category_id
 * @param {Object} maintenance_category_id
 */
HttpUtils.prototype.saveSystemSettings = function(sheetmetal_category_id, maintenance_category_id) {
	plus.storage.setItem("sheetmetal_category_id", sheetmetal_category_id);
	plus.storage.setItem("maintenance_category_id", maintenance_category_id);
}

/**
 * 将access_token等东西清除
 */
HttpUtils.prototype.deleteInfo = function() {
	plus.storage.clear();
}

/**
 * 跳转到index页面
 */
HttpUtils.prototype.openIndex = function() {
	setTimeout(function() {
		mui.openWindow({
			url: '../index.html',
			id: 'index',
			styles: {
				popGesture: 'none'
			},
			show: {
				aniShow: 'pop-in'
			},
			waiting: {
				autoShow: false
			}
		});
	}, 0);
	this.deleteInfo();
}

/**获取access_token超过一个月就重新登录
 * 不超过25天直接用
 * 超过25天并没超过一个月去刷新access_token
 * @param {Object} onSuccess
 */
HttpUtils.prototype.checkAccessToken = function(onSuccess) {
	var pointer = this;
	var expires_in = plus.storage.getItem('expires_in');
	var access_token = plus.storage.getItem('access_token');
	var access_token_old = plus.storage.getItem('access_token_old');
	var expires = this.phptimeInt();
	if(expires_in == undefined) {
		ApiConfig.staticIsDebug('expires_in', "undefined");
	} else {
		if(Number(expires_in) - 5 * 24 * 60 * 60 > expires) {
			if(typeof onSuccess == "function")
				onSuccess(access_token);
		} else if(Number(expires_in) - 5 * 24 * 60 * 60 < expires && Number(expires_in) > expires) {
			this.refreshAccessToken("/adapi/users/refresh_access_token", null, access_token_old, function(responseJson) {
				pointer.saveLoginInfo(responseJson.appid, responseJson.appsecret, responseJson.access_token, responseJson.access_token, responseJson.expires_in);
				if(typeof onSuccess == "function")
					onSuccess(responseJson.access_token);
			}, function(errorJson) {

			});
		} else {
			ApiConfig.staticIsDebug('login', "重新登录");
			pointer.openIndex();
		}
	}
}

/**
 * 刷新AccessToken
 * @param {Object} api
 * @param {Object} params
 * @param {Object} access_token_old
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
HttpUtils.prototype.refreshAccessToken = function(api, params, access_token_old, onSuccess, onFailure) {
	var pointer = this;
	if(params == null) {
		params = new Map();
	}
	if(params == undefined) {
		params = new Map();
	}
	var url = ApiConfig.HOST + api;
	var appid = plus.storage.getItem("appid");
	var appsecret = plus.storage.getItem("appsecret");
	var urlParams = "";
	params.put("appid", appid);
	params.put("ver", ApiConfig.VER);
	params.put("timestamp", this.phptime());
	params.put("access_token", access_token_old);
	urlParams = this.getUrl(params);
	params.remove("ver");
	params.put("appsecret", appsecret);
	urlParams += this.getSignature(params);
	url += urlParams;
	this.httpGet(url, function(responseJson) {
		if(typeof onSuccess == "function")
			onSuccess(responseJson);
	}, function(errorJson) {
		if(typeof onFailure == "function") {
			if(errorJson == null) {
				onFailure(pointer.errorMessage('null'));
			} else {
				onFailure(pointer.errorMessage(errorJson.error_code));
			}
		}
	});
}

/**
 * 封装Get请求并检查AccessToken是否过期
 * 过期提示重新登录
 * 没过期就继续使用
 * @param {Object} api
 * @param {Object} params
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
HttpUtils.prototype.httpGetAndCheckAccessToken = function(api, params, onSuccess, onFailure) {
	var pointer = this;
	this.checkAccessToken(function(access_token) {
		if(params == null) {
			params = new Map();
		}
		if(params == undefined) {
			params = new Map();
		}
		var url = ApiConfig.HOST + api;
		var appid = plus.storage.getItem("appid");
		var appsecret = plus.storage.getItem("appsecret");
		var urlParams = "";
		params.put("appid", appid);
		params.put("ver", ApiConfig.VER);
		params.put("timestamp", pointer.phptime());
		params.put("access_token", access_token);
		urlParams = pointer.getUrl(params);
		params.remove("ver");
		params.put("appsecret", appsecret);
		urlParams += pointer.getSignature(params);
		url += urlParams;
		pointer.httpGet(url, function(responseJson) {
			if(typeof onSuccess == "function") {
				onSuccess(responseJson);
			}
		}, function(errorJson) {
			if(typeof onFailure == "function") {
				if(errorJson == null) {
					onFailure(pointer.errorMessage(errorJson));
					ApiConfig.staticShowToast(httpUtils.errorMessage('null'));
				} else {
					onFailure(pointer.errorMessage(errorJson.error_code));
					ApiConfig.staticShowToast(httpUtils.errorMessage(errorJson.error_code));
					if(errorJson.error_code == '10002') {
						pointer.openIndex();
					}
				}
			}
		});
	});
}

/**
 * httpGet请求
 * @param {Object} Url
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
HttpUtils.prototype.httpGet = function(Url, onSuccess, onFailure) {
	//	var w = null;
	var responseJson = null;
	//	w = plus.nativeUI.showWaiting();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch(xhr.readyState) {
			case 4:
				//				w.close();
				//				w = null;
				if(xhr.status == 200) {
					responseJson = eval("(" + xhr.responseText + ")");
					if(responseJson.rt == 0) {
						if(typeof onFailure == "function") {
							ApiConfig.staticIsDebug('errorJson', responseJson, 1);
							onFailure(responseJson);
						}
					} else {
						if(typeof onSuccess == "function") {
							ApiConfig.staticIsDebug('responseJson', responseJson, 1);
							onSuccess(responseJson);
						}
					}
				} else {
					if(typeof onFailure == "function") {
						ApiConfig.staticIsDebug('errorJson', responseJson, 1);
						onFailure(responseJson);
					}
				}
				break;
			default:
				break;
		}
	}
	xhr.open('GET', Url);
	xhr.send();
	ApiConfig.staticIsDebug('httpGet', Url);
}

/**
 * 封装Post请求并检查AccessToken是否过期
 * 过期提示重新登录
 * 没过期就继续使用
 * @param {Object} api
 * @param {Object} getParams
 * @param {Object} postParams
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
HttpUtils.prototype.httpPostAndCheckAccessToken = function(api, getParams, postParams, onSuccess, onFailure) {
	var pointer = this;
	this.checkAccessToken(function(access_token) {
		if(getParams == null) {
			getParams = new Map();
		}
		if(getParams == undefined) {
			getParams = new Map();
		}
		if(postParams == null) {
			postParams = new Map();
		}
		if(postParams == undefined) {
			postParams = new Map();
		}
		var getUrl = ApiConfig.HOST + api;
		var postUrl = "";
		var appid = plus.storage.getItem("appid");
		var appsecret = plus.storage.getItem("appsecret");
		var urlParams = "";
		getParams.put("appid", appid);
		getParams.put("ver", ApiConfig.VER);
		getParams.put("access_token", access_token);
		getParams.put("timestamp", pointer.phptime());
		urlParams = pointer.getUrl(getParams);
		getParams.remove("ver");
		getParams.put("appsecret", appsecret);
		urlParams += pointer.getSignature(getParams);
		getUrl += urlParams;
		pointer.httpPost(getUrl, postParams, function(responseJson) {
			if(typeof onSuccess == "function")
				onSuccess(responseJson);
		}, function(errorJson) {
			if(typeof onFailure == "function") {
				if(errorJson == null) {
					onFailure(pointer.errorMessage(errorJson));
					ApiConfig.staticShowToast(httpUtils.errorMessage('null'));
				} else {
					onFailure(pointer.errorMessage(errorJson.error_code));
					ApiConfig.staticShowToast(httpUtils.errorMessage(errorJson.error_code));
					if(errorJson.error_code == '10002') {
						pointer.openIndex();
					}
				}
			}
		});
	});
}

/**房梁2个小精灵 还了一个 吕鹏飞一个
 * postUrl为post请求的参数
 * 需要encodeURIComponent
 * getUrl为get请求参数
 * @param {Object} getUrl
 * @param {Object} PostUrl
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
HttpUtils.prototype.httpPost = function(getUrl, postParams, onSuccess, onFailure) {
	//	var w = null;
	var responseJson = null;
	//	w = plus.nativeUI.showWaiting();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch(xhr.readyState) {
			case 4:
				//				w.close();
				//				w = null;
				if(xhr.status == 200) {
					responseJson = eval("(" + xhr.responseText + ")");
					if(responseJson.rt == 0) {
						if(typeof onFailure == "function") {
							ApiConfig.staticIsDebug('errorJson', responseJson, 1);
							onFailure(responseJson);
						}
					} else {
						if(typeof onSuccess == "function") {
							ApiConfig.staticIsDebug('responseJson', responseJson, 1);
							onSuccess(responseJson);
						}
					}
				} else {
					if(typeof onFailure == "function") {
						ApiConfig.staticIsDebug('errorJson', responseJson, 1);
						onFailure(responseJson);
					}
				}
				break;
			default:
				break;
		}
	}
	xhr.open('POST', getUrl);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var data = this.getPostParams(postParams);
	xhr.send(data);
	ApiConfig.staticIsDebug('httpPost', getUrl);
	ApiConfig.staticIsDebug('httpPostData', data);
}