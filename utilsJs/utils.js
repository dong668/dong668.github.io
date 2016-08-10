
///**
// * Get请求
// * @param {Object} sUrl
// */
//function fGets(sUrl, payWay, states, callback) {
//	//	var w = null;
//	//	var responseJson = null;
//	//	if (w) {
//	//		return;
//	//	}
//	//	w = plus.nativeUI.showWaiting();
//	//	var xhr = new XMLHttpRequest();
//	//	xhr.onreadystatechange = function() {
//	//		switch (xhr.readyState) {
//	//			case 4:
//	//				w.close();
//	//				w = null;
//	//				if (xhr.status == 200) {
//	//					responseJson = eval("(" + xhr.responseText + ")");
//	//					if (responseJson.rt == 0) {
//	//						console.log("----- response data error -----" + xhr.responseText);
//	//					} else {
//	//						console.log("----- response data -----" + xhr.responseText);
//	//						var ordersNew = new Array();
//	//						var orders = responseJson.orders;
//	//						if (states && payWay) {
//	//							for (int i = 0, len = orders.length; i < len; i++) {
//	//								if (orders[i].paymethod == payWay && orders[i].status == states) {
//	//									ordersNew.push(orders[i]);
//	//								}
//	//							}
//	//
//	//						} else {
//	//							if (payWay) {
//	//								for (int i = 0, len = orders.length; i < len; i++) {
//	//									if (orders[i].paymethod == payWay) {
//	//										ordersNew.push(orders[i]);
//	//									}
//	//								}
//	//							} else if (states) {
//	//								for (int i = 0, len = orders.length; i < len; i++) {
//	//									if (orders[i].status == states) {
//	//										ordersNew.push(orders[i]);
//	//									}
//	//								}
//	//							} else {
//	//								for (int i = 0, len = orders.length; i < len; i++) {
//	//									ordersNew.push(orders[i]);
//	//								}
//	//							}
//	//						}
//	//						if (typeof callback == "function") {
//	//							callback(ordersNew);
//	//						}
//	//
//	//					}
//	//				} else {
//	//					plus.nativeUI.alert("服务器繁忙,请稍后再试!", null, "测试");
//	//				}
//	//				break;
//	//			default:
//	//				break;
//	//		}
//	//	}
//	//	xhr.open('GET', sUrl);
//	//	xhr.send();
//	//	console.log(sUrl);
//}
/* 
 * Map对象，实现Map功能 
 * size() 获取Map元素个数 
 * isEmpty() 判断Map是否为空 
 * clear() 删除Map所有元素 
 * put(key, value) 向Map中增加元素（key, value)  
 * remove(key) 删除指定key的元素，成功返回true，失败返回false 
 * get(key) 获取指定key的元素值value，失败返回null 
 * element(index) 获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null 
 * containsKey(key) 判断Map中是否含有指定key的元素 
 * containsValue(value) 判断Map中是否含有指定value的元素 
 * keys() 获取Map中所有key的数组（array） 
 * values() 获取Map中所有value的数组（array） 
 * 
 */

function Map() {
	this.elements = new Array();

	//获取Map元素个数 
	this.size = function() {
			return this.elements.length;
		},

		//判断Map是否为空 
		this.isEmpty = function() {
			return (this.elements.length < 1);
		},

		//删除Map所有元素 
		this.clear = function() {
			this.elements = new Array();
		},

		//向Map中增加元素（key, value)  
		this.put = function(_key, _value) {
			if (this.containsKey(_key) == true) {
				if (this.containsValue(_value)) {
					if (this.remove(_key) == true) {
						this.elements.push({
							key: _key,
							value: _value
						});
					}
				} else {
					this.elements.push({
						key: _key,
						value: _value
					});
				}
			} else {
				this.elements.push({
					key: _key,
					value: _value
				});
			}
		},

		//删除指定key的元素，成功返回true，失败返回false 
		this.remove = function(_key) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						this.elements.splice(i, 1);
						return true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},
		//获取指定key的元素值value，失败返回null 
		this.get = function(_key) {
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						return this.elements[i].value;
					}
				}
			} catch (e) {
				return null;
			}
		},

		//获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null 
		this.element = function(_index) {
			if (_index < 0 || _index >= this.elements.length) {
				return null;
			}
			return this.elements[_index];
		},

		//判断Map中是否含有指定key的元素 
		this.containsKey = function(_key) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		//判断Map中是否含有指定value的元素 
		this.containsValue = function(_value) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].value == _value) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		//获取Map中所有key的数组（array） 
		this.keys = function() {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].key);
			}
			return arr;
		},

		//获取Map中所有value的数组（array） 
		this.values = function() {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].value);
			}
			return arr;
		};
}

