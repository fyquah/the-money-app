app.service("session" , [ "User" , "$http" ,function(User , $http){
    var current_user = false,
        self = this;

    this.currentUser = function(args){
        var user_response_obj;
        if (typeof args === "object") { // setter function
            current_user = args;
            return current_user;
        } else { // getter fnc
            if (current_user || current_user === null) { // if this user exists
                return current_user;
            } else {
                try {
                    user_response_obj = angular.fromJson($.ajax({
                        type: "GET",
                        url: "/sessions/current",
                        async: false
                    }).responseText);
                    console.log(user_response_obj);
                    if (angular.isDefined(user_response_obj) && angular.isDefined(user_response_obj.user)) {
                        current_user = new User(user_response_obj.user);
                    } else {
                        current_user = null;
                    }
                } catch (e) {
                    current_user = null;
                }
                return current_user;
            }
        }
    };

    this.signOut = function(){
        $http({
            method: "delete",
            url: "/sessions/destroy"
        }).
        success(function(data , status , config){
            alert("you have been logged out!");
            current_user = null;
            $location.path("/signin");
        }).
        error(function(data , status , config){
            alert("error signing out!");
        });
    };

    this.clearAllButCurrent = function(){
        $http({
            method: "delete",
            url: "/sessions/clear_all_but_current"
        }).
        success(function(data , status , config){
            alert("cleared all sessions but current's!");
        }).
        error(function(data , status , config){
            alert("an error occurred!");
        });
    };

    this.isSignedIn = function(){
        if (current_user === false) {
            return self.currentUser();
        } else {
            return !(current_user === null);
        }   
    }
}]);

app.service("page" , ["$location" , "$window" , "session" , "alerts" , function($location , $window , session , alerts){
    this.redirect = function(name){
        $location.path(name);
    };

    this.redirectUnlessSignedIn = function(redirected_page){
        if (!session.currentUser()) {
            $location.path(redirected_page || "/signin");
            alerts.removeAll();
            alerts.push({ type: "info" , msg: "You need to be signed in to view this page!"});
            return true;   
        }
        return false;
    };

    this.redirectIfSignedIn = function(redirected_page){
        if (session.currentUser()) {
            $location.path(redirected_page || "/home");
            alerts.removeAll();
            alerts.push({ type: "info" , msg: "You are alredy logged in!"});
            return true;
        }
        return false;
    }
}]);

app.service("alerts" , function(){
    var self = this;
    this.all = [];

    this.push = function(obj , msg){
        if(typeof obj === "object") {
            self.all.push(obj);    
        } else {
            self.all.push({ type: obj , msg: msg});
        }
        
    }

    this.remove = function(index){
        self.all.splice(index , 1);
    }

    this.removeAll = function(){
        while (self.all.length) {
            self.all.pop();
        }
    }
});