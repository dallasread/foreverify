module.exports = {
    paths: ['./tmp'],
    removeOriginals: true,
    pollInterval: 30 * 60 * 1000,
    store: {
        type: 'local',
        path: './storage'
    }
};
