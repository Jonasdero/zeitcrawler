const save = require('./helper').save;

let STARTYEAR = 1997;
let ENDYEAR = 2018;

function extract() {
  var authors = [];
  var ressorts = [];
  var tags = [];
  var access = [];
  var extractedArticles = [];
  var extractedArticleTexts = [];
  var artTags = [];

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(authors, article.author);
      addToArrayDE(ressorts, article.ressort);

      for (let tag of article.tags)
        addToArrayDE(tags, tag);

      for (let author of article.authors) {
        var authorSplitted = author.split(/[(;)]/);
        for (let auth of authorSplitted)
          addToArray(authors, auth);
      }

      addToArrayDE(access, article.access);
    }
  }

  for (let acc of access) {
    if (acc.name === null || acc.name === undefined || acc.name === '') acc.name = 'Unbekannt';
  }

  for (let author of authors) {
    if (author.name === null || author.name === undefined || author.name === '') author.name = 'Unbekannt';
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
      var articleText = {};
      if (art.length === 0) continue;

      article.id = extractedArticles.length + 1;
      articleText.id = extractedArticles.length + 1
      article.author = authors.findIndex(author => author.name === art.author) + 1;
      article.ressort = ressorts.findIndex(ressort => ressort.name === art.ressort) + 1;
      article.access = access.findIndex(access => access.name === art.access) + 1;

      articleText.Sprache = 'DE';
      articleText.title = art.title;

      for (let i = 0; i < art.tags.length; i++) {
        artTags.push({ articleId: article.id, tagId: tags.findIndex(tag => tag.name === art.tags[i]) + 1 });
      }

      article.urgent = art.urgent === 'yes' ? true : false;

      article.release_date = art.date_first_released !== null
        && art.date_first_released !== undefined
        ? new Date(art.date_first_released) : new Date(year);

      article.has_comments = art.show_commentthread !== null
        && art.show_commentthread !== undefined
        ? 1 : 2;

      article.moderated_comments = art.comments_premoderate !== null
        && art.comments_premoderate !== undefined
        ? 1 : 2;

      article.has_recensions = art.has_recensions !== null
        && art.has_recensions !== undefined
        ? 1 : 2;

      article.breaking_news = art.breaking_news !== null
        && art.breaking_news !== undefined
        ? 1 : 2;

      article.corrected = art.date_last_checkout !== null
        && art.date_last_checkout !== undefined
        && art.date_last_checkout === art.date_first_released
        ? 1 : 2;

      article.length = art.length;

      article.Sprache = 'DE';
      extractedArticles.push(article);
      extractedArticleTexts.push(articleText);
    }
  }
  console.log();


  console.log(artTags.length + " Article Tags");

  save(access, './extracted/', 'access');
  save(artTags, './extracted/', 'artTags');
  save(authors, './extracted/', 'authors');
  save(ressorts, './extracted/', 'ressorts');
  save(tags, './extracted/', 'tags');

  console.log(extractedArticles.length + ' Articles');
  save(extractedArticles, './extracted/', 'articles');
  save(extractedArticleTexts, './extracted/', 'articleTexts');
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

function addToArrayDE(array, attribute) {
  var index = array.findIndex(a => a.name === attribute)
  if (index === -1)
    array.push(
      {
        id: array.length + 1,
        name: attribute,
        Sprache: 'DE' // FUCKSAP
      }
    );
  // Only for tests
  // else array[index].hits++;
}
module.exports = { extract }