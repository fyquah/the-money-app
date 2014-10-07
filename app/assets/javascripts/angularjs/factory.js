app.factory("User" , function(){
    var User = function(args){
        args = args || {};
        this.name = args.name;
        this.id = args.id;
        this.email = args.email;
    };
    // declare some class functions here
    return User;
});

app.factory("AccountBook", ["$http", "$q", "AccountingTransaction", "alerts", function($http, $q, AccountingTransaction, alerts){

    var AccountBook = function(args){
        var i, self = this;
        args = args || {};
        AccountBook.attributes().forEach(function(attr){
            self[attr] = args[attr];
        });
        self.accounting_transactions = self.accounting_transactions || [];
        if (self.date) {
            self.date = new Date(self.date);
        }

        for (i = 0; i < self.accounting_transactions.length ; i++) {
            // console.log(this.accounting_transactions[i]);
            this.accounting_transactions[i] = new AccountingTransaction(self.accounting_transactions[i]);
            // console.log(this.accounting_transactions[i]);
        }
    };

    AccountBook.all = function(){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/account_books.json"
        }).
        success(function(data){
            var account_books = data.account_books.reduce(function(memo, book){
                memo.push(new AccountBook(book));
                return memo;
            }, []);
            deferred.resolve(account_books);
        }).
        error(function(data , status){
            deferred.reject();
        });
        return deferred.promise;
    };

    AccountBook.attributes = function(){
        return ["id", "name", "user_id", "accounting_transactions"];
    };

    AccountBook.find = function(id){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/account_books/" + id + ".json"
        }).success(function(data){
            
            deferred.resolve(new AccountBook(data.account_book));
        }).error(function(data){
            deferred.reject(function(){
                page.redirect("/404");
            })
        });
        return deferred.promise;
    };

    AccountBook.prototype.create = function(){
        var deferred = $q.defer();
        var self = this;
        var data = (function(){
            return AccountBook.attributes().reduce(function(memo, attr){
                memo[attr] = self[attr];
                return memo;
            }, {})
        })();
        data = {
            account_book: data
        };
        console.log(data);
        $http({
            method: "POST",
            url: "/account_books.json",
            data: data
        }).
        success(function(data){
            self.id = data.account_book.id;
            self.user_id = data.account_book.user_id
            deferred.resolve(self);
        }).
        error(function(data, status){
            console.log(data);
            deferred.reject();
        });
        return deferred.promise;
    };

    AccountBook.prototype.remove = function(){
        var deferred = $q.defer(), self = this;
        $http({
            method: "DELETE",
            url: "/account_books/" + self.id + ".json"
        }).
        success(function(data){
            deferred.resolve();
        }).
        error(function(data){
            deferred.reject();
        });
        return deferred.promise;
    }

    AccountBook.prototype.removeTransaction = function(id){
        var index, i, removed_transaction = null, self = this;
        for(i = 0; i < this.accounting_transactions.length; i++) {
            if(this.accounting_transactions[i].id === id) {
                index = i;
                removed_transaction = this.accounting_transactions[i];
                break;
            }
        }

        if(removed_transaction == null){
            return;
        }

        return removed_transaction.remove().then(function(){
            self.accounting_transactions.splice(index, 1);
        }, function(){
            alert("An unkown error has occured");
        })
    };

    AccountBook.prototype.addNewTransaction = function(args){
        console.log(args);
        var data = {
            accounting_transaction: args
        }, deferred = $q.defer(), self = this;
        console.log(data);
        $http({
            method: "POST",
            url: "/account_books/" + this.id + "/create_accounting_transaction.json",
            data: data,
        }).
        success(function(data, status){
            var lo, hi, mid;
            deferred.resolve();
            self.accounting_transactions.push(new AccountingTransaction(data.accounting_transaction));          
        }).
        error(function(data, status){
            deferred.reject();
            alerts.push("danger", "error adding new transaction!");
        })
        return deferred.promise;
    }

    AccountBook.prototype.updateAttribute = function(attr, new_val){
        var deferred = $q.defer();
        var ori_val = this[attr];
        var data = {
            account_book: {}
        };
        this[attr] = new_val;
        data.account_book[attr] = new_val;

        $http({
            method: "PATCH",
            url: "/account_books/" + this.id + ".json",
            data: data
        }).success(function(data, status){
            deferred.resolve();
        }).error(function(data, status){
            alerts.push("danger", data.error);
            this[attr] = ori_val;
            deferred.reject(ori_val);
        });
        return deferred.promise;
    };

    AccountBook.prototype.addNewExpenditure = function(args){
        return this.addNewTransaction({
            description: args.description,
            date: args.date,
            credit_records_attributes: [{
                account_name: "cash",
                account_type: "asset",
                amount: args.amount
            }],
            debit_records_attributes: [{
                account_name: args.account_name,
                account_type: "equity",
                amount: args.amount
            }]
        });
    };

    AccountBook.prototype.addNewIncome = function(args){
        console.log(args);
        return this.addNewTransaction({
            description: args.description,
            date: args.date,
            debit_records_attributes: [{
                account_name: "cash",
                account_type: "asset",
                amount: args.amount
            }],
            credit_records_attributes: [{
                account_name: args.account_name,
                account_type: "equity",
                amount: args.amount
            }]
        });

    };

    AccountBook.prototype.records = function(acc_name){
        var accounts = {},
            deferred = $q.defer();
        console.log("/account_books/" + this.id + "/records.json" + (typeof acc_name === "string" ? ("?account=" + unescape(acc_name)) : ""));
        $http({
            method: "GET",
            url: "/account_books/" + this.id + "/records.json" + (typeof acc_name === "string" ? ("?account=" + unescape(acc_name)) : "")
        }).success(function(data){
            accounts = data.account_book_records
            var sum_fnc = function(memo, record, index){
                return memo + (record.amount || 0);
            };
            for(var acc_name in accounts){
                accounts[acc_name].debit_total = accounts[acc_name].debit_records.reduce(sum_fnc, 0);
                accounts[acc_name].credit_total = accounts[acc_name].credit_records.reduce(sum_fnc, 0);
            }
            deferred.resolve(accounts);
        }).error(function(data){
            deferred.reject();
        });

        return deferred.promise;
    }

    return AccountBook;
}]);

