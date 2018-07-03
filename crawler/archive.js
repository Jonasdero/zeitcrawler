const Nightmare = require('nightmare');
var fs = require('fs');
const resolve = require('path').resolve;

const nightmareConfig = require('./config').nightmareConfig;
const save = require('./helper').save;

var weekUrls = [];
var postUrls = [];
var articles = [];

// Textlength starting in 2005/01
var STARTYEAR = 1998;
var ENDYEAR = 1998;

var currentMaxWeek = 27;

function getWeekUrls(startyear, endyear) {
  STARTYEAR = startyear;
  ENDYEAR = endyear;
  for (let year = STARTYEAR; year <= ENDYEAR; year++)
    for (let week = 1; week <= 52; week++) {
      if (year === 2018 && week > currentMaxWeek) break;
      var w = week + '';
      weekUrls.push('http://xml.zeit.de/' + year + '/' + w.padStart(2, 0) + '/index');
    }
  console.log('Getting Posturls from ' + weekUrls.length + ' weeks');
  getPostUrls(Nightmare(nightmareConfig), 0);
}

function getPosts(index) {
  var files = fs.readdirSync('./weeks/');
  postUrls = require(resolve('./weeks/' + files[index]));
  console.log('Getting Posturls from ' + postUrls.length + ' weeks');
  getPostData(Nightmare(nightmareConfig), 0);
}

function getPostUrls(instance, index) {
  console.log('Week ' + index + ' from ' + weekUrls.length);
  instance
    .goto(weekUrls[index]).wait().evaluate(() => {
      var urls = [];
      for (let block of document.getElementsByTagName('block')) {
        urls.push(block.attributes.href.nodeValue);
      }
      return urls;
    }).then((urls) => {
      if (urls.length > 0)
        postUrls = postUrls.concat(urls);
      index++;
      if (index === weekUrls.length) {
        var path = './weeks/';
        var name = STARTYEAR === ENDYEAR
          ? path + STARTYEAR
          : path + STARTYEAR + '-' + ENDYEAR;
        console.log('Saving ' + postUrls.length + ' post urls to ' + name);
        save(postUrls, path, name);
        endNightmare(instance);
        getPostData(Nightmare(nightmareConfig), 0);
        return;
      }
      getPostUrls(instance, index);
    }).catch((error) => {
      index++;
      getPostUrls(instance, index);
      console.log(error);
      endNightmare(instance);
    })
}

function getPostData(instance, index) {
  console.log('Post ' + index + ' from ' + postUrls.length);
  instance
    .goto(postUrls[index]).wait().evaluate(() => {
      var article = {};
      var notWantedAttributes = [
        'article_id', 'artbox_thema', 'executable', 'export_cds', 'foldable', 'html-meta-robots', 'id', 'is_amp', 'is_instant_article',
        'jobname', 'minimal_header', 'origname', 'overscrolling', 'product-id', 'seo_optimized', 'product-name', 'provides',
        'public_token', 'previous_uniqueIds', 'public_token', 'publication-id', 'running-volume', 'status', 'template', 'uuid'
      ]

      var tags = document.getElementsByTagName('tag');
      var title = document.getElementsByTagName('title')[0];
      var subtitle = document.getElementsByTagName('subtitle')[0];
      var supertitle = document.getElementsByTagName('supertitle')[0];
      var description = document.getElementsByTagName('description')[0];
      var reference = document.getElementsByTagName('reference')[0];
      article.authors = [];

      for (let attr of document.getElementsByTagName('attribute')) {
        if (attr.attributes.name === undefined) continue;
        var name = attr.attributes.name.value;
        var value = attr.innerHTML;
        if (value === undefined || name === undefined) continue;
        if (notWantedAttributes.includes(name)) continue;
        article[name] = value;
      }

      if (article.channels !== undefined) article.channels = article.channels.split(' ');
      if (subtitle !== undefined) article.subtitle = subtitle.innerHTML;
      if (title !== undefined) article.title = title.innerHTML;
      if (supertitle !== undefined) article.supertitle = supertitle.innerHTML;
      if (description !== undefined) article.description = description.innerHTML;
      if (article.author !== undefined) article.authors = article.authors.concat(article.author.split(';'));
      if (reference !== undefined) {
        if (reference.attributes.author !== undefined) {
          var secondAuthor = reference.attributes.author.value;
          if (!article.authors.includes(secondAuthor))
            article.authors.push(secondAuthor);
        }
        if (reference.attributes.contenttype !== undefined)
          article.contenttype = reference.attributes.contenttype.value;
        if (reference.attributes.ressort !== undefined)
          article.ressort = reference.attributes.ressort.value;
      }

      article.tags = [];
      for (let tag of tags) article.tags.push(tag.innerHTML);

      return article;
    }).then((article) => {
      articles.push(article);
      index++;
      if (index === postUrls.length) {
        var path = './posts/';
        var name = STARTYEAR === ENDYEAR
          ? path + STARTYEAR + '-posts'
          : path + STARTYEAR + '-' + ENDYEAR + '-posts';
        console.log('Saving ' + articles.length + ' articles to ' + name);
        save(articles, path, name);
        endNightmare(instance);
        return;
      }
      getPostData(instance, index);
    }).catch((error) => {
      index++;
      getPostData(instance, index);
      console.log(error);
      endNightmare(instance);
    })
}

function endNightmare(instance) {
  instance.end();
  instance.proc.disconnect();
  instance.proc.kill();
  instance.ended = true;
  instance = null;
}

module.exports = {
  getWeekUrls, getPosts
}