var BaseStore = require('./base'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

var LocalStore = BaseStore.generate(function LocalStore(options) {
    var _ = this;
    _.supercreate(options);
});

LocalStore.definePrototype({
    upload: function upload(file, done) {
        var _ = this,
            newPath = _.getRemotePath(file);

        mkdirp(newPath, function() {
            fs.rename(file.path, newPath, function(err) {
                typeof done === 'function' && done(newPath);
            });
        });
    }
});

module.exports = LocalStore;
