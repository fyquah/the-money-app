app.service("session" , [ "$location" , "User" , "$http" , "alerts", "$q", "$location" ,function($location , User , $http, alerts, $q, $location){
    var current_user = false,
        self = this;

    this.create = function(obj){
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/sessions.json",
            data: {
                user: {
                    email: obj.email,
                    password: obj.password
                }
            }
        }).success(function(data){
            self.currentUser(new User(data.user));
            $location.path("/account-books");
            alerts.push("success" , "Log in successful! Welcome to the money app");
            deferred.resolve();
        }).error(function(){
            alerts.push("danger", "Invalid credentials!");
            deferred.reject();
        });

        return deferred.promise;
    };

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
                        url: "/sessions/current.json",
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
            url: "/sessions/destroy.json"
        }).
        success(function(data , status , config){
            alerts.push("info" , "You have been logged out!");
            current_user = null;
            $location.path("/signin");
        }).
        error(function(data , status , config){
            alerts.push("danger" , "An unexpected error occured in logging you out!");
        });
    };

    this.clearAllButCurrent = function(){
        $http({
            method: "delete",
            url: "/sessions/clear_all_but_current.json"
        }).
        success(function(data , status , config){
            alerts.push("success" , "cleared all sessions!");
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

    this.redirectUnlessSignedIn = function(redirected_page , display_alert){
        display_alert = typeof display_alert === "undefined" ? true : display_alert;
        if (!session.currentUser()) {
            $location.path(redirected_page || "/signin");
            alerts.removeAll();
            if (display_alert){
                alerts.push({ type: "info" , msg: "You need to be signed in to view this page!"});
            }
            return true;   
        }
        return false;
    };

    this.redirectIfSignedIn = function(redirected_page , display_alert){
        display_alert = typeof display_alert === "undefined" ? true : display_alert;
        if (session.currentUser()) {
            $location.path(redirected_page || "/home");
            alerts.removeAll();
            if (display_alert){
                alerts.push({ type: "info" , msg: "You are alredy logged in!"});
            }
            return true;
        }
        return false;
    }
}]);

app.service("alerts" , function(){
    var self = this;
    this.all = [];

    this.push = function(obj , msg){
        if(typeof obj === "object" && !angular.isArray(msg)) {
            self.all.push(obj);    
        } else if (angular.isArray(msg)) {
            msg.forEach(function(x){
                self.all.push({ type: obj , msg: x});
            });
        } else {
            self.all.push({ type: obj , msg: msg});
        }
        
    };

    this.remove = function(index){
        self.all.splice(index , 1);
    };

    this.removeAll = function(){
        while (self.all.length) {
            self.all.pop();
        }
    };

    this.create = function(type , msg){
        return {
            type: type,
            msg: msg
        };
    };
});

app.service("spinner" , ["$rootScope", function($rootScope){
    this.start = function(){
        $rootScope.$broadcast("spinner:start");
    }

    this.stop = function(){
        $rootScope.$broadcast("spinner:stop");
    }
}]);