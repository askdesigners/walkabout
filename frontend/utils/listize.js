export default function listize(arr) {
    var proposed = arr.map(function(item){
      return proposition(item)
    });
    var last = proposed.pop();
    if(arr.length > 1){
      return proposed.join(', ') + ', and ' + last;
    } else {
      return last;
    }
}

function proposition(word){
  var first = word[0];
  var vowels = ['a','e','i','o','u'];
  if(vowels.indexOf(first) >= 0) return ' an ' + word;
  return ' a '  + word;
}