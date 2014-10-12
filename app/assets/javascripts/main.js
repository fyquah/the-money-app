$(document).on("page:load" , function(){
    $("[ng-app]").each(function(){
        module = $(this).attr('ng-app');
        angular.bootstrap(this, [module]);
    })
});

var APPNAME = "theMoneyApp"
var app = angular.module(APPNAME, ['ngResource' , "ngRoute"]);

app.run(["$rootScope", "session" , function($rootScope, session){
    $rootScope.session = session;
    // run initializations here
}]);
