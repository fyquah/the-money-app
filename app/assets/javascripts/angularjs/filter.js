app.filter("pluralize_error_word" , function(){
  return function(number_of_errors){
    return (number_of_errors == 1 ? number_of_errors + " error" : number_of_errors + " errors")  
  }
});