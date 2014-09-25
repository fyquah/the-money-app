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

app.factory("AccountingTransaction" , function(){
    var AccountingTransaction = function(args){

    };

    return AccountingTransaction;
});