const save = require('./helper').save;

let STARTYEAR = 2007;
let ENDYEAR = 2017;

function extractAndConvert() {
  var authors = [];
  var ressorts = [];
  var tags = [];
  var access = [];
  var extractedArticles = [];

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(authors, article.author);
      addToArray(ressorts, article.ressort);

      for (let tag of article.tags)
        addToArray(tags, tag);

      for (let author of article.authors) {
        var authorSplitted = author.split(/[(;)]/);
        for (let auth of authorSplitted)
          addToArray(authors, auth);
      }

      addToArray(access, article.access);
    }
  }

  console.log(authors.length + " Authors");
  console.log(ressorts.length + " Ressorts");
  console.log(tags.length + " Tags");
  console.log(access.length + " Access");

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    console.log("Extracting data from year " + year + " from " + ENDYEAR);
    var articles = require('../posts/' + year + '.json');
    for (let art of articles) {
      var article = {};
      article.id = extractedArticles.length + 1;
      article.authors = authors.findIndex(author => author.name === art.author) + 1;
      article.ressort = ressorts.findIndex(ressort => ressort.name === art.ressort) + 1;
      article.access = access.findIndex(access => access.name === art.access) + 1;
      article.title = art.title;
      article.subtitle = art.subtitle;

      article.tags = [];

      for (let i = 0; i < art.tags.length; i++) {
        article.tags[i] = tags.findIndex(tag => tag.name === art.tags[i]) + 1;
      }

      article.urgent = art.urgent === "yes" ? true : false;

      article.release_date = art.date_first_released !== null
        && art.date_first_released !== undefined
        ? art.date_first_released : new Date(year);

      article.has_comments = art.show_commentthread !== null
        && art.show_commentthread !== undefined
        ? true : false;

      article.moderated_comments = art.comments_premoderate !== null
        && art.comments_premoderate !== undefined
        ? true : false;

      article.has_recensions = art.has_recensions !== null
        && art.has_recensions !== undefined
        ? true : false;

      article.breaking_news = art.breaking_news !== null
        && art.breaking_news !== undefined
        ? true : false;

      article.corrected = art.date_last_checkout !== null
        && art.date_last_checkout !== undefined
        && art.date_last_checkout === art.date_first_released
        ? false : true;

      article.length = art.length;

      extractedArticles.push(article);
    }
  }

  save(access, './extracted/', 'access');
  save(authors, './extracted/', 'authors');
  save(ressorts, './extracted/', 'ressorts');
  save(tags, './extracted/', 'tags');

  console.log(extractedArticles.length + " Articles");
  save(extractedArticles, './extracted/', 'articles');
}

function extractAuthors() {
  console.log("Extracting Authors...");
  var authors = [];
  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(authors, article.author);
    }
  }
  console.log(authors.length + " Authors");
  save(authors, './extracted/', 'authors');
  return authors;
}

function extractRessorts() {
  console.log("Extracting Ressorts...");
  var ressorts = [];
  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(ressorts, article.ressort);
    }
  }
  console.log(ressorts.length + " Ressorts");
  save(ressorts, './extracted/', 'ressorts');
  return ressorts;
}

function extractTags() {
  console.log("Extracting Tags...");
  var tags = [];
  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      for (let tag of article.tags) {
        addToArray(tags, tag);
      }
    }
  }
  console.log(tags.length + " Tags");
  save(tags, './extracted/', 'tags');
  return tags;
}

function extractAccess(articles) {
  console.log("Extracting Access...");
  var access = [];
  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(access, article.access);
    }
  }
  console.log(access.length + " Access");
  save(access, './extracted/', 'access');
  return access;
}

function addToArray(array, attribute) {
  var index = array.findIndex(a => a.name === attribute)
  if (index === -1)
    array.push({ id: array.length + 1, name: attribute });
  // Only for tests
  // else array[index].hits++;
}

module.exports = {
  extractAuthors, extractRessorts,
  extractTags, extractAccess,
  extractAndConvert
}