var Config = require('./config'),
    Watcher = require('./lib/watcher'),
    Store = require('./lib/stores/' + Config.store.type);

var w = Watcher.create({
    store: Store.create(Config.store),
    paths: Config.paths,
    removeOriginals: Config.removeOriginals,
    pollInterval: Config.pollInterval
});

w.start();
