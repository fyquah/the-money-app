app.controller('debtsNewCtrl', ['$scope', 'User', 'Debt', 'alerts', 'session', function($scope, User, Debt, alerts, session){    
    var new_debt = new Debt(), all_users;
    User.all().then(function(all_users){
        $scope.all_users = all_users.filter(function(user){
            return user.id != session.currentUser().id;
        })
    });

    $scope.new_debt = new_debt;
    $scope.submit = function(){
        new_debt.create().then(function(){
            alerts.push("success", "sent your debt request!");
        }, function(err){
            alerts.push("danger", err.error);
        })
    }
}]);

app.controller('debtsIndexCtrl', ['$scope', 'Debt', function($scope, Debt){
    var borrowed_debts , lent_debts;
    Debt.active().then(function(r){
        borrowed_debts = r.borrowed_debts;
        lent_debts = r.lent_debts;

        $scope.borrowed_debts = borrowed_debts;
        $scope.lent_debts = lent_debts;
    });
}]);

app.controller('debtsShowCtrl', ["$scope", "$routeParams", "Debt", "alerts", "page", function($scope, $routeParams, Debt, alerts, page){
    Debt.find($routeParams.id).then(function(debt){
        $scope.debt = debt;

        // borrower methods
        $scope.remove = function(){
            debt.remove().then(function(){
                alerts.push("success", "deleted debt request!");
                page.redirect("/debts");
            }, function(err){
                alerts.push("danger", err.error);
            });
        };

        // lender methods
        ["approve", "reject", "resolve"].forEach(function(method){
            $scope[method] = function(){
                debt[method]().then(function(){
                    alerts.push("success", "Successfully " + method + " debt request!");
                    page.redirect("/debts");
                }, function(err){
                    alerts.push("danger", err.error);
                });
            }
        });
    });
}]);

app.controller('debtsArchiveCtrl', ['$scope', 'Debt', function($scope, Debt){
    Debt.archive().then(function(r){
        borrowed_debts = r.borrowed_debts;
        lent_debts = r.lent_debts;

        $scope.borrowed_debts = borrowed_debts;
        $scope.lent_debts = lent_debts;
    }) 
}]);