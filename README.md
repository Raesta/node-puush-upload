node-puush-upload
======

Node package for uploading screenshots to [puush](http://puush.me/).

---
* [Puush](#puushapikey) ([apiKey]) - Constructor, apiKey is required.
* [simple](#simplefilename--callback) (filename [, callback]) - Upload file. Maximum filesize for free account: 272629051 bytes

### Example
```javascript
var Puush = require('puush');

var puush = new Puush('YOURAPIKEY');
```

---
### `Puush(apiKey)`
Constructor, apiKey is required.

---
#### `simple(filename, callback)`
Upload a file.  
Maximum file size for free account: 260MB-708B-filename.length,  
if your filename is only 1 character, then it is: 272629051 bytes

##### Result from callback:
```javascript
{
  id: 123478,  // uploaded file id
  url: 'http://puu.sh/x/y' // download url
}
```

### Todo
- Multi (dir [, callback]) // Multiple upload with folder
