app.factory("Debt" , ["$http", "$q", "unkownErrorMessage", "User", function($http, $q, unkownErrorMessage, User){
    var Debt = function(args){
        args = args || {};
        var self = this;
        Debt.attributes().forEach(function(attr){
            if (angular.isDefined(args[attr]) && (attr === "created_at" || attr === "updated_at")) {
                self[attr] = new Date(args[attr]);
            } else if ((angular.isDefined(args[attr]) && attr === "lender") || (angular.isDefined(args[attr]) && attr === "borrower")) {
                self[attr] = new User(args[attr])
            } else {
                self[attr] = args[attr];
            }
        });
    };

    Debt.attributes = function(){
        return ["id", "amount", "borrower_id" , "lender_id", "status", "description", "seen_by_sender", "created_at", "updated_at", "borrower", "lender"];
    };

    Debt.all = function(){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/debts.json"
        }).success(function(data){
            var obj = {};
            angular.forEach(data, function(arr, key){
                obj[key] = arr.map(function(debt_args){
                    return new Debt(debt_args);
                })
            });
            deferred.resolve(obj);
        }).error(function(data, status){
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    };

    Debt.archive = function(){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/debts/archive.json"
        }).success(function(data){
            var obj = {};
            angular.forEach(data, function(arr, key){
                obj[key] = arr.map(function(debt_args){
                    return new Debt(debt_args);
                })
            });
            deferred.resolve(obj);
        }).error(function(data, status){
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    };

    Debt.active = function(){
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/debts/active.json"
        }).success(function(data){
            var obj = {};
            angular.forEach(data, function(arr, key){
                obj[key] = arr.map(function(debt_args){
                    return new Debt(debt_args);
                })
            });
            deferred.resolve(obj);
        }).error(function(data, status){
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    };

    Debt.find = function(id) {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/debts/" + id + ".json"
        }).success(function(data){
            console.log(data);
            deferred.resolve(new Debt(data.debt));
        }).error(function(data, status){
            if(status === 404) {
                deferred.reject({error: "debt request/record not found!"});
            } else {
                deferred.reject(unkownErrorMessage);
            }
        });
        return deferred.promise;
    }

    Debt.prototype.data = function(){
        var obj = {
            debt: {}
        }, self = this;
        Debt.attributes().forEach(function(attr){
            if (attr !== "created_at" && attr !== "updated_at") {
                obj.debt[attr] = self[attr];
            }
        });
        return obj;
    };

    Debt.prototype.create = function(){
        var deferred = $q.defer(), self = this;
        $http({
            method: "POST",
            url: "/debts.json",
            data: self.data()
        }).success(function(data){
            self.id = data.debt.id;
            self.borrower_id = data.debt.borrower_id;
            deferred.resolve()
        }).error(function(data, status){
            if (status === 401) {
                deferred.reject(data);
            } else {
                deferred.reject(unkownErrorMessage);
            }
        })
        return deferred.promise;
    };

    Debt.prototype.remove = function(){
        var deferred = $q.defer(), self = this;
        $http({
            method: "DELETE",
            url: "/debts/" + this.id + ".json"
        }).success(function(){
            deferred.resolve();
        }).error(function(){
            deferred.reject(unkownErrorMessage);
        });
        return deferred.promise;
    };

    ["approve", "reject", "resolve"].forEach(function(method){
        Debt.prototype[method] = function(){
            var deferred = $q.defer(), self = this;
            $http({
                method: "PATCH",
                url: "/debts/" + self.id + "/" + method + ".json"
            }).success(function(){
                self.status = {
                    approve: "approved",
                    reject: "rejected",
                    resolve: "resolved"
                }[method];
                console.log(self);
                deferred.resolve();
            }).error(function(data, status){
                if (status === 401) {
                    deferred.reject(data);
                } else {
                    deferred.reject(unkownErrorMessage);
                }
            })
            return deferred.promise;
        }
    });
    

    return Debt;
}]);