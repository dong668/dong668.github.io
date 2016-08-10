var ShowView = function(orderDetail, utilsJs, constantValues, dpHttp) {
	this.orderDetail = orderDetail;
	this.utilsJs = utilsJs;
	this.constantValues = constantValues;
	this.dpHttp = dpHttp;
	this.httpUtils = new HttpUtils();
}

/**
 * 订单信息
 */
ShowView.prototype.order_basic = function() {
	var order_basic = document.createElement('dl');
	var order_info = document.createElement('dt');
	var order_barcode = document.createElement('dd');
	var order_created = document.createElement('dd');
	var order_trade_sum = document.createElement('dd');
	var order_assessment_loss_sum = document.createElement('dd');
	var order_commision_sum = document.createElement('dd');
	var order_orig_trade_sum = document.createElement('dd');
	var order_status = document.createElement('dd');
	order_basic.className = 'bpDetailsCon mt15 borderBot_e2e2e2 OrderDetail';
	order_barcode.className = "mt30";
	order_status.className = "borderNone";
	order_status.id = 'borderNone';

	order_info.innerText = '订单信息';
	order_barcode.innerText = '订单编号：' + this.orderDetail.barcode;
	order_created.innerText = '下单时间：' + this.utilsJs.formatDate(this.orderDetail.created * 1000);
	if(this.orderDetail.user_privilege) {
		order_trade_sum.innerHTML = '订单金额：<span>¥' + this.orderDetail.trade_sum + '（刮蹭宝VIP用户）</span>';
	} else {
		order_trade_sum.innerHTML = '订单金额：<span>¥' + this.orderDetail.trade_sum + '</span>';
	}
	order_assessment_loss_sum.innerHTML = this.orderDetail.assessment_loss_sum ? '定损金额：¥' + this.orderDetail.assessment_loss_sum : '定损金额：¥未知';
	order_commision_sum.innerHTML = this.orderDetail.commision_sum ? '佣金：¥' + this.orderDetail.commision_sum : '佣金：¥未知';
	order_status.innerHTML = '订单状态：<span>' + this.constantValues.orderStatusString(this.orderDetail.status) + '</span>';

	order_basic.appendChild(order_info);
	order_basic.appendChild(order_barcode);
	order_basic.appendChild(order_created);
	order_basic.appendChild(order_trade_sum);
	if(this.orderDetail.service_category == Constant.productServiceCategory.CATEGORYSCLAIM) {
		order_basic.appendChild(order_assessment_loss_sum);
		order_basic.appendChild(order_commision_sum);
	}
	order_basic.appendChild(order_status);

	return order_basic;
}

/**
 * 显示结算金额
 * @param {Object} order_basic
 * @param {Object} order_orig_trade_sum
 */
ShowView.prototype.orig_trade_sum = function(order_basic, order_orig_trade_sum) {
	var SystemSettings = this.dpHttp.getSystemSettings();
	//是否是保养订单
	if(this.orderDetail.main_product_category._id == SystemSettings[1]) {
		if(this.orderDetail.status == Constant.orderStatus.STATUS_RETURNING) {

		} else {
			order_orig_trade_sum.innerHTML = '结算金额：<span>¥' + this.orderDetail.orig_trade_sum + '</span>';
			order_basic.appendChild(order_orig_trade_sum);
		}
	} else {
		if(this.delivery_type == Constant.deliveryType.DELIVERY_TYPE_VISIT) {

		} else {
			order_orig_trade_sum.innerHTML = '结算金额：<span>¥' + this.orderDetail.orig_trade_sum + '</span>';
			order_basic.appendChild(order_orig_trade_sum);
		}
	}
}

/**
 * 接送信息
 */
