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
        AccountBook.attributes().forEach(function(attr){
            self[attr] = args[attr];
        });
        self.accounting_transactions = self.accounting_transactions || [];
        if (self.date) {
            self.date = new Date(self.date);
        }
        // for (i = 0; i < args.accounting_transactions.length ; i++) {
        //     this.accounting_transactions[i] = new AccountingTransaction(args.accounting_transactions[i]);
        // }
    };

    AccountBook.attributes = function(){
        return ["id", "name", "user_id", "accounting_transactions"];
    }

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

    AccountBook.prototype.removeTransaction = function(index){
        var removed_transaction = this.accounting_transactions[index];
        var deferred = $q.defer();
        if(!confirm("Are you sure you want to delete transaction described by " + removed_transaction.description + " which occured on the " + removed_transaction.date )){
            return;
        }
        this.accounting_transactions.splice(index, 1);
        
        $http({
            method: "DELETE",
            url: "/accounting_transactions/" + removed_transaction.id + ".json"
        }).success(function(data){
            deferred.resolve();
        }).error(function(){
            deferred.reject({ "error": "An unkown error has occured!" })
        })

        return deferred.promise;
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
            deferred.resolve();
            console.log(data.accounting_transaction);
            self.accounting_transactions.push(data.accounting_transaction);          
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

    return AccountBook;
}]);

app.factory("AccountingTransaction" , ["$http", "$q", "page", "alerts", function($http, $q, page, alerts){
    var AccountingTransaction = function(args){
        args = args || {};
        var self = this;
        ["description", "id", "account_book_id", "author_id", "debit_records", "credit_records", "date"].forEach(function(attr){
            this[attr] = args[attr];
        });
    };

    AccountingTransaction.attributes = function(){
        return ["description", "id", "account_book_id", "author_id", "debit_records", "credit_records", "date"];
    }

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
        return deferred;
    };

    AccountingTransaction.prototype.create = function(args){
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/accounting_transaction.json",
            data: args
        }).success(function(data){
            deferred.resolve(data.accounting_transaction);
        }).error(function(){
            deferred.reject(function(){
                page.redirect("/error");
            })
        });
        return deferred;
    };

    AccountingTransaction.prototype.updateAttribute = function(attr_name, new_val){
        var deferred = $q.defer();
        var data = {
            accounting_transaction: {}
        };
        data.accounting_transaction[attr_name] = new_val;
        $http({
            method: "POST",
            url: "/accounting_transaction/" + this.id + ".json",
            data: data
        }).success(function(data){

        }).error(function(data){

        })
    };

    AccountingTransaction.prototype.update = function(){
        var deffered = $q.defer();
        var data = {
            accounting_transaction: {}
        };
        AccountingTransaction.attributes().forEach(function(attr){
            data.accounting_transaction[attr] = this[attr];
        });
        $http({
            method: "PATCH",
            url: "/accounting_transaction/" + this.id + ".json",
            data: data
        }).success(function(data){
            deffered.resolve(data.accounting_transaction);
        }).error(function(data){
            
        });
    };

    return AccountingTransaction;
}]);