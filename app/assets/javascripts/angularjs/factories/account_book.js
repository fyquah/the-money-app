app.factory("AccountBook", ["$http", "$q", "AccountingTransaction", "alerts", "unkownErrorMessage", function($http, $q, AccountingTransaction, alerts, unkownErrorMessage){

    var AccountBook = function(args){
        var i, self = this;
        args = args || {};
        self.constructor.attributes().forEach(function(attr){
            if (attr === "created_at" || attr === "updated_at") {
                self[attr] = new Date(args[attr])
            } else {
                self[attr] = args[attr];
            }
        });
        self.accounting_transactions = self.accounting_transactions || [];
        if (self.date) {
            self.date = new Date(self.date);
        }

        for (i = 0; i < self.accounting_transactions.length ; i++) {
            this.accounting_transactions[i] = new AccountingTransaction(self.accounting_transactions[i]);
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
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    };

    AccountBook.attributes = function(){
        return ["id", "name", "user_id", "accounting_transactions", "created_at", 'updated_at'];
    };

    AccountBook.find = function(id, with_transaction){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/account_books/" + id + ".json" + (with_transaction ? "?transaction=true" : "") 
        }).success(function(data){
            
            deferred.resolve(new AccountBook(data.account_book));
        }).error(function(data, status){
            if (status === 404) {
                deferred.reject({ error: "Account Book cannot be found!"});
            } else {
                deferred.reject(unkownErrorMessage);
            }
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
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
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
            deferred.reject(unkownErrorMessage);
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
            self.accounting_transactions.push(new AccountingTransaction(data.accounting_transaction));
            self.accounting_transactions.sort(function(a,b){
                if (a.date == b.date) {
                    return (new Date(a.created_at) > new Date(b.created_at)) ? 1 : -1;
                } else {
                    return a.date > b.date ? 1 : -1;
                }
            });
            deferred.resolve(data.accounting_transaction);
        }).
        error(function(data, status){
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
        });
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
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
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

    AccountBook.prototype.records = function(acc_name, month, year){
        var accounts = {},
            deferred = $q.defer(),
            query_string_array = [];

        if (typeof acc_name === "string") {
            query_string_array.push("account=" + unescape(acc_name));
        }
        if (typeof month === 'string') {
            query_string_array.push("month=" + unescape(month));
        }
        if (typeof year === "string") {
            query_string_array.push("year=" + unescape(year));
        }

        $http({
            method: "GET",
            url: "/account_books/" + this.id + "/records.json" + (query_string_array.length === 0 ? "" : "?" + query_string_array.join("&"))
        }).success(function(data){
            accounts = data.account_book_records
            var sum_fnc = function(memo, record, index){
                return memo + (record.amount || 0);
            };
            for(var acc_name in accounts){
                var d = accounts[acc_name].debit_records.reduce(sum_fnc, 0);
                var c = accounts[acc_name].credit_records.reduce(sum_fnc, 0);
                var balance_obj = {
                    accounting_transaction: {
                        data: null,
                        description: "BALANCE"
                    },
                    amount: Math.abs(d-c)
                };
                accounts[acc_name].account_name = acc_name;
                accounts[acc_name].debit_total = d;
                accounts[acc_name].credit_total  = c;
                if ( d > c) {
                    accounts[acc_name].credit_records.push(balance_obj);
                } else if ( c > d ) {
                    accounts[acc_name].debit_records.push(balance_obj);
                }
                accounts[acc_name].total = d > c ? d : c;
            }
            deferred.resolve(accounts);
        }).error(function(data, status){
            deferred.reject(unkownErrorMessage);
        });

        return deferred.promise;
    };

    AccountBook.prototype.balanceSheet = function(){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/account_books/" + this.id + "/balance_sheet.json"
        }).success(function(data){
            var balance_sheet = data.balance_sheet;
            ["asset", "equity", "liability"].forEach(function(type){
                balance_sheet[type + "_total"] = 0;
                console.log(balance_sheet);
                angular.forEach(balance_sheet[type], function(value, _){
                    balance_sheet[type + "_total"] += Number(value);
                })
            });
            deferred.resolve(balance_sheet);
        }).error(function(){
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    };

    return AccountBook;
}]);