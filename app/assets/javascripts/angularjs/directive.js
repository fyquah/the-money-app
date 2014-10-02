app.directive("appAlert" , function(){
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

app.directive("appSpinner" , function(){
    return {
        restrict: "E",
        template: "<div ng-show='spinner_is_moving' style=\"z-index: 9999 ;background-color : rgba(255 , 255 , 255 , 0.6); width : 100% ; position : fixed ; height : 100%\"><img src=\"/assets/spinner.gif\" ng-style='spinner_style'/></div>",
        scope: true,
        controller: function(spinner){
            var ori_style = {
                height: "100px",
                width: "100px",
                position: "fixed",
                top: "50%",
                left: "50%",
                "transform": "translate(-50% , -50%)",
                "-webkit-transform": "translate(-50% , -50%)",
                "-moz-transform": "translate(-50% , -50%)",
                "-ms-transform": "translate(-50% , -50%)",
                "-o-transform": "translate: (-50% , -50%)"
            };
            return ["spinner" , "$scope" , function(spinner , $scope){
                $scope.spinner_style = ori_style;
                $scope.$on("spinner:start" , function(){
                    $scope.spinner_is_moving = true;
                });
                $scope.$on("spinner:stop" , function(){
                    $scope.spinner_is_moving = false;
                })
            }];
        }()
    };
});

app.directive("appTransactionRecords" , function(){
    return {
        restrict: "E",
        template: "<div class='col-xs-6'>{{ record.account_name }}</div><div class='col-xs-3'>{{ record.account_type }}</div><div class='col-xs-3'>{{ record.amount }}</div>"
    };
});

app.directive("appPopUpWindow" , function(){
    return {
        restrict: "E",
        transclude: true,
        template: "<div style='width: 500px ; height: 500px ; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) ; webkit-transform: translate(-50%, -50%); moz-transform: translate(-50%, -50%) ; ms-transform: (-50%, -50%); -o-transform: translate(-50%, -50%); background-color: rgba(255, 255, 255, 1);'><div style='padding: 10px' ng-transclude></div></div>",
        link: function(scope, element, attr){
            element.css({
                height: "100%",
                width: "100%",
                position: "fixed",
                top: "0px",
                left: "0px",
                "z-index": 9999,
                "background-color": "rgba(0,0,0,0.7)"
            })
        }
    }
})