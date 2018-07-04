var controller = require('./crawler/controller');
var fs = require('fs');

// Get Data from Zeit online
// Login into premium not valid anymore
function getArchiveData(from, to) {
  controller.getUrls(from, to);
}
function extract() {
  controller.extractAndConvert();
}

function exportToCSV() {
  controller.exportToCSV();
}

// getArchiveData(1997, 1997);
// extract();
exportToCSV();