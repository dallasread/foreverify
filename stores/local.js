// CONFIGURATION
// {
//     "dir": "/local/path",
//     "debug": true,
//     "removeOriginals": true,
//     "concurrency": 3,
//     "store": {
//         "type": "local",
//         "path": "/remote/path"
//     }
// }

var BaseStore = require('./base'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

var LocalStore = BaseStore.generate(function LocalStore(options) {
    var _ = this;
    _.supercreate(options);
});

LocalStore.definePrototype({
    upload: function upload(path, done) {
        var _ = this,
            newPath = _.getRemotePath(path);

        mkdirp(newPath.substring(0, newPath.lastIndexOf('/')), function() {
            fs.rename(path, newPath, function(err) {
                if (err) {
                    console.log('Error Moving File: ' + path + ' ~> ' + newPath + ' : ' + err);
                } else {
                    typeof done === 'function' && done(path, newPath);
                }
            });
        });
    }
});

module.exports = LocalStore;
