function httpGet(theUrl, array) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.setRequestHeader('X-Authorization', '54145d2843aaafb2c9a4b7acc81c5fb4648cdf3e024819252011');
  xmlHttp.send(null);
  xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      for (let match of myArr.matches)
        array.push(match);
    }
  };
}

function timeout(offset, array, limit, url) {
  if (offset < limit)
    setTimeout(function () {
      httpGet(url + "" + offset, array)
      timeout(offset + 1000, array, limit);
    }, 1000);
  console.log(array.length);
}

(function (console) {

  console.save = function (data, filename) {

    if (!data) {
      console.error('Console.save: No data')
      return;
    }

    if (!filename) filename = 'console.json'

    if (typeof data === "object") {
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
})(console)

url = "http://api.zeit.de/keyword?q=%&fields=href,id,value&limit=1000&offset=";

var keyword = [];

timeout(0, keyword, 18000, url);