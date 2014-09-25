app.directive("appAlert" , function(){
    console.log("damn")
    return {
        restrict: "E",
        scope: {
            type: "@",
            index: "@"
        },
        require: "alertsCtrl",
        transclude: true,
        template: "<div class='alert alert-{{type}}' ng-transclude></div>",
        link: function(scope, element , attr , alertsCtrl){
            element.on("click" , function(){
                alertsCtrl.remove(scope.index);
            });
        }
    };
});