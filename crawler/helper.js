const resolve = require('path').resolve;
var fs = require('fs');

// Randomizes a number between number*2 and number
// for example if number is 5 then the maximum could be 10 and the minimum 5;
// Input: integer
// Output: integer
function random(number) { return Math.random() * (number * 2 - number) + number; }

function save(data, folder, name) {
  if (!fs.existsSync(resolve(folder)))
    fs.mkdir(resolve(folder), (error) => {
      console.log(error);
    })

  var savepath = resolve(folder + name + '.json');

  if (fs.existsSync(savepath))
    fs.unlinkSync(savepath);

  fs.writeFile(savepath, JSON.stringify(data, null, 4), 'utf-8', (error) => {
    if (error) console.log(error);
    else console.log('Saved to ' + savepath);
  })
  return;
}

module.exports = { random, save }