const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());

const options = {
  origin: 'http://localhost:8080'
};
router.get('/characters', cors(options), routes.showCharacters);
router.post('/characters', routes.addCharacter);

router.get('/characters/:id', routes.showOneCharacter);


app.use('/api', router);

app.listen(port, () => console.info(`Application is listening on port ${port}`));