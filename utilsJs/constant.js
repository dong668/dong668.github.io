var Constant = {}
var ConstantString = function() {

}

/**
 * 换车配送方式
 * 1	 配送到店	DELIVERY_TYPE_TO_SHOP
 * 2	 快递	    DELIVERY_TYPE_EXPRESS
 * 3 上门服务	DELIVERY_TYPE_VISIT
 */
Constant.deliveryType = {
	DELIVERY_TYPE_TO_SHOP: 1,
	DELIVERY_TYPE_EXPRESS: 2,
	DELIVERY_TYPE_VISIT: 3
}

/**
 * 配送方式
 * 1	 到店服务	COLLECT_TYPE_TO_SHOP
 * 2	 上门服务	   COLLECT_TYPE_VISIT
 */
Constant.collectType = {
	COLLECT_TYPE_TO_SHOP: 1,
	COLLECT_TYPE_VISIT: 2
}

/**
 * 
 * @param {Object} status
 */
ConstantString.prototype.collectTypeSting = function(payMethod) {
	var collectTypeMap = new Map();
	collectTypeMap.put('' + Constant.collectType.COLLECT_TYPE_TO_SHOP, '到店服务');
	collectTypeMap.put('' + Constant.collectType.COLLECT_TYPE_VISIT, '上门服务');
	return collectTypeMap.get(payMethod + '');
}

/**
 * 
 * @param {Object} status
 */
ConstantString.prototype.deliveryTypeSting = function(payMethod) {
	var deliveryTypeMap = new Map();
	deliveryTypeMap.put('' + Constant.deliveryType.DELIVERY_TYPE_TO_SHOP, '配送到店');
	deliveryTypeMap.put('' + Constant.deliveryType.DELIVERY_TYPE_EXPRESS, '快递');
	deliveryTypeMap.put('' + Constant.deliveryType.DELIVERY_TYPE_VISIT, '上门服务');
	return deliveryTypeMap.get(payMethod + '');
}

/**
 * 交易类型
 * 1	    充值				RECHARGE
 * 2	    由管理员充值		RECHARGE_BY_ADMIN
 * 3	    提现				WITHDRAW
 * 4   	现金收入			CASH_INCOME
 * 5	    余额充值			BALANCE_RECHARGE
 * 10	交易				TRADE
 * 11	现金交易			CASH_TRADE
 * 20	商户消费			CONSUME
 * 100	退款				REFUND
 * 101	撤销交易			CANCEL_TRADE
 * 200	结算金额			COMMISION
 * 201	奖励				AWARDS
 */
Constant.tradeType = {
	RECHARGE: 1,
	RECHARGE_BY_ADMIN: 2,
	WITHDRAW: 3,
	CASH_INCOME: 4,
	BALANCE_RECHARGE: 5,
	TRADE: 10,
	CASH_TRADE: 11,
	CONSUME: 20,
	REFUND: 100,
	CANCEL_TRADE: 101,
	COMMISION: 200,
	AWARDS: 201
}

/**
 * 
 * @param {Object} tradeType
 */
ConstantString.prototype.tradeTypeString = function(tradeType) {
	var tradeTypeMap = new Map();
	tradeTypeMap.put('' + Constant.tradeType.RECHARGE, '充值');
	tradeTypeMap.put('' + Constant.tradeType.RECHARGE_BY_ADMIN, '由管理员充值');
	tradeTypeMap.put('' + Constant.tradeType.WITHDRAW, '提现');
	tradeTypeMap.put('' + Constant.tradeType.CASH_INCOME, '现金收入');
	tradeTypeMap.put('' + Constant.tradeType.BALANCE_RECHARGE, '余额充值');
	tradeTypeMap.put('' + Constant.tradeType.TRADE, '交易');
	tradeTypeMap.put('' + Constant.tradeType.CASH_TRADE, '现金交易');
	tradeTypeMap.put('' + Constant.tradeType.CONSUME, '商户消费');
	tradeTypeMap.put('' + Constant.tradeType.REFUND, '退款');
	tradeTypeMap.put('' + Constant.tradeType.CANCEL_TRADE, '撤销交易');
	tradeTypeMap.put('' + Constant.tradeType.COMMISION, '结算金额');
	tradeTypeMap.put('' + Constant.tradeType.AWARDS, '奖励');
	return tradeTypeMap.get(tradeType + '');
}

/**
 * 支付方式
 * 1	  在线支付	PAY_METHOD_ONLINE
 * 2	  刷卡支付	PAY_METHOD_POCKET_MONEY
 * 3	  零钱支付	PAY_METHOD_CREDIT_CARD
 * 10 货到付款	PAY_METHOD_POD
 */
Constant.payMethod = {
	PAY_METHOD_ONLINE: 1,
	PAY_METHOD_POCKET_MONEY: 2,
	PAY_METHOD_CREDIT_CARD: 3,
	PAY_METHOD_POD: 4
}

ConstantString.prototype.payMethodString = function(payMethod) {
	var payMethodMap = new Map();
	payMethodMap.put('' + Constant.payMethod.PAY_METHOD_ONLINE, '在线支付');
	payMethodMap.put('' + Constant.payMethod.PAY_METHOD_POCKET_MONEY, '刷卡支付');
	payMethodMap.put('' + Constant.payMethod.PAY_METHOD_CREDIT_CARD, '零钱支付');
	payMethodMap.put('' + Constant.payMethod.PAY_METHOD_POD, '货到付款');
	return tradeTypeMap.get(payMethod + '');
}

