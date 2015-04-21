// so things dont get dupped all over the place

module.exports.dsalgo = {utils: {}}

// techincally the return here is unnecessary since we never make a deepCopy of the array 
// so its muting the original. But I just like this interface better
module.exports.dsalgo.utils.swap = function (list, firstIndex, secondIndex) {
  var temp = list[firstIndex];
  list[firstIndex] = list[secondIndex];
  list[secondIndex] = temp;
  return list;
}

module.exports.dsalgo.utils.makeRandomArray = function (config) {
  var conf = config || {};
  var precision = (typeof conf.precision === undefined) ? 2 : conf.precision;
  var multiplier = 100;
  var size = 100;
  var result = [];

  for (var i = size; i > 0; i -= 1) {
    result.push(parseFloat((Math.random() * multiplier).toFixed(precision)));
  }
  return result;
}