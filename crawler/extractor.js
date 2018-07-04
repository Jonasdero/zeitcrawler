const save = require('./helper').save;

let STARTYEAR = 1997;
let ENDYEAR = 2018;

function extract() {
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

  for (let acc of access) {
    if (acc.name === null || acc.name === undefined || acc.name === '') acc.name = 'Unbekannt';
  }

  console.log(authors.length + ' Authors');
  console.log(ressorts.length + ' Ressorts');
  console.log(tags.length + ' Tags');
  console.log(access.length + ' Access');

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    process.stdout.write('Extracting data from ' + year + ". " + (ENDYEAR - year) + ' years left... \r');
    var articles = require('../posts/' + year + '.json');

    for (let art of articles) {
      var article = {};
      if (art.length === 0) continue;

      article.id = extractedArticles.length + 1;
      article.author = authors.findIndex(author => author.name === art.author) + 1;
      article.ressort = ressorts.findIndex(ressort => ressort.name === art.ressort) + 1;
      article.access = access.findIndex(access => access.name === art.access) + 1;
      article.title = art.title;

      article.tags = [];
      for (let i = 0; i < art.tags.length; i++) {
        article.tags[i] = tags.findIndex(tag => tag.name === art.tags[i]) + 1;
      }

      article.urgent = art.urgent === 'yes' ? true : false;

      article.release_date = art.date_first_released !== null
        && art.date_first_released !== undefined
        ? new Date(art.date_first_released) : new Date(year);

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
  console.log();

  save(access, './extracted/', 'access');
  save(authors, './extracted/', 'authors');
  save(ressorts, './extracted/', 'ressorts');
  save(tags, './extracted/', 'tags');

  console.log(extractedArticles.length + ' Articles');
  save(extractedArticles, './extracted/', 'articles');
}

function addToArray(array, attribute) {
  var index = array.findIndex(a => a.name === attribute)
  if (index === -1)
    array.push(
      {
        id: array.length + 1,
        name: attribute
      }
    );
  // Only for tests
  // else array[index].hits++;
}

module.exports = { extract }