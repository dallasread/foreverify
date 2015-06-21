var Generator = require('generate-js');

var BaseStore = Generator.generate(function BaseStore(options) {
    var _ = this;

    _.defineProperties({
        writable: true
    }, options);
});

BaseStore.definePrototype({
    upload: function upload(file, done) {
        typeof done === 'function' && done(null);
    },

    parse: function parse(file, done) {
        typeof done === 'function' && done(null);
    },

    getRemotePath: function getRemotePath(file) {
        var _ = this,
            newPath = _.path,
            pathSplit = file.path.split('/'),
            timestamp = new Date().getTime() + Math.round(Math.random() * 10000),
            fileName = timestamp + '.' + pathSplit[pathSplit.length - 1],
            regex;

        for (var key in file.vars) {
            regex = new RegExp('\\' + key, 'g');
            newPath = newPath.replace(regex, file.vars[key]);
        }

        return [newPath, fileName].join('/');
    }
});

module.exports = BaseStore;
