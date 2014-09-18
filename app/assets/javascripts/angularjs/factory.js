app.factory("currentUser" , [function(){
    var current_user = false;
    return function(args){
        if (typeof args === "object") { // setter function
            current_user = args;
            return current_user;
        } else { // getter fnc
            if (current_user || current_user === null) { // if this user exists
                return current_user;
            } else {
                // execute some finding function
            }
        }
    }
}]);