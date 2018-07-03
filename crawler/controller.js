const archiveFunctions = require('./archive');
const extractorFunctions = require('./extractor');
const exporterFunctions = require('./exporter');

// archiveFunctions
getUrls = (startyear, endyear) => archiveFunctions.getWeekUrls(startyear, endyear);
getPosts = (index) => archiveFunctions.getPosts(index);

// extractorFunctions
extractAccess = () => extractorFunctions.extractAccess();
extractAuthors = () => extractorFunctions.extractAuthors();
extractRessorts = () => extractorFunctions.extractRessorts();
extractTags = () => extractorFunctions.extractTags();
extractAndConvert = () => extractorFunctions.extractAndConvert();

// exporterFunctions
exportToCSV = () => exporterFunctions.exportToCSV();

module.exports = {
  getUrls, getPosts,
  extractAccess, extractAuthors, extractRessorts, extractTags,
  extractAndConvert,
  exportToCSV
}