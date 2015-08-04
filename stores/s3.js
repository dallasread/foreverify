// CONFIGURATION
// {
//     dir: '/local/path',
//     debug: true,
//     removeOriginals: true,
//     concurrency: 3,
//     store: {
//         type: 's3',
//         bucket: 'yourBucket',
//         region: 'us-east-1',
//         accessKeyId: 'secret',
//         secretAccessKey: 'secret',
//         path: 'remote/path'
//     }
// };

var BaseStore = require('./base'),
    AWS = require('aws-sdk'),
    fs = require('fs');

var S3Store = BaseStore.generate(function S3Store(options) {
    var _ = this;

    options.bucket = new AWS.S3({ params: {
        Bucket: options.bucket
    }});

    AWS.config.update({
        accessKeyId: _.accessKeyId,
        secretAccessKey: _.secretAccessKey,
        region: 'us-west-1'
    });

    _.supercreate(options);
});

S3Store.definePrototype({
    upload: function upload(path, done) {
        var _ = this,
            newPath = _.getRemotePath(path);

        _.bucket.upload({
            Key: newPath,
            Body: fs.readFileSync(path)
        }, function (err, data) {
            if (err) {
                console.log('Error Uploading to S3: ', err);
            } else {
                typeof done === 'function' && done(newPath);
            }
        });
    }
});

module.exports = S3Store;