ShowView.prototype.collect_basic = function() {
	var pointer = this;
	var collect_basic = document.createElement('dl');
	var collect_info = document.createElement('dt');
	var auto_model = document.createElement('dd');
	var collect_license = document.createElement('dd');
	var collect_type = document.createElement('dd');
	var delivery_type = document.createElement('dd');
	var collect_address = document.createElement('dd');
	var delivery_address = document.createElement('dd');
	var delivery_consignee = document.createElement('dd');
	var collect_consignee = document.createElement('dd');
	var collect_mobile = document.createElement('dd');
	var delivery_mobile = document.createElement('dd');
	var collect_time = document.createElement('dd');
	var delivery_time = document.createElement('dd');
	var collect_license_change = document.createElement('i');
	var collect_licensecollect_license = document.createElement('input');

	collect_licensecollect_license.type = 'button';
	collect_licensecollect_license.className = 'right';
	collect_licensecollect_license.value = 'VIP卡查询';

	collect_basic.className = 'bpDetailsCon mt10 borderBot_e2e2e2 OrderDetail';
	collect_license_change.className = 'icoEditor right';

	collect_license.className = 'mt30';

	collect_info.innerHTML = '接送车信息';

	collect_info.appendChild(collect_licensecollect_license);
	//	collect_license_change.style.position = 'relative';
	var license_number = this.orderDetail.collect_license.string ? this.orderDetail.collect_license.string : '无';
	collect_licensecollect_license.addEventListener('tap', function() {
		layerOpen({
			"title": "查询用户特权",
			"content": '<input id="key_id" type="text" value=' + license_number + ' placeholder="请输入车牌号" style ="margin-left: 0.14rem;outline: none;font-size: 0.16rem;-webkit-user-select: text"/>',
			"btn": ["取消", "查询"],
			"shadeClose": true,
			"event": [null, function() {
				var key_id = document.getElementById('key_id');
				if(key_id.value.length > 0) {
					var re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
					if(key_id.value.search(re) == -1) {
						ApiConfig.staticShowLongToast('输入的车牌号格式不对');
					} else {
						pointer.dpHttp.userPrivileges(key_id.value, function(responseJson) {
							if(responseJson.user_privileges) {
								var user_privileges = responseJson.user_privileges;
								console.log(user_privileges.effective_from.sec);
								console.log(pointer.httpUtils.phptimeInt());
								if(user_privileges.effective_from.sec > pointer.httpUtils.phptimeInt()) {
									ApiConfig.staticShowLongToast('刮蹭宝还未生效----生效时间：' + utilsJs.formatDay(user_privileges.effective_from.sec * 1000));
								} else {
									if(pointer.httpUtils.phptimeInt() > user_privileges.expires.sec) {
										ApiConfig.staticShowLongToast('刮蹭宝已过期----过期时间' + utilsJs.formatDay(user_privileges.expires.sec * 1000));
									} else {
										ApiConfig.staticShowLongToast('可以正常使用刮蹭宝截止时间' + utilsJs.formatDay(user_privileges.expires.sec * 1000));
									}
								}
							} else {
								ApiConfig.staticShowLongToast('该车牌号未绑定刮蹭宝');
							}
						}, function(errorJson) {

						});
					}
				} else {
					ApiConfig.staticShowLongToast('请输入车牌号');
				}
			}]
		});
	});

	collect_license_change.addEventListener('tap', function() {
		layerOpen({
			"title": "修改车牌号",
			"content": '<input id="collectlicense_number" type="text" value=' + license_number + ' placeholder="请输入车牌号" style ="margin-left: 0.14rem;outline: none;font-size: 0.16rem;-webkit-user-select: text"/>',
			"btn": ["取消", "确定"],
			"shadeClose": true,
			"event": [null, function() {
				var collectlicense_number = document.getElementById('collectlicense_number');
				if(collectlicense_number.value.length > 0) {
					var re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
					if(collectlicense_number.value.search(re) == -1) {
						ApiConfig.staticShowLongToast('输入的车牌号格式不对');
					} else {
						pointer.dpHttp.changeOrderInfoCollectLicense(pointer.orderDetail._id, collectlicense_number.value, function(responseJson) {
							pointer.orderDetail = responseJson.order;
							$('#bpOrderDetails').html('<div id="div_order" class="orderStatus1" style="margin-top: 0.44rem;"></div>');
							pointer.showOrderInfo();
							pointer.showOrderStauts();
							//刷新list页面
							pointer.winback();
						}, function(errorJson) {

						});
					}
				} else {
					ApiConfig.staticShowLongToast('请输入车牌号');
				}
			}]
		});
	});

	collect_license.innerHTML = this.orderDetail.collect_license.string ? '车牌号：' + this.orderDetail.collect_license.string : '车牌号：未填';

	switch(this.orderDetail.status) {
		case Constant.orderStatus.STATUS_WAIT_SERVICE:
			collect_license.appendChild(collect_license_change);
			break;
		case Constant.orderStatus.STATUS_WAIT_COLLECT:
			collect_license.appendChild(collect_license_change);
			break;
		case Constant.orderStatus.STATUS_COLLECTED:
			collect_license.appendChild(collect_license_change);
			break;
		case Constant.orderStatus.STATUS_CONSTRUCTION:
			collect_license.appendChild(collect_license_change);
			break;
	}

	collect_type.innerHTML = this.orderDetail.collect_type ? '接车方式：' + this.constantValues.collectTypeSting(this.orderDetail.collect_type) : '接车方式：未知';

	var collect = this.orderDetail.collect_address;
	if(collect) {
		var collect = this.orderDetail.collect_address.region;
		collect_address.innerHTML = '接车地址：<i class="right">' + collect.province + collect.city + collect.district + collect.address + '</i>';
	} else {
		collect_address.innerHTML = '接车地址：未知';
	}

	delivery_type.innerHTML = this.orderDetail.delivery_type ? '还车方式：' + this.constantValues.deliveryTypeSting(this.orderDetail.delivery_type) : '还车方式：未知';

	var delivery = this.orderDetail.delivery;
	if(delivery) {
		var delivery = this.orderDetail.delivery.region;
		delivery_address.innerHTML = '还车地址：<i class="right">' + delivery.province + delivery.city + delivery.district + delivery.address + '</i>';
	} else {
		delivery_address.innerHTML = '还车地址：未知';
	}

	if(this.orderDetail.collect_address) {
		collect_consignee.innerHTML = '接车联系人：' + this.orderDetail.collect_address.consignee;
	} else {
		collect_consignee.innerHTML = '接车联系人：未知';
	}

	if(this.orderDetail.delivery) {
		delivery_consignee.innerHTML = '还车联系人：' + this.orderDetail.delivery.consignee;
	} else {
		delivery_consignee.innerHTML = '还车联系人：未知';
	}

	if(this.orderDetail.collect_address) {
		collect_mobile.innerHTML = '接车联系人电话：<span style="color: #06c15a;border-bottom: 1px dotted #06c15a;">' + this.orderDetail.collect_address.mobile + '</span>';
		collect_mobile.addEventListener('tap', function() {
			layerOpen({
				"title": "",
				"content": '确实拨打改电话吗？',
				"btn": ["取消", "确定"],
				"shadeClose": true,
				"event": [null, function() {
					plus.device.dial(pointer.orderDetail.collect_address.mobile + "", false);
				}]
			});
		}, false);
	} else {
		collect_mobile.innerHTML = '接车联系人电话：未知';
	}
	if(this.orderDetail.delivery) {
		delivery_mobile.innerHTML = '还车联系人电话：<span style="color: #06c15a;border-bottom: 1px dotted #06c15a;">' + this.orderDetail.delivery.mobile + '</span>';
		delivery_mobile.addEventListener('tap', function() {
			layerOpen({
				"title": "",
				"content": '确实拨打改电话吗？',
				"btn": ["取消", "确定"],
				"shadeClose": true,
				"event": [null, function() {
					plus.device.dial(pointer.orderDetail.delivery.mobile + "", false);
				}]
			});
		}, false);
	} else {
		delivery_mobile.innerHTML = '还车联系人电话：未知';
	}

	if(this.orderDetail.collect_time) {
		var collect_service_time = pointer.orderDetail.collect_time;
		if(pointer.orderDetail.collect_noon) {
			var collectnoon = '';
			if(pointer.orderDetail.collect_noon == 1) {
				collectnoon = '上午';
			} else {
				collectnoon = '下午';
			}
			collect_time.innerHTML = '接车时间：' + pointer.utilsJs.formatDay(collect_service_time.sec * 1000) + collectnoon;
		} else {
			collect_time.innerHTML = '接车时间：' + pointer.utilsJs.formatDay(collect_service_time.sec * 1000) + pointer.orderDetail.service_time_section.section_name;
		}
	} else {
		collect_time.innerHTML = '接车时间：未知';
	}
	if(pointer.orderDetail.delivery) {
		var delivery_service_time = pointer.orderDetail.delivery;
		if(delivery_service_time.time) {
			delivery_time.innerHTML = '还车时间：' + pointer.utilsJs.formatDay(delivery_service_time.time.sec * 1000) + delivery_service_time.service_time_section.section_name;
		} else {
			delivery_time.innerHTML = '还车时间：未知';
		}

	} else {
		delivery_time.innerHTML = '还车时间：未知';
	}

	collect_basic.appendChild(collect_info);
	collect_basic.appendChild(collect_license);
	if(this.orderDetail.auto_model) {
		auto_model.innerHTML = '车辆详细：' + this.orderDetail.auto_model.brief;
		collect_basic.appendChild(auto_model);
	}
	collect_basic.appendChild(collect_type);

	collect_basic.appendChild(collect_consignee);
	collect_basic.appendChild(collect_mobile);
	collect_basic.appendChild(collect_time);
	collect_basic.appendChild(collect_address);

	collect_basic.appendChild(delivery_type);
	collect_basic.appendChild(delivery_mobile);
	collect_basic.appendChild(delivery_consignee);
	collect_basic.appendChild(delivery_time);
	collect_basic.appendChild(delivery_address);

	return collect_basic;
}

