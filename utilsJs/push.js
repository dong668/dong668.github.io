var Push = function() {
	this.httpUtils = new HttpUtils();
	this.utilsJs = new Utils();
	this.dpHttp = new DpHttp(this.utilsJs, this.httpUtils);
	this.constantValues = new ConstantString();
}

/**
 * 推送的监听
 */
Push.prototype.pushListener = function() {
	var pointer = this;
	plus.push.addEventListener("click", function(msg) {
		switch(msg.payload) {
			case "LocalMSG":
				ApiConfig.staticToast("点击本地创建消息启动：");
				ApiConfig.staticIsDebug(null, "点击本地创建消息启动：");
				break;
			default:
				ApiConfig.staticToast("点击离线推送消息启动：");
				ApiConfig.staticIsDebug(null, "点击离线推送消息启动：");
				break;
		}
		if(msg.payload) {
			ApiConfig.staticIsDebug("click", msg, 1);
			pointer.handle(msg);
		}

	}, false);
	plus.push.addEventListener("receive", function(msg) {
		if(msg.aps) { // Apple APNS message
			ApiConfig.staticToast("接收到在线APNS消息：");
			ApiConfig.staticIsDebug(null, "接收到在线APNS消息：");
		} else {
			ApiConfig.staticToast("接收到在线透传消息：");
			ApiConfig.staticIsDebug(null, "接收到在线透传消息：");
		}
		ApiConfig.staticToast(msg, 1);
		if(msg.payload) {
			pointer.notificationMessage(msg);
		}
	}, false);
}

/**
 * 显示推送日志消息
 * @param {Object} msg
 */
Push.prototype.logOutPushMsg = function(msg) {
	ApiConfig.staticToast("title: " + msg.title);
	ApiConfig.staticToast("content: " + msg.content);
	ApiConfig.staticIsDebug("title", msg.title);
	ApiConfig.staticIsDebug("content", msg.content);
	if(msg.payload) {
		if(typeof(msg.payload) == "string") {
			ApiConfig.staticToast("payload(String): " + msg.payload);
			ApiConfig.staticIsDebug("payload(String)", msg.payload);
		} else {
			ApiConfig.staticToast("payload(JSON): " + JSON.stringify(msg.payload));
			ApiConfig.staticIsDebug("payload(JSON)", msg.payload, 1);
		}
	} else {
		ApiConfig.staticToast("payload: undefined");
		ApiConfig.staticIsDebug("payload", 'undefined');
	}
	if(msg.aps) {
		ApiConfig.staticToast("aps: " + JSON.stringify(msg.aps));
		ApiConfig.staticIsDebug("aps", msg.aps, 1);
	}
	this.notificationMessage(msg);
}

/**
 * @param {Object} msg
 */
Push.prototype.notificationMessage = function(msg) {
	ApiConfig.staticIsDebug("notificationMessage", msg, 1);
	var content = '';
	var pointer = this;
	var jsonData = '';
	switch(plus.os.name) {
		case "Android":
			jsonData = eval("(" + msg.payload + ")");
			break;
		case "iOS":
			jsonData = msg.payload;
			break;
	}
	switch(jsonData.e) {
		case 'admin_order_status':
			content = "订单号：" + jsonData.params.barcode + "状态改成" + this.constantValues.orderStatusString(jsonData.params.status);
			break;
		case 'admin_order_pay':
			content = "订单号：" + jsonData.params.barcode + '支付完成';
			break;
		case 'admin_edit_driver':
			content = '你有一条最新的订单信息';
			break;
	}
	pointer.createLocalPushMsg(msg, content);
}

/**
 * 根据透传信息创建一条本地推送消息
 * @param {Object} msg
 * @param {Object} content
 * main页面	2中情况 
 *			1.订单状态改变 刷新页面    
 *			2.订单完成创建本地推送消息点击跳到订单详情界面
 * orderDetail页面 
 *			1.相同的order_id加载成订单改变的界面
 *			2.不相同的order_id通知一下
 * 			3.支付成功相同的order_id跳到成功页面
 * 			4.支付成功不相同order_id通知一下
 * updateProduct页面
 * 			1.所有的都只通知一下
 * 
 */
