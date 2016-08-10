var ApiConfig = {
	VER: '5',
	HOST: "http://wx.mimixiche.com",
	DEBUG: 1
}

var HttpUtils = function(Date) {
		this.Date = Date;
	}
	/**
	 * * 将map集合的value按字母排序
	 * 并进行sha1的加密
	 * @param {Object} getParamsMap
	 */
HttpUtils.prototype.getSignature = function(getParamsMap) {
		var signature = "";
		var Keys = getParamsMap.keys();
		Keys = Keys.sort();
		for (var i = 0, len = getParamsMap.size(); i < len; i++) {
			signature += getParamsMap.get(Keys[i]);
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
		for (var i = 0, len = getParamsMap.size(); i < len; i++) {
			Url += Keys[i] + "=" + getParamsMap.get(Keys[i]) + "&";
		}
		return Url;
	}
	/**
	 * 返回秒的时间戳 String
	 */
HttpUtils.prototype.phptime = function() {
		var timeInt = this.Date.getTime();
		timeInt = (timeInt - (timeInt % 1000)) / 1000
		return timeInt + "";
	}
	/**
	 * 返回秒的时间戳 number
	 */
HttpUtils.prototype.phptimeInt = function() {
	var timeInt = this.Date.getTime();
	timeInt = (timeInt - (timeInt % 1000)) / 1000
	return timeInt;
}

if (ApiConfig.DEBUG) {
	ApiConfig.HOST = "http://dev.mimixiche.cn";
}

var HttpGetAndCheckAccessToken = function(options) {
	this.host = (options.host ? options.host : "http://wx.mimixiche.com");
	var date = new Date();
	var httpUtils = new HttpUtils(date);
	this.httpUtils = httpUtils;
	//	options.async = (options.async ? true : options.async);
	//	options.async || options.async = true;
	//	onSuccess && onSuccess();
}

//var ghcat = new HttpGetAndCheckAccessToken({
//	host: "http://dev.mimixiche.cn"
//});

/**
 * 
 * @param {Object} onSuccess
 */
HttpGetAndCheckAccessToken.prototype.checkAccessToken = function(onSuccess) {
		var expires_in = plus.storage.getItem('expires_in');
		var expires = this.httpUtils.phptimeInt();
		if (Number(expires_in) > expires) {
			var access_token = plus.storage.getItem('access_token');
			if (typeof onSuccess == "function")
				onSuccess(access_token);
		} else {
			//TODO 重新登录
			console.log("重新登录");
		}
	}
	//HttpGetAndCheckAccessToken.prototype.getAccessToken = function(api, params, onSuccess, onFailure, async) {
	//	async || async = true;
	//	onSuccess && onSuccess();
	//}

/**
 * 封装Get请求并检查AccessToken是否过期
 * 过期提示重新登录
 * 没过期就继续使用
 * @param {Object} api
 * @param {Object} params
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
HttpGetAndCheckAccessToken.prototype.getAccessToken = function(api, params, onSuccess, onFailure) {
		this.checkAccessToken(function(access_token) {
			if (params == null) {
				params = new Map();
			}
			var url = ApiConfig.HOST + api;
			var appid = plus.storage.getItem("appid");
			var appsecret = plus.storage.getItem("appsecret");
			var urlParams = "";
			params.put("appid", appid);
			params.put("ver", ApiConfig.VER);
			params.put("access_token", access_token);
			params.put("timestamp", this.httpUtils.phptime());
			urlParams = this.httpUtils.getUrl(params);
			params.remove("ver");
			params.put("appsecret", appsecret);
			urlParams += this.httpUtils.getSignature(params);
			url += urlParams;
			this.httpGet(url, function(responseJson) {
				if (typeof onSuccess == "function")
					onSuccess(responseJson);
			}, function(error) {
				if (typeof onFailure == "function")
					onSuccess(error);
			});
		});
	}
	/**
	 * httpGet请求
	 * @param {Object} Url
	 * @param {Object} onSuccess
	 * @param {Object} onFailure
	 */
HttpGetAndCheckAccessToken.prototype.httpGet = function(Url, onSuccess, onFailure) {
	var w = null;
	var responseJson = null;
	w = plus.nativeUI.showWaiting();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch (xhr.readyState) {
			case 4:
				w.close();
				w = null;
				if (xhr.status == 200) {
					responseJson = eval("(" + xhr.responseText + ")");
					if (responseJson.rt == 0) {
						if (typeof onFailure == "function")
							onFailure(responseJson);
					} else {
						if (typeof onSuccess == "function")
							onSuccess(responseJson);
					}
				} else {
					if (typeof onFailure == "function")
						onFailure(responseJson);
				}
				break;
			default:
				break;
		}
	}
	xhr.open('GET', Url);
	xhr.send();
	console.log(Url);
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
var httpPostAndCheckAccessToken = function(options) {
	this.host = (options.host ? options.host : "http://wx.mimixiche.com");
	var httpUtils = new HttpUtils();
	this.httpUtils = httpUtils;
}

httpPostAndCheckAccessToken.prototype.checkAccessToken = function(onSuccess) {
	var expires_in = plus.storage.getItem('expires_in');
	var expires = this.httpUtils.phptimeInt();
	if (Number(expires_in) > expires) {
		var access_token = plus.storage.getItem('access_token');
		if (typeof onSuccess == "function")
			onSuccess(access_token);
	} else {
		//TODO 重新登录
		console.log("重新登录");
	}
}
httpPostAndCheckAccessToken.prototype.getAccessToken = function(api, getParams, postParams, onSuccess, onFailure) {

		this.checkAccessToken(function(access_token) {
			if (getParams == null) {
				getParams = new Map();
			}
			if (postParams == null) {
				postParams = new Map();
			}
			var getUrl = ApiConfig.HOST + api;
			var postUrl = "";
			var appid = plus.storage.getItem("appid");
			var appsecret = plus.storage.getItem("appsecret");
			var urlParams = "";
			getParams.put("appid", appid);
			params.put("ver", ApiConfig.VER);
			getParams.put("access_token", access_token);
			getParams.put("timestamp", this.httpUtils.phptime());
			urlParams = this.httpUtils.getUrl(getParams);
			getParams.remove("ver");
			getParams.put("appsecret", appsecret);
			urlParams += this.httpUtils.getSignature(getParams);
			getUrl += urlParams;
			this.httpPost(getUrl, postParams, function(responseJson) {
				if (typeof onSuccess == "function")
					onSuccess(responseJson);
			}, function(error) {
				if (typeof onFailure == "function")
					onFailure(error);
			});
		});
	}
	/**
	 * 将postParamsMap中的post参数进行拼接
	 * @param {Object} postParamsMap
	 */
httpPostAndCheckAccessToken.prototype.getPostParams = function(postParamsMap) {
	var postParams = "";
	var Keys = postParamsMap.keys();
	for (var i = 0, len = postParamsMap.size(); i < len; i++) {
		postParams += Keys[i] + "=" + encodeURIComponent(postParamsMap.get(Keys[i])) + "&";
	}
	return postParams.substring(0, postParams.length - 1);
}

/**
 * postUrl为post请求的参数
 * 需要encodeURIComponent
 * getUrl为get请求参数
 * @param {Object} getUrl
 * @param {Object} PostUrl
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
httpPostAndCheckAccessToken.prototype.httpPost = function(getUrl, postParams, onSuccess, onFailure) {
	var w = null;
	var responseJson = null;
	w = plus.nativeUI.showWaiting();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch (xhr.readyState) {
			case 4:
				w.close();
				w = null;
				if (xhr.status == 200) {
					responseJson = eval("(" + xhr.responseText + ")");
					if (responseJson.rt == 0) {
						if (typeof onFailure == "function") {
							onFailure(responseJson);
						}
					} else {
						if (typeof onSuccess == "function") {
							onSuccess(responseJson);
						}
					}
				} else {
					if (typeof onFailure == "function")
						onFailure(responseJson);
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
	console.log(data);
	console.log(getUrl);
}