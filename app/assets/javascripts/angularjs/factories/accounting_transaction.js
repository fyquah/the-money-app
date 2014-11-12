app.factory("AccountingTransaction" , ["$http", "$q", "page", "alerts", "unkownErrorMessage", function($http, $q, page, alerts, unkownErrorMessage){
    var AccountingTransaction = function(args){
        args = args || {};
        var self = this,
            _debit_records_attributes = [], 
            _credit_records_attributes = [],
            _records_has_been_modified = true,
            _amount;
        // demonstrating the power of JS private variables combo closure!
        self.constructor.attributes().forEach(function(attr){
            if (attr === "debit_records") {
                _debit_records_attributes = args[attr] || [];
            } else if (attr === "credit_records") {
                _credit_records_attributes = args[attr] || [];
            } else if(attr === "amount") {
                _records_has_been_modified = false;
                _amount = args[attr];
            } else {
                self[attr] = args[attr];
            }
        });

        this.amount = function(){
            var reduce_fnc = function(memo, record, index){
                var x = record._destroy ? 0 : (record.amount || 0);
                return memo + Number(x);
            };

            return function(){
                if (!_records_has_been_modified) {
                    return _amount;
                } else {
                    var d = _debit_records_attributes.reduce(reduce_fnc, 0),
                        c = _credit_records_attributes.reduce(reduce_fnc, 0);
                    console.log("d id " + d + " while c is " + c);
                    _records_has_been_modified = false;
                    _amount = (d === c ? d : "NOT BALANCED");
                    return _amount;
                }
            };
        }();

        this.debitRecords = function() {
            var return_arr = [], i;
            for (i =0 ; i < _debit_records_attributes.length ; i++) {
                return_arr.push(_debit_records_attributes[i]);
            }
            return return_arr;
        };

        this.creditRecords = function() {
            var return_arr = [], i;
            for (i =0 ; i < _credit_records_attributes.length ; i++) {
                return_arr.push(_credit_records_attributes[i]);
            }
            return return_arr;
        };

        this.addDebitRecord = function(args){
            _debit_records_attributes.push(args);
            _records_has_been_modified = true;
            return args;
        };

        this.addCreditRecord = function(args){
            _credit_records_attributes.push(args);
            _records_has_been_modified = true;
            return args;
        };

        this.removeDebitRecord = function(index){
            _debit_records_attributes[index]._destroy = true;
            _records_has_been_modified = true;
        };

        this.removeCreditRecord = function(index){
            _credit_records_attributes[index]._destroy = true;
            _records_has_been_modified = true;
        };

        this.data = function(){
            var data = {
                accounting_transaction: {}
            }, self = this;
            self.constructor.attributes().forEach(function(attr){
                if(attr == "debit_records") {
                    data.accounting_transaction.debit_records_attributes = _debit_records_attributes;
                } else if (attr === "credit_records") {
                    data.accounting_transaction.credit_records_attributes = _credit_records_attributes;
                } else if (attr == "amount") {
                    // do nothing
                } else {
                    data.accounting_transaction[attr] = self[attr];
                }
            });
            return data;
        };
    };

    AccountingTransaction.attributes = function(){
        return ["description", "id", "account_book_id", "author_id", "debit_records", "credit_records", "date", "amount"];
    };

    AccountingTransaction.find = function(id){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/accounting_transactions/" + id + ".json"
        }).success(function(data){
            deferred.resolve(new AccountingTransaction(data.accounting_transaction));
        }).error(function(data, status){
            if (status === 404) {
                deferred.reject({ error: "Account Book not found!"});
            } else {
                deferred.reject(unkownErrorMessage);
            }
        });
        return deferred.promise;
    };

    AccountingTransaction.prototype.create = function(){
        var deferred = $q.defer(), self = this;
        $http({
            method: "POST",
            url: "/accounting_transactions.json",
            data: this.data()
        }).success(function(data){
            self.id = data.accounting_transaction.id;
            deferred.resolve(data.accounting_transaction);
        }).error(function(data, status){
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
        });
        return deferred.promise;
    };

    AccountingTransaction.prototype.remove = function(){
        if (!this.id) {
            return;
        }
        var deferred = $q.defer();
        $http({
            method: "DELETE",
            url: "/accounting_transactions/" + this.id + ".json"
        }).success(function(){
            deferred.resolve();
        }).error(function(data, status){
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
        });
        return deferred.promise;
    };

    AccountingTransaction.prototype.update = function(){
        var deferred = $q.defer(), self = this;
        $http({
            method: "PATCH",
            url: "/accounting_transactions/" + self.id + ".json",
            data: self.data()
        }).success(function(data){
            deferred.resolve();
        }).error(function(data, status){
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
        });
        return deferred.promise;
    };
    
    return AccountingTransaction;
}]);