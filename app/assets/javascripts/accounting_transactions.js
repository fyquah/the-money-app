// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
function create_content(type , properties){
  var template = $("#accounting_record_template").html()
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template , {
    record_type: (type + "_records"),
    record_count: (properties.record_count),
    record_id: (properties.record_id || ""),
    account_name: (properties.account_name || ""),
    account_type: (properties.account_type || ""),
    amount: (properties.amount || "")
  })
  if(type == "credit")
    $("#credit_records").append(rendered)
  else
    $("#debit_records").append(rendered)
}
  
$(document).ready(function(){
  $("#create_new_credit_entry").click(function(){ 
    create_content("credit" , { record_count: credit_record_count })
    credit_record_count++
  })
  $("#create_new_debit_entry").click(function(){ 
    create_content("debit" , {  record_count: debit_record_count })
    debit_record_count++ 
  })
})