app.filter("pluralize_error_word" , function(){
  return function(number_of_errors){
    return (number_of_errors == 1 ? number_of_errors + " error" : number_of_errors + " errors")  
  };
});

app.filter("accountsRecordSum", function(){
    return function(arr){
        return arr.reduce(function(memo, record, index){
            return memo + (record.amount || 0)
        }, 0);
    };
});

app.filter("limitWordsLength", function(){
    return function(str, len){
        var s = str.substr(Number(len) +1, -1);
        return str.substr(0, len) + s.substr(0, s.indexOf(" ")) + (str.length > len ? "..." : "");
    };
});

app.filter("orderObjectBy", function(){
    return function(items, field, reverse){
        var filtered = [];
        angular.forEach(items, function(item){
            filtered.push(item);
        });
        console.log(filtered);
        filtered.sort(function(a,b){
            return a[field] > b[field] ? 1 : -1;
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    }
})