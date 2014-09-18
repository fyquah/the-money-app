$(document).on("page:load" , function(){
    $("[ng-app]").each(function(){
        module = $(this).attr('ng-app');
        angular.bootstrap(this, [module]);
    })
});

var APPNAME = "the-money-app"
var app = angular.module(APPNAME, ['ngResource' , "ngRoute"]);

app.run(["$rootScope" , function($rootScope){
    // run initializations here
}]);
