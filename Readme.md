### Expectations
- Fully encrypted data over the wire
- Doesn't delete, only adds
- Shareable private galleries
- Indexed
- Open: plug in your own server

### To Run
- `npm i`
- `cp config.example.js config.js`
- `node watch.js`
- drop files in `./tmp/`
- should appear in `./storage/`

### Todo
- Add S3 Store
- Add Indexers
- Add Web Interface

### Help
- `groupadd foreverify`
- `useradd -s /bin/bash -m -d /home/tmp/dread -g foreverify dread`
