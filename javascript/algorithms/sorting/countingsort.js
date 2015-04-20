// http://en.wikipedia.org/wiki/Counting_sort
// inspired by http://en.wikibooks.org/wiki/Algorithm_Implementation/Sorting/Counting_sort

module.exports = function (list) {

  var i, j, k, min, max, counts = [], result = [], len = list.length;

  min = list[0];
  max = list[0];

  list.forEach(function(val){
     if(val > max ) {
        max = val; 
     }

     if(val < min ) {
        min = val;
     }
  });

  // setup array to hold counts of differnt values
  for(i = 0; i < max-min + 1; i++) {
    counts[i] = 0;
  }
  
  // count number of distinct values in their respective array place
  for(i = 0; i < len; i++) {
    // current value minus the min to keep it in array bounds
    counts[list[i] - min]++;
  }

  k = 0;

  // put output values in result array
  //
  // repeat values based on count at counts index
  counts.forEach(function(val,i,arr){
    for (j = 0; j < counts[i]; j++){
       result[k] = i + min;
       k = k + 1;
    }
  });

  return result;
}