var Utils = function() {

}

/**
 * 获取地理位置方法
 */
Utils.prototype.getGeoCode = function() {
	outSet("获取定位位置信息:");
	plus.geolocation.getCurrentPosition(this.getAdressInfo(), function(e) {
		outSet("获取定位位置信息失败：" + e.message);
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
	console.log(JSON.stringify(position));
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
		var day = newTime.getDay();
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

		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt((c1 & 0x3) << 4);
				string += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
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
	 * 将access_token等东西存储
	 * @param {Object} appid
	 * @param {Object} appsecret
	 * @param {Object} access_token
	 * @param {Object} access_token_old
	 * @param {Object} expires_in
	 */
Utils.prototype.saveInfo = function(appid, appsecret, access_token, access_token_old, expires_in) {
	var date = new Date();
	var httpUtils = new HttpUtils(date);
	var expires = httpUtils.phptimeInt();
	plus.storage.setItem("appid", appid);
	plus.storage.setItem("appsecret", appsecret);
	plus.storage.setItem("access_token", access_token);
	plus.storage.setItem("expires_in", expires_in + expires + "");
	plus.storage.setItem("access_token_old", access_token);
}

/**
 * 
 * @param {Object} username
 * @param {Object} passwords
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function judgePlatform(username, passwords, onSuccess, onFailure) {
	var Url = 'http://dev.mimixiche.cn/adapi/users/login';
	var getParams = new Map();
	var utils = new Utils();
	var date = new Date();
	var httpUtils = new HttpUtils(date);
	var post = new httpPostAndCheckAccessToken({
		host: "http://dev.mimixiche.cn"
	});
	switch (plus.os.name) {
		case "Android":
			getParams.put('unique_id', utils.getDeviceId());
			getParams.put('ver', ApiConfig.VER);
			getParams.put('timestamp', httpUtils.phptime());

			Url += httpUtils.getUrl(getParams);
			getParams.remove('ver');
			Url += httpUtils.getSignature(getParams)

			var postParams = new Map();
			postParams.put('username', username);
			postParams.put('password', passwords);
			postParams.put('device[unique_id]', utils.getDeviceId());
			postParams.put('device[device_type]', 'Android');

			post.httpPost(Url, postParams, function(responseJson) {
				console.log("----- response data -----" + JSON.stringify(responseJson));
				utils.saveInfo(responseJson.appid, responseJson.appsecret, responseJson.access_token, responseJson.access_token, responseJson.expires_in);
				if (typeof onSuccess == "function") {
					onSuccess(responseJson);
				}
			}, function(errorJson) {
				if (typeof onFailure == "function") {
					onFailure(errorJson);
				}
				console.log("----- response data -----" + JSON.stringify(errorJson));
			});
			//			console.log("Android");
			//			console.log("ver: " + plus.os.version);
			//			console.log("IMEI: " + plus.device.imei);
			//			console.log("IMSI: " + plus.device.imsi);
			//			console.log("Device: " + plus.device.model);
			//			console.log("Vendor: " + plus.device.vendor);
			//			console.log("uuid: " + plus.device.uuid);
			break;
		case "iOS":
			getParams.put('unique_id', plus.device.uuid);
			getParams.put('ver', ApiConfig.VER);
			getParams.put('timestamp', httpUtils.phptime());

			Url += httpUtils.getUrl(getParams);
			getParams.remove('ver');
			Url += httpUtils.getSignature(getParams)

			var postParams = new Map();
			postParams.put('username', username);
			postParams.put('password', passwords);
			postParams.put('device[unique_id]', plus.device.uuid);
			postParams.put('device[device_type]', 'iOS');

			post.httpPost(Url, postParams, function(responseJson) {
				console.log("----- response data -----" + JSON.stringify(responseJson));
				utils.saveInfo(responseJson.appid, responseJson.appsecret, responseJson.access_token, responseJson.access_token, responseJson.expires_in);
				if (typeof onSuccess == "function") {
					onSuccess(responseJson);
				}
			}, function(errorJson) {
				if (typeof onFailure == "function") {
					onFailure(errorJson);
				}
				console.log("----- response data -----" + JSON.stringify(errorJson));
			});
			break;
		default:
			// 其它平台
			break;
	}
}