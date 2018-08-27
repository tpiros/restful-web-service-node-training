const express = require('express');
const app = express();
const router = express.Router();
const routes = require('./routes');
const bodyParser = require('body-parser');

const port = 3000;

app.use(bodyParser.json());
router.get('/characters', routes.showCharacters);
router.get('/characters/:id', routes.showOneCharacter)
router.post('/characters', routes.addCharacter);
app.use('/api', router);


app.listen(port, () => console.info(`Application is listening on port ${port}`));
