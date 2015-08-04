var stdio = require('stdio'),
    fs = require('fs'),
    questions = {},
    answers = {},
    stores = {
        local: {
            required: [
                'dir',
                'debug',
                'removeOriginals',
                'concurrency',
                'store.path'
            ]
        },
        s3: {
            required: [
                'dir',
                'debug',
                'removeOriginals',
                'concurrency',
                'store.bucket',
                'store.region',
                'store.accessKeyId',
                'store.secretAccessKey',
                'store.path'
            ]
        },
        scp: {
            required: [
                'dir',
                'debug',
                'removeOriginals',
                'concurrency',
                'store.host',
                'store.username',
                'store.password',
                'store.path'
            ]
        }
    },
    questionLookup = {
        dir: 'What is the local directory to be stored?',
        debug: 'Debug mode? (y/n)',
        removeOriginals: 'Should the originals be removed? (y/n)',
        concurrency: 'How many uploads should happen at the same time?'
    };

function askQuestions() {
    var field = Object.keys(questions)[0],
        question = questions[field];

    if (!question) {
        fs.writeFileSync('./config.json', JSON.stringify(answers, null, 2));
        return;
    }

    stdio.question(question, function (err, answer) {
        answer = question.indexOf('(y/n)') !== -1 ? /y|yes/.test(answer) : answer;

        if (field.indexOf('store.') !== -1) {
            answers.store[field.replace('store.', '')] = answer;
        } else {
            answers[field] = answer;
        }

        delete questions[field];
        askQuestions();
    });
}

stdio.question('How would you like to store your files (' + Object.keys(stores).join(', ') + ')?', function (err, key) {
    var store = stores[key],
        field;

    if (!store) {
        console.log('Please try again with a valid option.');
        return;
    }

    answers.store = {
        type: key
    };

    for (var i = 0; i < store.required.length; i++) {
        field = store.required[i];
        questions[field] = questionLookup[field] || field + '?';
    }

    askQuestions();
});

