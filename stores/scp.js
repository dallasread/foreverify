// CONFIGURATION
// {
//     dir: '/local/path',
//     debug: true,
//     removeOriginals: true,
//     concurrency: 3,
//     store: {
//         type: 'scp',
//         host: 'sync.foreverify.com',
//         username: 'dread',
//         password: 'daersallad',
//         path: '/remote/path'
//     }
// }

var BaseStore = require('./base'),
    SCP = require('scp2').Client;

var SCPStore = BaseStore.generate(function SCPStore(options) {
    var _ = this;

    _.supercreate(options);

    _.scp = new SCP({
        host: _.host,
        username: _.username,
        password: _.password
    });
});

SCPStore.definePrototype({
    upload: function upload(path, done) {
        var _ = this,
            newPath = _.getRemotePath(path);

        _.scp.upload(path, newPath, function(err) {
            typeof done === 'function' && done(newPath);
        });
    }
});

module.exports = SCPStore;
