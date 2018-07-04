const archiveFunctions = require('./archive');
const extractorFunctions = require('./extractor');
const exporterFunctions = require('./exporter');

// archiveFunctions
getUrls = (startyear, endyear) => archiveFunctions.getWeekUrls(startyear, endyear);
getPosts = (index) => archiveFunctions.getPosts(index);

// extractorFunctions
extract = () => extractorFunctions.extract();

// exporterFunctions
exportToCSV = () => exporterFunctions.exportToCSV();

module.exports = {
  getUrls, getPosts,
  extract,
  exportToCSV
}