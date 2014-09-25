app.factory("User" , function(){
    var User = function(args){
        this.name = args.name;
        this.email = args.email;
    };
    // declare some class functions here
    return User;
});