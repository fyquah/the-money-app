var theMoneyApp = angular.module("theMoneyApp" , []);

theMoneyApp.directive("authenticityToken" , function(){
  return {
    restrict: "A",
    link: function(scope , element , attr){
      scope["authenticity_token"] = attr["authenticityToken"]
    }
  }
});

theMoneyApp.filter("pluralize_error_word" , function(){
  return function(number_of_errors){
    return (number_of_errors == 1 ? number_of_errors + " error" : number_of_errors + " errors")  
  }
});