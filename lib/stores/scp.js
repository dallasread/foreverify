var BaseStore = require('./base'),
    Client = require('scp2').Client;

var SCPStore = BaseStore.generate(function SCPStore(options) {
    var _ = this;
    _.supercreate(options);
});

SCPStore.definePrototype({
    upload: function upload(file, done) {
        var _ = this,
            newPath = _.getRemotePath(file);

        var client = new Client({
            host: _.host,
            username: _.username,
            password: _.password
        });

        client.upload(file.path, newPath, function(err) {
            typeof done === 'function' && done(newPath);
        });
    }
});

module.exports = SCPStore;