/**
 *商品信息 
 */
ShowView.prototype.products = function() {
	var pointer = this;
	var receiving_car_service = null;
	var SystemSettings = this.dpHttp.getSystemSettings();
	var productItems = this.orderDetail.product_items;
	var products_basic = document.createElement('dl');
	var productsName = document.createElement('dt');
	var productsChange = document.createElement('i');
	var orderSum = document.createElement('dd');

	var sum = 0;

	products_basic.className = 'bpDetailsCon mt10 mb20 borderBot_e2e2e2 OrderDetail';
	productsChange.className = 'icoEditor right';
	productsChange.id = 'productsChange';

	productsName.innerHTML = this.orderDetail.main_product_category.name;
	if(this.orderDetail.main_product_category._id == SystemSettings[1]) {
		pointer.isChenge(productsName, productsChange);
	}

	products_basic.appendChild(productsName);

	for(index in productItems) {
		var products = document.createElement('dd');
		var productItem = productItems[index];
		var product_name = '';
		if(index == 0) {
			products.className = 'mt30';
		}
		if(this.orderDetail.main_product_category._id == SystemSettings[1]) {
			product_name = productItem.product.name;
		} else {
			if(this.orderDetail.service_category == Constant.productServiceCategory.CATEGORYSCLAIM) {
				product_name = productItem.metadata[0].value;
			} else {
				product_name = productItem.product.name + productItem.metadata[0].hash + productItem.metadata[0].value;
			}
		}
		if(productItem.quantity > 1) {
			products.innerHTML = product_name + '<b class="right">' + productItem.quantity + '×' + productItem.price + '     ￥' + productItem.quantity * productItem.price + '</b>';
			sum += productItem.quantity * productItem.price;
		} else {
			products.innerHTML = product_name + '<b class="right">¥' + productItem.price + '</b>';
			sum += productItem.price;
		}
		products_basic.appendChild(products);
	}
	orderSum.innerHTML = '<b class="right">合计：<span>¥' + sum + '</span></b>';
	products_basic.appendChild(orderSum);
	return products_basic;
}

