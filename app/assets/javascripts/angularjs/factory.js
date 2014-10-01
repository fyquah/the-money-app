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

app.factory("AccountingTransaction" , function($http){
    var AccountingTransaction = function(args){
        args = args || {};
    };

    AccountingTransaction.prototype.remove = function(){
        var save_promise;
        if(!this.id && this.id !== 0) {
            save_promise = $http({
                method: "DELETE",
                url: "/account_books/" + this.id + ".json",
            });
        } else {
            return null;
        }
        return save_promise;
    }

    return AccountingTransaction;
});