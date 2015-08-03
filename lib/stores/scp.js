var BaseStore = require('./base'),
    SCP = require('scp2').Client;

var SCPStore = BaseStore.generate(function SCPStore(options) {
    var _ = this;
    _.supercreate(options);
});

SCPStore.definePrototype({
    upload: function upload(file, done) {
        var _ = this,
            newPath = _.getRemotePath(file);

        var scp = new SCP({
            host: _.host,
            username: _.username,
            password: _.password
        });

        scp.upload(file.path, newPath, function(err) {
            typeof done === 'function' && done(newPath);
        });
    }
});

module.exports = SCPStore;
