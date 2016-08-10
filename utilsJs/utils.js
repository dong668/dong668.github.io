var ApiConfig = {
	VER: '1',
	HOST: "http://api2.mimixiche.com",
	DEBUG: 0,
	WXHOST: 'http://wx.mimixiche.com',
	PAGECOUNT: 30,
	UPLOADLOCATIONTIME: 60,
	ISREPORTPUSHCID: 10
}
if(ApiConfig.DEBUG) {
	ApiConfig.HOST = "http://addev.mimixiche.cn";
	ApiConfig.WXHOST = 'http://devwx.mimixiche.cn';
}

ApiConfig.staticIsDebug = function(falg, info, isJson) {
	if(ApiConfig.DEBUG) {
		if(falg == null) {
			console.log('-----------falg---------' + (isJson ? JSON.stringify(info) : info));
		} else {
			console.log('-----------' + falg + '---------' + (isJson ? JSON.stringify(info) : info));
		}
	}
}

ApiConfig.staticShowToast = function(info, isJson) {
	plus.nativeUI.toast((isJson ? JSON.stringify(info) : info), {
		duration: "short"
	});
}

ApiConfig.staticShowLongToast = function(info, isJson) {
	plus.nativeUI.toast((isJson ? JSON.stringify(info) : info), {
		duration: "long"
	});
}

ApiConfig.staticToast = function(info, isJson) {
	if(ApiConfig.DEBUG) {
		plus.nativeUI.toast((isJson ? JSON.stringify(info) : info), {
			duration: "short"
		});
	}
}

var Utils = function() {}

/**
 * 获取地理位置方法
 * @param {Object} onSuccess
 */
Utils.prototype.getGeoCode = function(onSuccess) {
	plus.geolocation.getCurrentPosition(function(position) {
		if(typeof onSuccess == "function") {
			onSuccess(position);
		}

	}, function(error) {
		ApiConfig.staticToast("获取定位位置信息失败：" + error.message);
	}, {
		coordsType: "bd09ll",
		geocode: true,
		provider: 'baidu'
	});
}

/**
 * 解析地理位置的json数据
 * @param {Object} position
 */
Utils.prototype.getAdressInfo = function(position) {
	var str = "";
	str += "地址：" + position.addresses + "\n"; //获取地址信息
	str += "坐标类型：" + position.coordsType + "\n";
	var timeflag = position.timestamp; //获取到地理位置信息的时间戳；一个毫秒数；
	str += "时间戳：" + timeflag + "\n";
	var codns = position.coords; //获取地理坐标信息；
	var lat = codns.latitude; //获取到当前位置的纬度；
	str += "纬度：" + lat + "\n";
	var longt = codns.longitude; //获取到当前位置的经度
	str += "经度：" + longt + "\n";
	var alt = codns.altitude; //获取到当前位置的海拔信息；
	str += "海拔：" + alt + "\n";
	var accu = codns.accuracy; //地理坐标信息精确度信息；
	str += "精确度：" + accu + "\n";
	var altAcc = codns.altitudeAccuracy; //获取海拔信息的精确度；
	str += "海拔精确度：" + altAcc + "\n";
	var head = codns.heading; //获取设备的移动方向；
	str += "移动方向：" + head + "\n";
	var sped = codns.speed; //获取设备的移动速度；
	str += "移动速度：" + sped;
	ApiConfig.staticIsDebug('getAdressInfo', position, 1);
	ApiConfig.staticToast(position, 1);
}

/**
 * 格式化时间年月日时分秒
 * @param {Object} time
 */
Utils.prototype.formatDate = function(time) {
	var newTime = new Date(time);
	var year = newTime.getFullYear();
	var month = newTime.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var day = newTime.getDate();
	day = day < 10 ? "0" + day : day;
	var hours = newTime.getHours();
	hours = hours < 10 ? "0" + hours : hours;
	var minutes = newTime.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes;
	var seconds = newTime.getSeconds();
	seconds = seconds < 10 ? "0" + seconds : seconds;
	var stime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	return stime;
}

/**
 * 格式化时间年月日
 * @param {Object} time
 */
Utils.prototype.formatDay = function(time) {
	var newTime = new Date(time);
	var year = newTime.getFullYear();
	var month = newTime.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var day = newTime.getDate();
	day = day < 10 ? "0" + day : day;
	var stime = year + "-" + month + "-" + day + " ";
	return stime;
}

/**
 * 获取设备的名称
 */
Utils.prototype.getDeviceName = function() {
	var Build = plus.android.importClass("android.os.Build");
	var build = new Build();
	var deviceName = plus.android.getAttribute(build, "MODEL");
	return deviceName;
}

/**
 * 获取android系统的版本号
 */
