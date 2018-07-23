const save = require('./helper').save;

let STARTYEAR = 1997;
let ENDYEAR = 2018;

function extract() {
  var authors = [];

  var ressorts = [];
  var access = [];
  var extractedArticles = [];
  var extractedArticleTexts = [];

  var authorObject = {};
  var ressortObject = {};
  var accessObject = {};

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(authorObject, authors, article.author, null);
      addToArray(ressortObject, ressorts, article.ressort, 'DE');

      for (let author of article.authors) {
        var authorSplitted = author.split(/[(;)]/);
        for (let auth of authorSplitted)
          addToArray(authorObject, authors, auth, null);
      }

      addToArray(accessObject, access, article.access, null);
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
  console.log(access.length + ' Access');

  save(access, './extracted/', 'access');
  save(authors, './extracted/', 'authors');
  save(ressorts, './extracted/', 'ressorts');

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    process.stdout.write('Extracting data from ' + year + ". " + (ENDYEAR - year) + ' years left... \r');
    var articles = require('../posts/' + year + '.json');

    for (let art of articles) {
      var article = {};
      var articleText = {};
      if (art.length === 0) continue;

      article.id = extractedArticles.length + 1;
      articleText.id = article.id;
      article.author = authorObject[standarize(art.author)] + 1;
      article.ressort = ressortObject[standarize(art.ressort)] + 1;
      article.access = accessObject[standarize(art.access)] + 1;

      articleText.Sprache = 'DE';
      articleText.title = standarize(art.title);

      article.release_date = art.date_first_released !== null
        && art.date_first_released !== undefined
        ? new Date(art.date_first_released) : new Date(year);

      article.release_date = article.release_date.toISOString().split('T')[0].replace(/-/g, "");

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

      extractedArticles.push(article);
      extractedArticleTexts.push(articleText);
    }
  }
  console.log();

  console.log(extractedArticles.length + ' Articles');
  save(extractedArticles, './extracted/', 'articles');
  save(extractedArticleTexts, './extracted/', 'articleTexts');
}

function addToArray(obj, array, attribute, lang) {
  attribute = standarize(attribute);
  var index = obj[attribute];
  if (index === -1 || index === undefined) {
    obj[attribute] = array.length;
    if (lang) array.push({
      id: array.length + 1,
      name: attribute,
      Sprache: lang // z.B. 'DE' FUCKSAP
    });
    else array.push({
      id: array.length + 1,
      name: attribute,
    });
  }
  else if (index === undefined) {

  }
}

function standarize(string) {
  if (!string) return string;

  string = string.replace(/"/g, "")
    .replace(/([\r\n]+|[^A-Z0-9ÖÄÜa-z])+/ig, " ");

  let correct = true;
  for (let s of string.split(' '))
    if (!/[A-Züäö]{1}[a-z0-9äüö]\w+/.test(s))
      correct = false;

  if (correct) return string;

  let strings = string.toLowerCase().split(' ');
  for (let i = 0; i < strings.length; i++)
    strings[i] = strings[i].charAt(0).toUpperCase() + strings[i].slice(1);
  string = strings.join(' ');
  return string;
}
module.exports = { extract }