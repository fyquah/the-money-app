app.controller("alertsCtrl" , [ "alerts" , "$scope" , function(alerts , $scope){
    $scope.all = alerts.all;
    $scope.remove = alerts.remove;
    $scope.removeAll = alerts.removeAll;
}]);