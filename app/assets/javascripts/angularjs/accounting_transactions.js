var accountingTransactionApp = angular.module("theMoneyApp" , []);

accountingTransactionApp.controller('accountingTransactionCtrl', 
  ['$http' , '$scope' , "$recordCreator", function($http, $scope, $recordCreator){

  $scope.initializeTransaction = function(transaction){
    $scope.transaction = Object.create(null); // create an object with absolutely no prototype objects!
    ["id" , "description" , "date" , "account_book_id"].forEach(function(key){
      $scope.transaction[key] = transaction[key];
    });
    ["debit_records_attributes" , "credit_records_attributes" , "removed_debit_records" , "removed_credit_records"].forEach(function(key){
      $scope.transaction[key] = [];
    })
  }

  $scope.initializeRecords = function(type , obj){
    console.log(obj);
    obj.forEach(function(record){
      $scope.addRecord(type , record);
    });
  }

  $scope.addRecord = function(type , obj){
    if(typeof obj == "undefined")
      obj = { record_type: type };

    if(type == "debit"){
      $scope.transaction.debit_records_attributes.push($recordCreator(obj));
    } else if(type == "credit"){ 
      $scope.transaction.credit_records_attributes.push($recordCreator(obj));
    } else {
      alert("invalid type given to functon addRecord()");
    }
  }

  $scope.removeRecord = function(type , index){
    if($scope.transaction[type + "_records_attributes"].length != 0 && index < $scope.transaction[type + "_records_attributes"].length ){
      var removed_item = $scope.transaction[type + "_records_attributes"].splice(index , 1)[0];
      removed_item._destroy = "destroy me";
      $scope.transaction["removed_" + type + "_records"].push(removed_item);
    }
  }

  $scope.submit = function(){
    var params = $scope.getSubmissionParams();
    var savePromise = null;

    if(params.accounting_transaction.id === null || params.accounting_transaction.id == undefined || params.accounting_transaction.id == ""){
      var target_url = "/account_books/" + params.accounting_transaction.account_book_id + "/accounting_transactions.json";
      savePromise = $http.post(target_url , params);
    } else {
      var target_url = "/account_books/" + params.accounting_transaction.account_book_id + "/accounting_transactions/" + params.accounting_transaction.id + ".json";
      savePromise = $http.put(target_url , params);
    }

    savePromise.success(function(data){
      console.log(data);
      window.location = "/account_books/" + data.accounting_transaction.account_book_id + "/accounting_transactions/" + data.accounting_transaction.id;

    });

    savePromise.error(function(data){
      $scope.error_messages = data.errors;
    });
  }

  $scope.getSubmissionParams = function(){
    return {
      authenticity_token: $scope.form_authenticity_token,
      accounting_transaction: (function(){
        var return_value = Object.create(null);
        Object.keys($scope.transaction).forEach(function(key){
          return_value[key] = $scope.transaction[key];
        });
        return_value["debit_records_attributes"] = $scope.transaction.debit_records_attributes.concat($scope.transaction.removed_debit_records);
        return_value["credit_records_attributes"] = $scope.transaction.credit_records_attributes.concat($scope.transaction.removed_credit_records);
        return_value["removed_debit_records"] = null;
        return_value["removed_credit_records"] = null;
        return return_value;
      })()
    }
  }
}]);

accountingTransactionApp.service("$recordCreator" , function(){
  return function(obj){
    var defaults = {
      account_name: "",
      amount: "",
      account_type: "",
      id: ""
    };

    for(var prop in defaults)
      if(obj[prop] === null  || obj[prop] === undefined || obj[prop] === "" )
        obj[prop] = defaults[prop]

    return obj;
  }
});

accountingTransactionApp.directive("authenticityToken" , function(){
  return {
    restrict: "A",
    link: function(scope , element , attr){
      scope["form_authenticity_token"] = attr["authenticityToken"]
    }
  }
});

accountingTransactionApp.filter("pluralize_error_word" , function(){
  return function(number_of_errors){
    return (number_of_errors == 1 ? number_of_errors + " error" : number_of_errors + " errors")  
  }
})