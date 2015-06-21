module.exports = {
    getPattern: function getPattern(dir) {
        return dir.split('/').map(function(a) {
            return a.indexOf('$') === -1 ? '' : a;
        });
    },

    getVarsFromPath: function getVarsFromPath(path, pattern) {
        var splitPath = path.split('/'),
            vars = {};

        for (var n = 0; n < pattern.length; n++) {
            if (pattern[n] !== '') {
                vars[pattern[n]] = splitPath[n];
            }
        }

        return vars;
    },

    dynamicPath: function dynamicPath(dir) {
        return dir.replace(/\/\$(.*?)\//g, '/*/') + '/**/*';
    }
};
