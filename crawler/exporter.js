var fs = require('fs');
var csvWriter = require('csv-write-stream')
const resolve = require('path').resolve;

function exportToCSV() {

  let jsons = ['authors', 'ressorts', 'articles', 'bewegungsdaten'];

  for (let json of jsons) {
    fs.writeFileSync(resolve('./csv/' + json + '.csv'), null);
    var writer = new csvWriter({ separator: ';' });
    var data = require('../extracted/' + json + '.json');
    writer.pipe(fs.createWriteStream('./csv/' + json + '.csv'))
    for (let d of data) {
      writer.write(d);
    }
    writer.end();
    console.log('Exported ' + json[0].toUpperCase() + json.substr(1) + ' to csv');
  }
}

module.exports = { exportToCSV }