/**
 * 状态为还车中和施工中时
 * 保养订单可以编辑保养项目
 * @param {Object} productsName
 * @param {Object} productsChange
 */
ShowView.prototype.isChenge = function(productsName, productsChange) {
	var pointer = this;
	if(this.orderDetail.status == Constant.orderStatus.STATUS_COLLECTED) {
		productsName.addEventListener('tap', function() {
			//打开编辑保养项目页面
			mui.openWindow({
				url: 'updateProduct.html',
				id: 'updateProduct',
				popGesture: 'close',
				extras: {
					order: pointer.orderDetail
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
		productsName.appendChild(productsChange);
	} else if(this.orderDetail.status == Constant.orderStatus.STATUS_CONSTRUCTION) {
		productsName.addEventListener('tap', function() {
			//打开编辑保养项目页面
			mui.openWindow({
				url: 'updateProduct.html',
				id: 'updateProduct',
				popGesture: 'close',
				extras: {
					order: pointer.orderDetail
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
		productsName.appendChild(productsChange);
	}
}

/**
 * 挂蹭宝信息
 */
ShowView.prototype.infos = function() {
	var products_basic = document.createElement('dl');
	var productsName = document.createElement('dt');
	if(1 == 1) {
		products_basic.appendChild(productsName);
		return products_basic;
	} else {
		return undefined;
	}
}

/**
 * 优惠信息
 */
ShowView.prototype.promotions = function() {
	var pointer = this;
	var promotionInfo = document.createElement('dl');
	var promotionName = document.createElement('dt');
	var promotionContext = document.createElement('dd');
	var promotionChange = document.createElement('i');
	var SystemSettings = this.dpHttp.getSystemSettings();

	promotionInfo.id = 'promotionInfo';
	promotionInfo.className = 'bpDetailsCon mt15 borderBot_e2e2e2 OrderDetail';
	promotionContext.className = 'mt30 borderNone';
	promotionContext.id = 'promotionContext';
	promotionName.innerHTML = '优惠信息';
	promotionChange.id = 'promotionChange';

	if(this.orderDetail.coupon) {
		var coupon = this.orderDetail.coupon;
		var productItems = this.orderDetail.product_items;
		var sum = 0;
		switch(coupon.promotion_type) {
			case 7:
				for(index in productItems) {
					if("receiving_car_service" == productItems[index].product.alias) {
						promotionContext.innerHTML = this.orderDetail.coupon.title;
					}
				}
				break;
			case 9:
				promotionContext.innerHTML = this.orderDetail.coupon.title + '<b class="right">合计：<span>¥' + coupon.value + '</span></b>';
				break;
			case 10:
				for(index in productItems) {
					sum += productItems[index].price;
				}
				promotionContext.innerHTML = this.orderDetail.coupon.title;
				break;
		}
	} else {
		promotionContext.innerText = '无优惠信息';
	}

	promotionChange.className = 'icoEditor right';

	if(this.orderDetail.status != Constant.orderStatus.STATUS_SUCCESS) {
		promotionName.appendChild(promotionChange);
		//修改备注
		promotionName.addEventListener('tap', function() {
			var operate = [];
			if(pointer.orderDetail.coupon) {
				operate = ["取消", "更换"];
			} else {
				operate = ["取消", "保存"];
			}
			layerOpen({
				"title": "添加优惠",
				"content": '<input id="exchange_code" type="text" placeholder="请输入兑换码" style ="margin-left: 0.14rem;outline: none;font-size: 0.16rem;-webkit-user-select: text"/>',
				"btn": operate,
				"shadeClose": true,
				"event": [null, function() {
					var exchange_code = document.getElementById('exchange_code');
					if(exchange_code.value.length > 0) {
						pointer.dpHttp.promotions(pointer.orderDetail._id, exchange_code.value, function(responseJson) {
							pointer.orderDetail = responseJson.order;
							$('#bpOrderDetails').html('<div id="div_order" class="orderStatus1" style="margin-top: 0.44rem;"></div>');
							pointer.showOrderInfo();
							pointer.showOrderStauts();
							//刷新list页面
							pointer.winback();
						}, function(errorJson) {

						});
					} else {
						ApiConfig.staticShowToast('兑换码不能为空');
					}
				}]
			});
		}, false);
	}

	promotionInfo.appendChild(promotionName);
	promotionInfo.appendChild(promotionContext);

	return promotionInfo;
}

/**
 * 显示订单的备注和修改备注
 * 修改成功后再当前页面显示修改后的备注
 */
ShowView.prototype.orderRemark = function() {
	var pointer = this;
	var remarkInfo = document.createElement('dl');
	var remarkName = document.createElement('dt');
	var remarkContext = document.createElement('dd');
	var remarkChange = document.createElement('i');
	var SystemSettings = this.dpHttp.getSystemSettings();

	remarkInfo.id = 'remarkInfo';
	remarkInfo.className = 'bpDetailsCon mt15 borderBot_e2e2e2 OrderDetail';
	remarkInfo.style.marginBottom = '0.72rem';
	remarkContext.className = 'mt30 borderNone';
	remarkContext.id = 'remarkContext';
	remarkName.innerHTML = '备注信息';
	remarkChange.id = 'remarkChange';

	var remarkValue = this.orderDetail.remark ? this.orderDetail.remark : '无';
	remarkContext.innerText = remarkValue;
	remarkChange.className = 'icoEditor right';

	if(this.orderDetail.status != Constant.orderStatus.STATUS_SUCCESS) {
		remarkName.appendChild(remarkChange);
		//修改备注
		remarkName.addEventListener('tap', function() {
			layerOpen({
				"title": "备注",
				"content": '<textarea id ="remarkContent" rows="3" cols="20" style="box-shadow:0px 0px 0px rgba(0,0,0,0); resize:none;' +
					'-webkit-appearance:none; font-size: 0.16rem; border:none; width: 100%; height: 100%; -webkit-user-select: text; outline: none;">' + remarkValue + '</textarea>',
				"btn": ["取消", "保存"],
				"shadeClose": true,
				"event": [null, function() {
					var remarkContent = document.getElementById('remarkContent');
					pointer.dpHttp.changeOrderInfoRemark(pointer.orderDetail._id, remarkContent.value, function(responseJson) {
						pointer.orderDetail = responseJson.order;
						ApiConfig.staticShowToast('备注编辑成功');
						//成功后在当前页面显示备注
						$('#remarkContext').html(responseJson.order.remark ? responseJson.order.remark : '');
						//刷新list页面
						pointer.winback();
					}, function() {

					});
				}]
			});
		}, false);
	}

	remarkInfo.appendChild(remarkName);
	remarkInfo.appendChild(remarkContext);

	return remarkInfo;
}

/**
 * 显示订单的备注和修改备注
 * 修改成功后再当前页面显示修改后的备注
 */
ShowView.prototype.explainRemark = function() {
	var pointer = this;
	var explainInfo = document.createElement('dl');
	var explainName = document.createElement('dt');
	var explainContext = document.createElement('dd');
	var explainChange = document.createElement('i');

	explainInfo.id = 'explainInfo';
	explainInfo.className = 'bpDetailsCon mt15 borderBot_e2e2e2 OrderDetail';
	explainInfo.style.marginBottom = '0.72rem';
	explainContext.className = 'mt30 borderNone';
	explainContext.id = 'explainContext';
	explainName.innerHTML = '理赔说明';
	explainChange.id = 'explainChange';

	var explainValue = this.orderDetail.explain ? this.orderDetail.explain : '无';
	explainContext.innerText = explainValue;
	explainChange.className = 'icoEditor right';

	if(this.orderDetail.status != Constant.orderStatus.STATUS_SUCCESS) {
		explainName.appendChild(explainChange);
		explainName.addEventListener('tap', function() {
			layerOpen({
				"title": "理赔说明",
				"content": '<textarea id ="explainContent" rows="3" cols="20" style="box-shadow:0px 0px 0px rgba(0,0,0,0); resize:none;' +
					'-webkit-appearance:none; font-size: 0.16rem; border:none; width: 100%; height: 100%; -webkit-user-select: text; outline: none;">' + explainValue + '</textarea>',
				"btn": ["取消", "保存"],
				"shadeClose": true,
				"event": [null, function() {
					var explainContent = document.getElementById('explainContent');
					pointer.dpHttp.changeOrderInfoExplain(pointer.orderDetail._id, explainContent.value, function(responseJson) {
						pointer.orderDetail = responseJson.order;
						ApiConfig.staticIsDebug('explain', "explain");
						ApiConfig.staticShowToast('理赔说明编辑成功');
						//成功后在当前页面显示备注
						$('#explainContext').html(responseJson.order.explain ? responseJson.order.explain : '无');
						//刷新list页面
						pointer.winback();
					}, function() {

					});
				}]
			});
		}, false);
	}

	explainInfo.appendChild(explainName);
	explainInfo.appendChild(explainContext);

	return explainInfo;
}

/**
 * 展示订单信息
 */
ShowView.prototype.showOrderInfo = function() {
	var div_order = $('#div_order');
	if(this.orderDetail.service_category == Constant.productServiceCategory.CATEGORYSCLAIM) {
		div_order.prepend(this.explainRemark());
	} else {
		div_order.prepend(this.orderRemark());
	}

	if(!this.orderDetail.user_privilege) {
		div_order.prepend(this.promotions());
	}
	div_order.prepend(this.products());
	div_order.prepend(this.collect_basic());
	div_order.prepend(this.order_basic());
}

/**
 * 根据订单状态动态显示
 */
ShowView.prototype.showOrderStauts = function() {
	var pointer = this;
	var div_orderStauts = $('#bpOrderDetails');
	if(this.orderDetail.status == Constant.orderStatus.STATUS_SUCCESS) {
		$('#remarkInfo').css('marginBottom', '0.12rem');
		$('#explainInfo').css('marginBottom', '0.12rem');
	} else {
		var changeOrderStatus = null;
		if(this.orderDetail.pay_sum == 0 && this.orderDetail.status == Constant.orderStatus.STATUS_RETURNING) {
			changeOrderStatus = document.createElement('a');
			changeOrderStatus.id = 'changeOrderStatus';
			changeOrderStatus.className = 'changeStatus';
			changeOrderStatus.innerHTML = '<i class="iconEditorWhite left"></i>更改为已完成';
			pointer.changefinded(changeOrderStatus);
		} else {
			if(this.orderDetail.status == Constant.orderStatus.STATUS_RETURNING) {
				changeOrderStatus = document.createElement('div');
				changeOrderStatus.id = 'changeOrderStatus';
				changeOrderStatus.className = 'totalPriceYg';
				changeOrderStatus.innerHTML = '<span>合计：<b>¥' + this.orderDetail.pay_sum + '</b></span><a class="newBpEwm" href="javascript:;">支付</a>';
				pointer.payCode(changeOrderStatus);
			} else {
				changeOrderStatus = document.createElement('a');
				changeOrderStatus.id = 'changeOrderStatus';
				changeOrderStatus.className = 'changeStatus';
				switch(this.orderDetail.status) {
					case Constant.orderStatus.STATUS_WAIT_SERVICE:
						changeOrderStatus.innerHTML = '<i class="iconEditorWhite left"></i>更改为' + pointer.constantValues.orderStatusString(Constant.orderStatus.STATUS_WAIT_COLLECT);
						break;
					case Constant.orderStatus.STATUS_WAIT_COLLECT:
						changeOrderStatus.innerHTML = '<i class="iconEditorWhite left"></i>更改为' + pointer.constantValues.orderStatusString(Constant.orderStatus.STATUS_COLLECTED);
						break;
					case Constant.orderStatus.STATUS_COLLECTED:
						changeOrderStatus.innerHTML = '<i class="iconEditorWhite left"></i>更改为' + pointer.constantValues.orderStatusString(Constant.orderStatus.STATUS_CONSTRUCTION);
						break;
					case Constant.orderStatus.STATUS_CONSTRUCTION:
						changeOrderStatus.innerHTML = '<i class="iconEditorWhite left"></i>更改为' + pointer.constantValues.orderStatusString(Constant.orderStatus.STATUS_CONSTRUCTED);
						break;
					case Constant.orderStatus.STATUS_CONSTRUCTED:
						changeOrderStatus.innerHTML = '<i class="iconEditorWhite left"></i>更改为' + pointer.constantValues.orderStatusString(Constant.orderStatus.STATUS_RETURNING);
						break;
				}
				this.changeStauts(changeOrderStatus);
			}
		}
		div_orderStauts.append(changeOrderStatus);
	}
}

/**
 * 更改订单状态的弹窗
 */
ShowView.prototype.changefinded = function(changeOrderStatus) {
	var pointer = this;
	changeOrderStatus.addEventListener('tap', function() {
		layerOpen({
			"title": "更改状态",
			"content": '确定要将该订单状态改为已完成？',
			"btn": ["取消", "确定"],
			"shadeClose": true,
			"event": [null, function() {
				pointer.dpHttp.Ordersfinded(pointer.orderDetail, function(responseJson) {
					pointer.orderDetail = responseJson.order;
					console.log('Ordersfinded' + JSON.stringify(pointer.orderDetail));
					$('#borderNone').html('订单状态：<span>' + pointer.constantValues.orderStatusString(200) + '</span>');
					ApiConfig.staticShowToast('订单已完成');
					$('#bpOrderDetails').html('<div id="div_order" class="orderStatus1" style="margin-top: 0.44rem;"></div>');
					pointer.showOrderInfo();
					pointer.showOrderStauts();
					pointer.winback();
				}, function(errorJson) {

				});
			}]
		});
	});
}

/**
 * 更改订单状态的弹窗
 */
ShowView.prototype.changeStauts = function(changeOrderStatus) {
	var pointer = this;
	changeOrderStatus.addEventListener('tap', function() {
		layerOpen({
			"title": "更改状态",
			"content": '确定要将该订单状态改为' + pointer.checkOrdersStatus() + '？',
			"btn": ["取消", "确定"],
			"shadeClose": true,
			"event": [null, function() {
				pointer.dpHttp.checkOrdersStatus(pointer.orderDetail, function(responseJson) {
					$('#borderNone').html('订单状态：<span>' + pointer.checkOrdersStatus() + '</span>');
					ApiConfig.staticShowToast('订单状态修改成功');
					pointer.orderDetail = responseJson.order;
					$('#bpOrderDetails').html('<div id="div_order" class="orderStatus1" style="margin-top: 0.44rem;"></div>');
					pointer.showOrderInfo();
					pointer.showOrderStauts();
					pointer.winback();
				}, function(errorJson) {

				});
			}]
		});
	});
}

/**
 * 刷新list页面数据
 */
ShowView.prototype.winback = function() {
	var orderList = plus.webview.getWebviewById('orderList');
	mui.fire(orderList, 'Refresh');
}

/**
 *  支付二维码
 * 显示微信和支付宝支付二维码
 * @param {Object} changeOrderStatus
 */
ShowView.prototype.payCode = function(changeOrderStatus) {
	var str = ApiConfig.WXHOST + '/wx/orders/follow/' + this.orderDetail.barcode;
	var pointer = this;
	changeOrderStatus.addEventListener('tap', function() {
		layerOpen({
			"title": "微信付款二维码",
			"content": "<div id='code' style='margin-top: 0.06rem;' ></div><a class='zfbPayOnline'><u>支付宝在线支付</u></a>",
			"shadeClose": true
		});
		var urlStr = pointer.payCodeToUtf8(str);
		$("#code").qrcode({
			render: "table", //table方式 
			width: 200, //宽度 
			height: 200, //高度 
			text: urlStr //任意内容 
		});
	});

	$(document).on("touchend", '.zfbPayOnline', function() {
		if($(".zfbPayOnline").html() == '<u>支付宝在线支付</u>') {
			pointer.dpHttp.alipayUrl(pointer.orderDetail._id, function(responseJson) {
					$(".layer_title").html('');
					$(".layer_title").html('支付宝付款二维码');
					$("#code").html('');
					$(".zfbPayOnline").html('<u>微信在线支付</u>');

					$("#code").qrcode({
						render: "table", //table方式 
						width: 200, //宽度 
						height: 200, //高度 
						text: pointer.payCodeToUtf8(responseJson.url) //任意内容 
					});
				},
				function() {

				});
		} else {
			$(document).on("touchend", '.zfbPayOnline', function() {

				$(".layer_title").html('');
				$(".layer_title").html('微信付款二维码');
				$("#code").html('');
				$(".zfbPayOnline").html('<u>支付宝在线支付</u>');
				$("#code").qrcode({
					render: "table", //table方式 
					width: 200, //宽度 
					height: 200, //高度 
					text: str //任意内容 
				});
			});
		}
	});

}

/**
 * 转换中文
 * @param {Object} str
 */
ShowView.prototype.payCodeToUtf8 = function(str) {
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
 * 展示订单修改下一个状态
 */
ShowView.prototype.checkOrdersStatus = function() {
	var arrayStatus = new Array();
	//钣喷类别ID
	var sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id') || false;
	//保养类别ID
	var maintenance_category_id = plus.storage.getItem('maintenance_category_id') || false;
	!maintenance_category_id && this.systemSettings();
	sheetmetal_category_id = plus.storage.getItem('sheetmetal_category_id');
	maintenance_category_id = plus.storage.getItem('maintenance_category_id');

	if(this.orderDetail.main_product_category._id == maintenance_category_id) {
		/**
		 * 待客服确认	    STATUS_WAIT_SERVICE
		 * 待取车		STATUS_WAIT_COLLECT
		 * 已取车		STATUS_COLLECTED
		 * 施工中		STATUS_CONSTRUCTION
		 * 施工完成		STATUS_CONSTRUCTED
		 * 正在还车		STATUS_RETURNING
		 */
		switch(this.orderDetail.status) {
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
	} else if(this.orderDetail.main_product_category._id == sheetmetal_category_id) {
		/**
		 * 待客服确认  	STATUS_WAIT_SERVICE
		 * 待取车		STATUS_WAIT_COLLECT
		 * 已取车		STATUS_COLLECTED
		 * 施工中		STATUS_CONSTRUCTION
		 * 施工完成		STATUS_CONSTRUCTED
		 * 正在还车		STATUS_RETURNING
		 */
		switch(this.orderDetail.status) {
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
		switch(this.orderDetail.service_category) {
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
				switch(this.orderDetail.status) {
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
		return this.constantValues.orderStatusString(arrayStatus[0]);
	}
}

/**
 * 刷新交易记录详情页面
 */
ShowView.prototype.refreshOrderInfo = function() {
	var w = null;
	w = plus.nativeUI.showWaiting();
	ApiConfig.staticIsDebug('refreshOrderInfo', 'refreshOrderInfo');
	var pointer = this;
	this.dpHttp.orderDetail(this.orderDetail._id, function(responseJson) {
		w.close();
		w = null;
		pointer.orderDetail = responseJson.order;
		$('#bpOrderDetails').html('<div id="div_order" class="orderStatus1" style="margin-top: 0.44rem;"></div>');
		pointer.showOrderInfo();
		pointer.showOrderStauts();
	}, function(errorJson) {
		w.close();
		w = null;
	});
}

/**
 * 加载其他的订单信息
 * @param {Object} order_id
 */
ShowView.prototype.loadOrderInfo = function(order_id) {
	var w = null;
	w = plus.nativeUI.showWaiting();
	var pointer = this;
	this.dpHttp.orderDetail(order_id, function(responseJson) {
		w.close();
		w = null;
		pointer.orderDetail = responseJson.order;
		$('#bpOrderDetails').html('<div id="div_order" class="orderStatus1" style="margin-top: 0.44rem;"></div>');
		pointer.showOrderInfo();
		pointer.showOrderStauts();
	}, function(errorJson) {
		w.close();
		w = null;
	});
}