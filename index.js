var async = require('async');
var fs = require('fs');
var request = require('request');

module.exports = Puush;

function Puush(apiKey) {
  if (typeof apiKey === 'undefined')
    throw new Error('the api key is not defined.');
  else
    this.API_KEY = apiKey;
  this.API_URL = "https://puush.me/api/up";
  this.IGNORED_FILES = ['.DS_Store', '.AppleDouble', '.LSOverride', 'Thumbs.db', 'ehthumbs.db'];
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

Puush.prototype.multi = function(dirName, callback) {
  var self = this;
  if (typeof dirName === 'undefined')
    throw new Error('dir name is not defined.');
  else {
    getFiles(dirName, self.IGNORED_FILES, function(files) {
      var data = [], asyncCounter = 0;
      async.forEach(files, function(file) {
        upload('/' + dirName + '/' + file, self.API_URL, self.API_KEY, function(err, result) {
          if (err) console.log(err);
          else data.push(result);
          if (asyncCounter >= files.length) callback(data);
        });
      });
    });
  }
};

function getFiles(dirName, ignoredFiles, callback) {
  fs.readdir(dirName, function(err, files) {
    if (err) throw new Error(err);
    else {
      var data = [], asyncCounter = 0;
      async.forEach(files, function(file) {
        if (ignoredFiles.indexOf(file) === -1 && !fs.lstatSync(dirName + '/' + file).isDirectory()) data.push(file);
        asyncCounter++;
        if (asyncCounter >= files.length) callback(data);
      });
    }
  });
}

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
