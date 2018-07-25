const save = require('./helper').save;

let STARTYEAR = 1997;
let ENDYEAR = 2018;

function extract() {
  var authors = [];

  var ressorts = [];
  var access = [];
  var extractedBewegungsdata = [];
  var extractedArticles = [];

  var authorObject = {};
  var ressortObject = {};
  var accessObject = {};

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    var articles = require('../posts/' + year + '.json');
    for (let article of articles) {
      addToArray(authorObject, authors, article.author, null);
      addToArray(ressortObject, ressorts, article.ressort, null);

      for (let author of article.authors) {
        var authorSplitted = author.split(/[(;)]/);
        for (let auth of authorSplitted)
          addToArray(authorObject, authors, auth, null);
      }
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
  ;
  save(authors, './extracted/', 'authors');
  save(ressorts, './extracted/', 'ressorts');

  for (let year = STARTYEAR; year <= ENDYEAR; year++) {
    process.stdout.write('Extracting data from ' + year + ". " + (ENDYEAR - year) + ' years left... \r');
    var articles = require('../posts/' + year + '.json');

    for (let art of articles) {
      var bewegungsdata = {};
      var article = {};
      if (art.length === 0) continue;

      bewegungsdata.article = extractedBewegungsdata.length + 1;
      article.id = bewegungsdata.id;
      bewegungsdata.author = authorObject[standarize(art.author)] + 1;
      bewegungsdata.ressort = ressortObject[standarize(art.ressort)] + 1;

      article.title = standarize(art.title);

      bewegungsdata.release_date = art.date_first_released !== null
        && art.date_first_released !== undefined
        ? new Date(art.date_first_released) : new Date(year);

      bewegungsdata.release_date = bewegungsdata.release_date.toISOString().split('T')[0].replace(/-/g, "");

      bewegungsdata.comments = art.show_commentthread !== null
        && art.show_commentthread !== undefined
        ? randomBetween(1, 2000) : 0;

      bewegungsdata.recensions = art.has_recensions !== null
        && art.has_recensions !== undefined
        ? randomBetween(1, 2000) : 0;

      bewegungsdata.length = art.length;

      extractedBewegungsdata.push(bewegungsdata);
      extractedArticles.push(article);
    }
  }
  console.log();

  console.log(extractedBewegungsdata.length + ' Articles');
  save(extractedBewegungsdata, './extracted/', 'bewegungsdaten');
  save(extractedArticles, './extracted/', 'articles');
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

function randomBetween(min, max) {
  return Math.floor(Math.random() * max) + min;
}
module.exports = { extract }