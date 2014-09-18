app.controller("usersNewCtrl" , ["$scope" , function($scope){
    (function(){
        $scope.user = {};
    })();

    $scope.submit = function(){
        var data = {
            user: {
                name: $scope.user.name,
                email: $scope.user.email,
                password: $scope.user.password,
                password_confirmation: $scope.user.password_confirmation
            }
        };
        $http({
            method: "POST" ,
            url: "/users/new" ,
            data: data
        }).
        success(function(data){

        }).
        error(function(data){
            
        })
    }
}]);