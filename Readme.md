### Goals
- Doesn't delete files when changed, only adds
- Fully encrypted data over the wire
- Shareable private galleries
- Runs in the background with no extra work from user
- Open: plug in your own data source & data store

### To Run
- `npm i`
- `node setup`
- `node .`
- Your files should now sync!

### Running Forever
- If you want to continually listen for new files, `npm i -g forever`
- `forever start /path/to/foreverify`

### Todo
- Add Indexers
- Add Web Interface

### Help
- `groupadd foreverify`
- `useradd -s /bin/bash -m -d /home/tmp/dread -g foreverify dread`