app.factory("AccountingTransaction" , ["$http", "$q", "page", "alerts", function($http, $q, page, alerts){
    var AccountingTransaction = function(args){
        args = args || {};
        var self = this,
            _debit_records_attributes = [], 
            _credit_records_attributes = [],
            _records_has_been_modified = true,
            _amount;
        // demonstrating the power of JS private variables combo closure!
        AccountingTransaction.attributes().forEach(function(attr){
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
                if (_debit_records_attributes[i]._destroy != true) {
                    return_arr.push(_debit_records_attributes[i]);
                }
            }
            return return_arr;
        };

        this.creditRecords = function() {
            var return_arr = [], i;
            for (i =0 ; i < _credit_records_attributes.length ; i++) {
                if (_credit_records_attributes[i]._destroy != true) {
                    return_arr.push(_credit_records_attributes[i]);
                }
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
            var data = {}, self = this;
            self.constructor.attributes().forEach(function(attr){
                if(attr == "debit_records") {
                    data.debit_records_attributes = _debit_records_attributes;
                } else if (attr === "credit_records") {
                    data.credit_records_attributes = _credit_records_attributes;
                } else if (attr == "amount") {
                    // do nothing
                } else {
                    data[attr] = self[attr];
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
        }).error(function(data){
            deferred.reject(function(){
                page.redirect("/404");
            })
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
        }).error(function(){
            deferred.reject(function(){
                page.redirect("/error");
            })
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
        }).error(function(){
            deferred.reject();
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
            deferred.reject();
        });
        return deferred.promise;
    };

    // AccountingTransaction.prototype.updateAttribute = function(attr_name, new_val){
    //     var deferred = $q.defer();
    //     var data = {
    //         accounting_transaction: {}
    //     };
    //     data.accounting_transaction[attr_name] = new_val;
    //     $http({
    //         method: "POST",
    //         url: "/accounting_transaction/" + this.id + ".json",
    //         data: data
    //     }).success(function(data){

    //     }).error(function(data){

    //     })
    // };

    // AccountingTransaction.prototype.update = function(){
    //     var deffered = $q.defer();
    //     var data = {
    //         accounting_transaction: {}
    //     };
    //     AccountingTransaction.attributes().forEach(function(attr){
    //         data.accounting_transaction[attr] = this[attr];
    //     });
    //     $http({
    //         method: "PATCH",
    //         url: "/accounting_transaction/" + this.id + ".json",
    //         data: data
    //     }).success(function(data){
    //         deffered.resolve(data.accounting_transaction);
    //     }).error(function(data){
            
    //     });
    // };

    return AccountingTransaction;
}]);