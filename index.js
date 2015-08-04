var Generator = require('generate-js'),
    Path = require('path'),
    Stores = require('./stores'),
    fs = require('fs'),
    recursive = require('recursive-readdir'),
    watcher = require('watch'),
    exec = require('child_process').exec;

var Foreverify = Generator.generate(function Foreverify(options) {
    var _ = this;

    options.store = Stores[options.store.type].create(options.store);
    options.concurrency = parseInt(options.concurrency);

    _.defineProperties(options);

    _.defineProperties({
        files: [],
        processors: 0
    });
});

Foreverify.definePrototype({
    start: function start(dir) {
        var _ = this;

        recursive(dir || _.dir, function readTree(err, paths) {
            _.log('Detect Files: ' + _.dir);
            if (!dir) _.watch();

            for (var i = paths.length - 1; i >= 0; i--) {
                _.queue(paths[i]);
            }
        });
    },

    log: function log(str) {
        var _ = this;

        if (_.debug) {
            console.log(str);
        }
    },

    watch: function watch() {
        var _ = this;

        watcher.createMonitor(_.dir, {
            ignoreDotFiles: true
        }, function monitorDir(monitor) {
            _.monitor = monitor;
            _.log('Watch Dir: ' + _.dir);

            _.monitor.on('created', function fileCreated(path, stat) {
                if (fs.lstatSync(path).isDirectory()) {
                    _.log('Folder Created: ' + path);
                    _.start(path);
                } else {
                    _.log('File Created: ' + path);
                    _.queue(path);
                }
            });
        });
    },

    queue: function queue(path) {
        var _ = this,
            basename = Path.basename(path);

        if (basename[0] === '.') return;
        if (_.files.indexOf(path) !== -1) return;

        _.files.push(path);
        _.log('Added to Queue: ' + path);

        _.processQueue();
    },

    processQueue: function processQueue() {
        var _ = this;

        if (_.processors >= _.concurrency) return;

        var oldPath = _.files.splice(0, 1)[0];

        if (oldPath) {
            _.log('Processing File: ' + oldPath);
            _.processors++;

            _.store.upload(oldPath, function uploadFile(newPath) {
                if (_.removeOriginals) {
                    _.remove(oldPath, function() {
                        _.log('File Removed: ' + oldPath);
                        _.processComplete(oldPath, newPath);
                    });
                } else {
                    _.processComplete(oldPath, newPath);
                }
            });
        }
    },

    processComplete: function processComplete(oldPath, newPath) {
        var _ = this;

        _.log('Process Complete: ' + oldPath + ' ~> ' + newPath);
        _.processors--;
        _.processQueue();
    },

    remove: function remove(path, done) {
        exec('rm -rf ' + path.replace(/(["\s'$`\\])/g,'\\$1'), function removePath(err, stdout, stderr) {
            typeof done === 'function' && done();
        });
    },
});

module.exports = Foreverify;

if (!module.parent) {
    Foreverify.create(require('./config')).start();
}
