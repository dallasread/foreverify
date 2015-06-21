var Generator = require('generate-js'),
    Helpers = require('./helpers'),
    glob = require('glob'),
    fs = require('fs'),
    rimraf = require('rimraf');

var Watcher = Generator.generate(function Watcher(options) {
    var _ = this;

    _.defineProperties(options);

    _.defineProperties({
        writable: true
    }, {
        parsersInProgress: 0,
        dirsToCleanup: []
    });
});

Watcher.definePrototype({
    start: function start(paths) {
        var _ = this,
            i;

        paths = paths || _.paths;

        if (paths.length) {
            for (i = paths.length - 1; i >= 0; i--) {
                _.parseDir(paths[i]);
            }
        } else {
            _.done();
        }
    },

    parseDir: function parseDir(dir, pattern) {
        var _ = this,
            paths,
            path;

        if (!pattern) {
            pattern = Helpers.getPattern(dir);
        }

        paths = glob.sync(Helpers.dynamicPath(dir));

        if (paths.length) {
            for (var i = paths.length - 1; i >= 0; i--) {
                path = paths[i];

                if (fs.existsSync(path)) {
                    if (fs.lstatSync(path).isDirectory()) {
                        _.dirsToCleanup.push(path);
                    } else {
                        _.parseFile({
                            path: path,
                            vars: Helpers.getVarsFromPath(path, pattern)
                        });
                    }
                }
            }
        } else {
            _.done();
        }
    },

    parseFile: function parseFile(file) {
        var _ = this;

        _.parsersInProgress++;

        _.store.parse(file, function() {
            _.store.upload(file, function(newPath) {
                if (_.removeOriginals) {
                    _.remove(file, function() {
                        _.done();
                    });
                } else {
                    _.done();
                }
            });
        });
    },

    remove: function remove(file, done) {
        fs.unlink(file.path, function() {
            typeof done === 'function' && done();
        });
    },

    cleanup: function cleanup(done) {
        var _ = this;

        _.parsersInProgress = 0;

        if (_.removeOriginals) {
            for (var i = _.dirsToCleanup.length - 1; i >= 0; i--) {
                rimraf.sync(_.dirsToCleanup[i]);
            }

            _.dirsToCleanup = [];
        }

        typeof done === 'function' && done();
    },

    done: function done() {
        var _ = this;

        _.parsersInProgress--;

        if (_.parsersInProgress <= 0) {
            _.cleanup(function() {
                setTimeout(function() {
                    _.start();
                }, _.pollInterval);
            });
        }
    }
});

module.exports = Watcher;