Push.prototype.createLocalPushMsg = function(msg, content) {
	ApiConfig.staticIsDebug("createLocalPushMsg", msg, 1);
	var pointer = this;
	var options = {
		cover: false
	};
	var jsonData = '';
	switch(plus.os.name) {
		case "Android":
			jsonData = eval("(" + msg.payload + ")");
			break;
		case "iOS":
			jsonData = msg.payload;
			break;
	}
	var str = content ? content : "";
	var orderList = plus.webview.getWebviewById('orderList');
	switch(plus.webview.getTopWebview().id) {
		case 'main':
			ApiConfig.staticIsDebug("webView", 'main');
			if(jsonData.e == 'admin_order_status') {
				mui.fire(orderList, 'PushRefresh');
			} else if(jsonData.e == 'admin_order_pay') {
				mui.fire(orderList, 'PushRefresh');
			} else if(jsonData.e == 'admin_edit_driver') {
				mui.fire(orderList, 'PushRefresh');
			}
			pointer.createMessage(str, jsonData, options);
			break;
		case 'orderList':
			ApiConfig.staticIsDebug("webView", 'orderList');
			if(jsonData.e == 'admin_order_status') {
				mui.fire(orderList, 'PushRefresh');
			} else if(jsonData.e == 'admin_order_pay') {
				mui.fire(orderList, 'PushRefresh');
			} else if(jsonData.e == 'admin_edit_driver') {
				mui.fire(orderList, 'PushRefresh');
			}
			pointer.createMessage(str, jsonData, options);
			break;
		case 'orderDetail':
			mui.fire(orderList, 'PushRefresh');
			var orderDetail = plus.webview.getTopWebview().order;
			var shwoView = new ShowView(orderDetail, this.utilsJs, this.constantValues, this.dpHttp);
			ApiConfig.staticIsDebug("webView", 'orderDetail');
			ApiConfig.staticIsDebug("orderDetail._id", orderDetail._id);
			ApiConfig.staticIsDebug("jsonData.eid", jsonData.eid);
			if(jsonData.e == 'admin_order_status') {
				if(jsonData.eid == orderDetail._id) {
					shwoView.refreshOrderInfo();
				} else {
					ApiConfig.staticIsDebug("createMessagejsonData", jsonData, 1);
					pointer.createMessage(str, jsonData, options);
				}
			} else if(jsonData.e == 'admin_order_pay') {
				if(jsonData.eid == orderDetail._id) {
					plus.webview.getTopWebview().close();
					//shwoView.refreshOrderInfo();
					pointer.openPaySuccess(orderDetail);
				} else {
					pointer.createMessage(str, jsonData, options);
				}
			}
			break;
		case 'orderDetailhear':
			mui.fire(orderList, 'PushRefresh');
			var orderDetail = plus.webview.getTopWebview().order;
			var shwoView = new ShowView(orderDetail, this.utilsJs, this.constantValues, this.dpHttp);
			ApiConfig.staticIsDebug("webView", 'orderDetail');
			ApiConfig.staticIsDebug("orderDetail._id", orderDetail._id);
			ApiConfig.staticIsDebug("jsonData.eid", jsonData.eid);
			if(jsonData.e == 'admin_order_status') {
				if(jsonData.eid == orderDetail._id) {
					shwoView.refreshOrderInfo();
				} else {
					ApiConfig.staticIsDebug("createMessagejsonData", jsonData, 1);
					pointer.createMessage(str, jsonData, options);
				}
			} else if(jsonData.e == 'admin_order_pay') {
				if(jsonData.eid == orderDetail._id) {
					plus.webview.getTopWebview().close();
					pointer.openPaySuccess(orderDetail);
				} else {
					pointer.createMessage(str, jsonData, options);
				}
			}
			break;
		case 'updateProduct':
			mui.fire(orderList, 'PushRefresh');
			ApiConfig.staticIsDebug("webView", 'updateProduct');
			pointer.createMessage(str, jsonData, options);
			break;
	}
}

Push.prototype.createMessage = function(str, jsonData, options) {
	switch(plus.os.name) {
		case "Android":
			jsonData = jsonData;
			break;
		case "iOS":
			jsonData = jsonData.eid;
			break;
	}
	plus.push.createMessage(str, jsonData, options);
}

Push.prototype.openPaySuccess = function(orderDetail) {
	mui.openWindow({
		url: 'paySuccess.html',
		id: 'paySuccess',
		popGesture: 'close',
		extras: {
			order: orderDetail
		},
		createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
		},
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '正在加载...', //等待对话框上显示的提示内容
		}
	});
}

/**
 * 处理通知方法
 * @param {Object} msg
 */
Push.prototype.handle = function(msg) {
	ApiConfig.staticIsDebug("msg", msg, 1);
	var order_id = '';
	var jsonData = '';
	switch(plus.os.name) {
		case "Android":
			jsonData = eval("(" + msg.payload + ")");
			order_id = jsonData.eid;
			break;
		case "iOS":
			jsonData = msg.payload;
			order_id = jsonData;
			break;
	}
	ApiConfig.staticIsDebug("jsonData", jsonData, 1);
	ApiConfig.staticIsDebug("order_id", order_id);
	this.dpHttp.orderDetail(order_id, function(responseJson) {
		ApiConfig.staticIsDebug("barcode", responseJson.order.barcode);
		mui.openWindow({
			url: 'pushOrderDetail.html',
			id: 'pushOrderDetail',
			popGesture: 'close',
			extras: {
				order: responseJson.order
			},
			createNew: true, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '正在加载...', //等待对话框上显示的提示内容
			}
		});
	}, function(errorJson) {

	});
}