/**
 * 订单状态
 * 1	    已提交	    STATUS_POST
 * 2	    已支付	    STATUS_PAID
 * 3	    待出库	    STATUS_WAIT_STOCK
 * 4	    已出库	    STATUS_STOCKED
 * 5  	配送中	    STATUS_DELIVERING
 * 6	    完成配送	    STATUS_DELIVERED
 * 7	    待结算	    STATUS_CLEAR
 * 10	已退款	    STATUS_REFUND
 * 20	待客服确认	STATUS_WAIT_SERVICE
 * 21	待取车	    STATUS_WAIT_COLLECT
 * 22	已取车	    STATUS_COLLECTED
 * 23	施工中	    STATUS_CONSTRUCTION
 * 24	正在还车	    STATUS_RETURNING
 * 25	已收车	    STATUS_RECEIVED
 * 26	定损	        STATUS_DAMAGE
 * 27	施工完成	    STATUS_CONSTRUCTED
 * 100	已取消	    STATUS_CANCELLED
 * 200	已完成	    STATUS_SUCCESS
 */
Constant.orderStatus = {
	STATUS_POST: 1,
	STATUS_PAID: 2,
	STATUS_WAIT_STOCK: 3,
	STATUS_STOCKED: 4,
	STATUS_DELIVERING: 5,
	STATUS_DELIVERED: 6,
	STATUS_CLEAR: 7,
	STATUS_REFUND: 10,
	STATUS_WAIT_SERVICE: 20,
	STATUS_WAIT_COLLECT: 21,
	STATUS_COLLECTED: 22,
	STATUS_CONSTRUCTION: 23,
	STATUS_RETURNING: 24,
	STATUS_RECEIVED: 25,
	STATUS_DAMAGE: 26,
	STATUS_CONSTRUCTED: 27,
	STATUS_CANCELLED: 100,
	STATUS_SUCCESS: 200
}

ConstantString.prototype.orderStatusString = function(status) {
	var statusdMap = new Map();
	statusdMap.put('' + Constant.orderStatus.STATUS_POST, '已提交');
	statusdMap.put('' + Constant.orderStatus.STATUS_PAID, '已支付');
	statusdMap.put('' + Constant.orderStatus.STATUS_WAIT_STOCK, '待出库');
	statusdMap.put('' + Constant.orderStatus.STATUS_STOCKED, '已出库');
	statusdMap.put('' + Constant.orderStatus.STATUS_DELIVERING, '配送中');
	statusdMap.put('' + Constant.orderStatus.STATUS_DELIVERED, '完成配送');
	statusdMap.put('' + Constant.orderStatus.STATUS_CLEAR, '待结算');
	statusdMap.put('' + Constant.orderStatus.STATUS_REFUND, '已退款');
	statusdMap.put('' + Constant.orderStatus.STATUS_WAIT_SERVICE, '待客服确认');
	statusdMap.put('' + Constant.orderStatus.STATUS_WAIT_COLLECT, '待取车');
	statusdMap.put('' + Constant.orderStatus.STATUS_COLLECTED, '已取车');
	statusdMap.put('' + Constant.orderStatus.STATUS_CONSTRUCTION, '施工中');
	statusdMap.put('' + Constant.orderStatus.STATUS_RETURNING, '还车中');
	statusdMap.put('' + Constant.orderStatus.STATUS_RECEIVED, '已收车');
	statusdMap.put('' + Constant.orderStatus.STATUS_DAMAGE, '定损');
	statusdMap.put('' + Constant.orderStatus.STATUS_CONSTRUCTED, '施工完成');
	statusdMap.put('' + Constant.orderStatus.STATUS_ISSUED, '已出单');
	statusdMap.put('' + Constant.orderStatus.STATUS_CANCELLED, '已取消');
	statusdMap.put('' + Constant.orderStatus.STATUS_SUCCESS, '已完成');
	return statusdMap.get(status + '');

}

/**
 * 商城类别
 * 1 	耗材			CATEGORYSUPPLIES
 * 2	    安装维修		CATEGORYMAINTENANCE		
 * 3		饰品配件		CATEGORYJEWELRYACCESSORIES
 * 4		汽车保险     CATEGORYCARINSURANCE
 * 5		定损理赔		CATEGORYSCLAIM
 */
Constant.productServiceCategory = {
	CATEGORYSUPPLIES: 1,
	CATEGORYMAINTENANCE: 2,
	CATEGORYJEWELRYACCESSORIES: 3,
	CATEGORYCARINSURANCE: 4,
	CATEGORYSCLAIM: 5

}

/**
 * 保养产品类型
 * 1		发动机机油	TYPE_ENGINEOIL
 * 2		火花塞		TYPE_SPARKPLUG
 * 3		机油滤清器	TYPE_OILFILTER
 * 4		空气滤清器	TYPE_AIRCLEANER
 * 5		空调滤清器	TYPE_AIRCONDITIONERFILTER
 * 6		燃油滤清器	TYPE_FUELFILTER
 * 100	其他			TYPE_OTHER
 */
Constant.maintenanceProductsType = {
	TYPE_ENGINEOIL: 1,
	TYPE_SPARKPLUG: 2,
	TYPE_OILFILTER: 3,
	TYPE_AIRCLEANER: 4,
	TYPE_AIRCONDITIONERFILTER: 5,
	TYPE_FUELFILTER: 6,
	TYPE_OTHER: 100

}