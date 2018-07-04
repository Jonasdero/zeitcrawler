var controller = require('./crawler/controller');
var fs = require('fs');


if (process.argv.length < 3) {
  console.log("No mode given\nExiting...");
  return;
}

switch (process.argv[2].split('=')[1]) {
  case 'archive':
    getArchiveData(1997, 1997);
    break;
  case 'extract':
    extract();
    break;
  case 'export':
    exportToCSV();
    break;
}

// Get Data from Zeit online
// Login into premium not valid anymore
function getArchiveData(from, to) {
  controller.getUrls(from, to);
}
function extract() {
  controller.extract();
}

function exportToCSV() {
  controller.exportToCSV();
}