var SqlDate = function() {
	this.DB;
}

SqlDate.prototype.CreateDataBase = function(name, version) {
	version = version || '0.0'
	DB = openDatabase(name, version, 'mimixiche', 10 * 1024 * 1024);
	return DB;
}
SqlDate.prototype.CreateTable = function(name) {
	ExeSql('CREATE TABLE IF NOT EXISTS ' + name + ' (id text primary key , e text, order_id text,barcode text, content text,pushtime text,status text ,isread integer)');
}

SqlDate.prototype.ExeSql = function(sql, arg, callback) {
	if(!DB) {
		return;
	}
	if(!arg) {
		arg = [];
	}
	if(!callback) {
		callback = function() {
			ApiConfig.staticToast("null");
		}
	}

	var err_cb = function(tx, err) {
		ApiConfig.staticIsDebug('Error', err.message);
		ApiConfig.staticToast("Error:" + err.message);
	}

	var succ_cb = function(tx, results) {
		ApiConfig.staticToast("执行成功");
		callback(tx, results)
	}

	DB.transaction(function(tx) {
		tx.executeSql(sql, arg, succ_cb, err_cb);
		ApiConfig.staticIsDebug('executeSql', sql);
	})
}

SqlDate.prototype.addMessage = function(jsondata) {
	CreateDataBase('mimixiche');
	CreateTable('message');
	var id = hex_sha1(jsondata);
	var sql = 'INSERT INTO message (id ,e, order_id,barcode,pushtime,status,isread) VALUES (' + id + ', ' + jsondata.e + ',' + jsondata.eid + ',' + jsondata.params.barcode + ',"北京","北京",1)';
	this.ExeSql(adfa, [], function(tx, results) {
		ApiConfig.staticIsDebug('ExeSql');
		var len = results.rows.length,
			i;
		ApiConfig.staticIsDebug('results len is', len);
		for(i = 0; i < len; i++) {
			var item = results.rows.item(i);
			ApiConfig.staticIsDebug('results', item.id);
		}
	});
}