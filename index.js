var fs = require('fs');
var request = require('request');

module.exports = Puush;

function Puush(apiKey) {
  if (typeof apiKey === 'undefined')
    throw new Error('the api key is not defined.');
  else
    this.API_KEY = apiKey;
  this.API_URL = "https://puush.me/api/up";
};

Puush.prototype.single = function(path, callback) {
  var self = this;
  if (typeof path === 'undefined')
    throw new Error('path file is not defined.');
  else {
    if (path[0] !== '/') path = '/' + path;
    upload(path, self.API_URL, self.API_KEY, function(err, data) {
      if (err) throw new Error(err);
      if (typeof callback === 'undefined') return data;
      else callback(data);
    });
  }
};

function upload(file, apiUrl, apiKey, callback) {
  var path = require('path').dirname(require.main.filename) + file;
  var headers = { 'User-Agent': 'node-puush-upload/0.1 (Npm module for uploading screenshots to puush; https://github.com/Raesta/node-puush-upload)'};
  var formData = { 'k': apiKey, 'z': 'poop', 'f': fs.createReadStream(path) };
  request.post({url: apiUrl, formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      callback('upload failed: ' + err, null);
    } else {
      var data = body.split(',');
      callback(null, { id: data[2], url: data[1] });
    }
  });
}
