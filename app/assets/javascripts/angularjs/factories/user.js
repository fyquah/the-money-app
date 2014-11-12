app.factory("User" , ["$q", "$http", "unkownErrorMessage", function($q, $http, unkownErrorMessage){
    var User = function(args){
        var self = this;
        args = args || {};
        self.constructor.attributes().forEach(function(attr){
            if (attr === "created_at") {
                self[attr] = new Date(args[attr]);
            } else {
                self[attr] = args[attr];
            }
        });
    };

    User.attributes = function(){
        return ["id", "name" , "email", "password" , "password_confirmation", "created_at"];
    }

    User.find = function(id){
        var self = this, deferred = $q.defer();
        $http({
            method: "GET",
            url: "/users/" + id + ".json"
        }).success(function(data){
            deferred.resolve(new User(data.user));
        }).error(function(data, status){
            if (status === 404) {
                deferred.reject({ error: "User not found!"});
            } else {
                deferred.reject(unkownErrorMessage); 
            }
        });
        return deferred.promise;
    };

    User.all = function(){
        var self = this, deferred = $q.defer();
        $http({
            method: "GET",
            url: "/users.json"
        }).success(function(data){
            deferred.resolve(data.users.map(function(user_args){
                return new User(user_args);
            }));
        }).error(function(){
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    }

    User.prototype.data = function(){
        var obj = {
            user: {}
        }, self = this;
        ["name", "id", "email", "password", "password_confirmation"].forEach(function(attr){
            obj.user[attr] = self[attr];
        });
        return obj;
    };

    User.prototype.create = function(){
        var self = this, deferred = $q.defer();
        $http({
            method: "POST",
            url: "/users.json",
            data: self.data()
        }).success(function(data){
            self.id = data.user.id;
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

    User.prototype.update = function(){
        var self = this, deferred = $q.defer();
        $http({
            method: "PATCH",
            url: "/users/" + self.id + ".json",
            data: self.data()
        }).success(function(data){
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
    return User;
}]);