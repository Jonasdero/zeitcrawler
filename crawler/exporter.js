var fs = require('fs');
var csvWriter = require('csv-write-stream')
const resolve = require('path').resolve;

function exportToCSV() {

  let jsons = ['tags', 'authors', 'ressorts', 'access', 'articles'];

  for (let json of jsons) {

    fs.writeFileSync(resolve('./csv/' + json + '.csv'), null);
    var writer = new csvWriter({ separator: ';' });
    var data = require('../extracted/' + json + '.json');
    writer.pipe(fs.createWriteStream('./csv/' + json + '.csv'))
    for (let d of data) {
      writer.write(d);
    }
    writer.end();
  }
}

module.exports = {
  exportToCSV,
}