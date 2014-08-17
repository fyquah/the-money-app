// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
function create_content(type , properties){
  var template = $("#accounting_record_template").html()
  Mustache.parse(template);   // optional, speeds up future uses
  var options_object = {
    type: (type),
    index: (properties.record_count + 1),
    record_type: (type + "_records"),
    record_count: (properties.record_count),
    record_id: (properties.record_id || ""),
    account_name: (properties.account_name || ""),
    account_type: (properties.account_type || ""),
    amount: (properties.amount || "")
  }
  options_object["selected_" + (properties.account_type || "blank").toLowerCase()] = "selected"
  var rendered = Mustache.render(template , options_object)

  if(type == "credit")
    $("#credit_records").append(rendered)
  else
    $("#debit_records").append(rendered)
}

function remove_record(record_count , record_type , prompt_message){
  if(confirm(prompt_message)){
    $("#" + record_type + "_" + record_count).css("display" , "none")
    console.log("accounting_transaction_" + record_type  + "_attributes_" + record_count + "__destroy")
    document.getElementById("accounting_transaction_" + record_type  + "_attributes_" + record_count + "__destroy").value = "destroy me"
  }
  return false
}
  
$(document).ready(function(){
  $("#create_new_credit_entry").click(function(){ 
    create_content("credit" , { record_count: credit_record_count })
    credit_record_count++
    return false
  })
  $("#create_new_debit_entry").click(function(){ 
    create_content("debit" , {  record_count: debit_record_count })
    debit_record_count++ 
    return false
  })
})