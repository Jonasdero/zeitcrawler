nightmareConfig = {
  show: false,
  typeInterval: 5,
  webPreferences: {
    images: false,
    partition: 'persist:'
  },
  waitTimeout: 300000,
}

function makeid() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

nightmareConfig.webPreferences.partition = 'persist:' + makeid();

module.exports = {
  nightmareConfig,
}