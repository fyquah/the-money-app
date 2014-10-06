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

app.factory("AccountBook", ["$http", "$q", "AccountingTransaction", function($http, $q, AccountingTransaction){

    var AccountBook = function(args){
        var i, self = this;
        AccountBook.attributes().forEach(function(attr){
            self[attr] = args[attr];
        });
        self.accounting_transactions = self.accounting_transactions || [];

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
            
            deffered.resolve(new AccountBook(data.account_book));
        }).error(function(data){
            deferred.reject(function(){
                page.redirect("/404");
            })
        });
        return deferred.promise;
    };

    AccountBook.prototype.removeTransaction = function(index){
        var removed_transaction = this.accounting_transactions.splice(index, 1)[0];
        var deffered = $q.defer();
        $http({
            method: "DELETE",
            url: "/accounting_transactions/" + removed_transaction.id + ".json"
        }).success(function(data){
            deffered.resolve();
        }).error(function(){
            deffered.reject({ "error": "An unkown error has occured!" })
        })

        return deffered.promise;
    };
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