Utils.prototype.getOS = function() {
	var Build = plus.android.importClass("android.os.Build");
	var VERSION = Build.VERSION;
	var version = new VERSION();
	var getOS = "Android" + plus.android.getAttribute(version, "RELEASE");
	return getOS;
}

/**
 * 获取androidId
 */
Utils.prototype.getAndroidId = function() {
	Settings = plus.android.importClass("android.provider.Settings");
	var settings = new Settings();
	var Secure = settings.Secure;
	var secure = new Secure();
	var ANDROID_ID = Secure.ANDROID_ID;
	var main = plus.android.runtimeMainActivity();
	var getContentResolver = main.getContentResolver();
	var androidId = plus.android.invoke(secure, "getString", getContentResolver, ANDROID_ID + "");
	return androidId;
}

/**
 * 获取IMEI
 */
Utils.prototype.getIMEIStatus = function() {
	var Context = plus.android.importClass("android.content.Context");
	var ActivityManager = plus.android.importClass("android.app.ActivityManager");
	var activityService = plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);
	var IMEI = plus.android.invoke(activityService, "getDeviceId");
	return IMEI;
}

/**
 * 获取设备的唯一unionid
 */
Utils.prototype.getDeviceId = function() {
	return unionid = hex_sha1(this.getAndroidId() + this.getDeviceName() + this.getIMEIStatus() + this.getOS());
}

/**base64加密
 * 
 * @param {Object} str
 */
Utils.prototype.base64_encode = function(str) {
	var c1, c2, c3;
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var i = 0,
		len = str.length,
		string = '';

	while(i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if(i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt((c1 & 0x3) << 4);
			string += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if(i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			string += base64EncodeChars.charAt((c2 & 0xF) << 2);
			string += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		string += base64EncodeChars.charAt(c1 >> 2);
		string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		string += base64EncodeChars.charAt(c3 & 0x3F)
	}
	return string
}

/**
 * 获取地址信息
 * @param {Object} onSuccess
 */
Utils.prototype.getAddress = function(onSuccess) {
	var pointer = this;
	this.getGeoCode(function(position) {
		if(typeof onSuccess == "function") {
			if(position) {
				if((position.addresses.indexOf('中国') >= 0)) {
					var newaddresses = position.addresses.replace('中国', '');
					onSuccess(newaddresses);
				} else {
					onSuccess(position.addresses);
				}
			}
		}
	});
}

/**
 * 订单数据排序根据状态分为两种
 * 完成的和未完成的
 * @param {Object} orderArray
 */
Utils.prototype.orderSortByStatusAndReturn = function(orderArray) {
	var order = new Array();
	var finishedOrder = new Array();
	var unfinishedOrder = new Array();
	for(index in orderArray) {
		switch(orderArray[index].status) {
			case Constant.orderStatus.STATUS_WAIT_SERVICE:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_WAIT_COLLECT:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_COLLECTED:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTION:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTED:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_RETURNING:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_SUCCESS:
				finishedOrder.push(orderArray[index]);
				break;
		}
	}
	this.orderSortByCreated(unfinishedOrder);
	this.orderSortByCreated(finishedOrder);

	for(index in unfinishedOrder) {
		order.push(unfinishedOrder[index]);
	}
	for(index in finishedOrder) {
		order.push(finishedOrder[index]);
	}
	return order;
}

/**
 * 订单数据排序根据状态分为两种
 * 完成的和未完成的
 * @param {Object} orderArray
 */
Utils.prototype.orderSortByStatus = function(orderArray) {
	var orderMap = new Map();
	var finishedOrder = new Array();
	var unfinishedOrder = new Array();
	for(index in orderArray) {
		switch(orderArray[index].status) {
			case Constant.orderStatus.STATUS_WAIT_SERVICE:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_WAIT_COLLECT:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_COLLECTED:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTION:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_CONSTRUCTED:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_RETURNING:
				unfinishedOrder.push(orderArray[index]);
				break;
			case Constant.orderStatus.STATUS_SUCCESS:
				finishedOrder.push(orderArray[index]);
				break;
		}
	}
	this.orderSortByCreated(unfinishedOrder);
	this.orderSortByCreated(finishedOrder);
	orderMap.put('unfinishedOrder', unfinishedOrder);
	orderMap.put('finishedOrder', finishedOrder);
	return orderMap;
}

/**
 * 订单数据排序根据创建时间
 * @param {Object} orderArray
 */
Utils.prototype.orderSortByCreated = function(orderArray) {
	orderArray.sort(this.sortRule);
}

/**
 * 排序规则
 * @param {Object} a
 * @param {Object} b
 */
Utils.prototype.sortRule = function(a, b) {
	return b.created - a.created;
}