var BaseStore = require('./base');

var S3Store = BaseStore.generate(function S3Store(options) {
    var _ = this;
    _.supercreate(options);
});

S3Store.definePrototype({
    upload: function upload(file, done) {
        var _ = this;
        done();
    }
});

module.exports = S3Store;
