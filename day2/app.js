const express = require('express');
const app = express();
const router = express.Router();
const routes = require('./routes');
const bodyParser = require('body-parser');
const settings = require('./settings');

const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${settings.host}:${settings.port}`;

const port = 3000;

app.use(bodyParser.json());
router.get('/characters', routes.showCharacters);
router.get('/characters/:id', routes.authenticate, routes.showOneCharacter)
router.post('/characters', routes.addCharacter);
app.use('/api', router);


MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
  const db = client.db(settings.db);
  const collection = db.collection(settings.collection);
  app.locals.collection = collection;
  app.listen(port, () => console.info(`Application is listening on port ${port}`));
}).catch(error => console.error(error));

