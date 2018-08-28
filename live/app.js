const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const url = `mongodb://${settings.host}:${settings.port}`;

app.use(bodyParser.json());

const options = {
  origin: 'http://localhost:8080'
};
app.use(cors(options));

router.get('/characters', routes.showCharacters);
router.get('/characters/:id', routes.showOneCharacter);
router.post('/characters', routes.addCharacter);
router.put('/characters/:id', routes.updateCharacter);
router.patch('/characters/:id', routes.patchCharacter);
router.delete('/characters', routes.authenticate, routes.deleteAllCharacters);
router.delete('/characters/:id', routes.authenticate, routes.deleteCharacter);

app.use('/api', router);

MongoClient.connect(url, { useNewUrlParser: true })
.then(client => {
  const db = client.db(settings.db);
  const collection = db.collection(settings.collection);
  app.locals.collection = collection;
  app.listen(port, () => console.info(`Application is listening on port ${port}`));
}).catch(error => console.error(error));