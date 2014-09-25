app.controller("sessionsNewCtrl" , [ "$scope" , "$http" , "session" , "page" , "User" , 
function($scope , $http , session , page , User){
    page.redirectIfSignedIn();
    $scope.user = {};
    console.log(session.currentUser());

    $scope.submit = function(){
        var data = {
            user: {
                email: $scope.user.email,
                password: $scope.user.password
            }
        };
        $http({
            method: "POST",
            url: "/sessions.json",
            data: data
        }).success(function(data){
            console.log(data);
            session.currentUser(new User(data.user));
            console.log(session.currentUser());
            page.redirect("/home");
        }).error(function(data){
            try {
                console.log(data);
                // kemungkinan invalid credential
            } catch (e) {
                // error 5** [ISE] !!!
            }
        });
    };

}]);