var controller = require('./crawler/controller');
var fs = require('fs');

// Get Data from Zeit online
// Login into premium not valid anymore
function getArchiveData() {
  controller.getUrls(2018, 2018);
}
function extract() {
  controller.extractAndConvert();
}

function exportToCSV() {
  controller.exportToCSV();
}

getArchiveData();
// exportToCSV();