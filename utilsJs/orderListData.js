var orderListData = function() {}

orderListData.prototype.showOrderListData = function(orderData, orderTotal, isfinished) {
	var order = document.createElement('dl');
	var status_barcode = document.createElement('dt');
	var trade_sum = document.createElement('dd');
	var service_category = document.createElement('dd');
	var collect_license = document.createElement('dd');
	var collect_type = document.createElement('dd');
	var delivery_type = document.createElement('dd');
	var collect_consignee = document.createElement('dd');
	var delivery_consignee = document.createElement('dd');
	var collect_mobile = document.createElement('dd');
	var delivery_mobile = document.createElement('dd');
	var collect_time = document.createElement('dd');
	var delivery_time = document.createElement('dd');
	var collect_region = document.createElement('dd');
	var delivery_region = document.createElement('dd');

	order.className = 'orderStatusCon mt15';
	status_barcode.innerHTML = '<span class="left">' + constantValues.orderStatusString(orderData.status) + '</span><b class="right mt3">订单编号：' + orderData.barcode + '</b>';
	status_barcode.className = '';
	collect_license.innerHTML = '车牌号：' + orderData.collect_license.string;

	trade_sum.innerText = '订单金额：¥' + orderData.trade_sum;
	service_category.innerText = '订单类型：' + orderData.main_product_category.name;
	collect_type.innerText = orderData.collect_type ? '接车方式：' + constantValues.collectTypeSting(orderData.collect_type) : '接车方式：未知';
	delivery_type.innerText = orderData.delivery_type ? '还车方式：' + constantValues.deliveryTypeSting(orderData.delivery_type) : '还车方式：未知';

	if(orderData.collect_address) {
		collect_consignee.innerText = '接车联系人：' + orderData.collect_address.consignee;
	} else {
		collect_consignee.innerText = '接车联系人：未知';
	}

	if(orderData.delivery) {
		delivery_consignee.innerText = '还车联系人：' + orderData.delivery.consignee;
	} else {
		delivery_consignee.innerText = '还车联系人：未知';
	}

	if(orderData.collect_address) {
		collect_mobile.innerHTML = '接车联系电话：<span>' + orderData.collect_address.mobile + '</span>';
		collect_mobile.addEventListener('tap', function(event) {
			event.stopPropagation();
			plus.device.dial(orderTotal[$(this.parentNode).index()].collect_address.mobile + "", false);
		}, false);
	} else {
		collect_mobile.innerText = '接车联系人：未知';
	}
	if(orderData.delivery) {
		delivery_mobile.innerHTML = '还车联系电话：<span>' + orderData.delivery.mobile + '</span>';
		delivery_mobile.addEventListener('tap', function(event) {
			event.stopPropagation();
			plus.device.dial(orderTotal[$(this.parentNode).index()].delivery.mobile + "", false);
		}, false);
	} else {
		delivery_mobile.innerText = '还车联系人：未知';
	}

	if(orderData.collect_time) {
		var collect_service_time = orderData.collect_time;
		if(orderData.collect_noon) {
			var collectnoon = '';
			if(orderData.collect_noon == 1) {
				collectnoon = '上午';
			} else {
				collectnoon = '下午';
			}
			collect_time.innerHTML = '接车时间：' + utils.formatDay(collect_service_time.sec * 1000) + collectnoon;
		} else {
			collect_time.innerHTML = '接车时间：' + utils.formatDay(collect_service_time.sec * 1000) + orderData.service_time_section.section_name;
		}
	} else {
		collect_time.innerHTML = '接车时间：未知';
	}
	if(orderData.delivery) {
		var delivery_service_time = orderData.delivery;
		if(delivery_service_time.time) {
			delivery_time.innerHTML = '还车时间：' + utils.formatDay(delivery_service_time.time.sec * 1000) + delivery_service_time.service_time_section.section_name;
		} else {
			delivery_time.innerHTML = '还车时间：未知';
		}

	} else {
		delivery_time.innerHTML = '还车时间：未知';
	}

	var collect_address = orderData.collect_address;
	if(collect_address) {
		var collect_address = orderData.collect_address.region;
		collect_region.innerHTML = '接车地址：' + collect_address.province + collect_address.city + collect_address.district + collect_address.address;
	} else {
		collect_region.innerHTML = '接车地址：未知';
	}
	var delivery_address = orderData.delivery;
	if(delivery_address) {
		var delivery_address = orderData.delivery.region;
		delivery_region.innerHTML = '还车地址：' + delivery_address.province + delivery_address.city + delivery_address.district + delivery_address.address;
	} else {
		delivery_region.innerHTML = '还车地址：未知';
	}

	order.appendChild(status_barcode);
	order.appendChild(trade_sum);
	order.appendChild(service_category);
	order.appendChild(collect_license);

	order.appendChild(collect_type);
	order.appendChild(collect_consignee);
	order.appendChild(collect_mobile);
	order.appendChild(collect_time);
	order.appendChild(collect_region);

	order.appendChild(delivery_type);
	order.appendChild(delivery_consignee);
	order.appendChild(delivery_mobile);
	order.appendChild(delivery_time);
	order.appendChild(delivery_region);

	if(isfinished) {
		order.addEventListener('tap', function() {
			var orderMap = utils.orderSortByStatus(orderTotal);
			mui.openWindow({
				url: 'orderDetail.html',
				id: 'orderDetail',
				//				url: 'orderDetailhear.html',
				//				id: 'orderDetailhear',
				popGesture: 'close',
				extras: {
					order: orderTotal[$(this).index() + orderMap.get('unfinishedOrder').length]
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
		}, false);
	} else {
		order.addEventListener('tap', function() {
			mui.openWindow({
				url: 'orderDetail.html',
				id: 'orderDetail',
				//				url: 'orderDetailhear.html',
				//				id: 'orderDetailhear',
				popGesture: 'close',
				extras: {
					order: orderTotal[$(this).index()]
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
		}, false);
	}
	return order;
}

orderListData.prototype.showAndHie = function(utils, orderTotal) {
	var orderSortMap = utils.orderSortByStatus(orderTotal);
	var unfinishedSort = orderSortMap.get('unfinishedOrder');
	var finishedSort = orderSortMap.get('finishedOrder');
	if(orderTotal.length == 0) {
		$("#noorder").show();

		$("#nocurrentfont").hide();
		$("#nocurrentimg").hide();

		$("#nohistoryfont").hide();
		$("#nohistoryimg").hide();
	} else if(unfinishedSort.length > 0 && unfinishedSort.length == 0) {
		$("#noorder").hide();

		$("#nocurrentfont").show();
		$("#nocurrentimg").hide();

		$("#nohistoryfont").show();
		$("#nohistoryimg").show();
	} else if(finishedSort.length > 0 && unfinishedSort.length == 0) {
		$("#noorder").hide();

		$("#nocurrentfont").show();
		$("#nocurrentimg").show();

		$("#nohistoryfont").show();
		$("#nohistoryimg").hide();
	} else {
		$("#noorder").hide();

		$("#nocurrentfont").show();
		$("#nocurrentimg").hide();

		$("#nohistoryfont").show();
		$("#nohistoryimg").hide();
	}
}