const express = require('express');
const app = express();

const port = 3000;

// app.get('/', (req, res) => res.send('Hello there!'));
// app.post('/', (req, res) => res.send('HTTP POST in action'));
// app.all('/', (req, res) => res.send('All HTTP covered));
// app.route('/')
//   .get((req, res) => res.send('GET'))
//   .post((req, res) => res.send('POST'));

const router = express.Router();
router.get('/', (req, res) => res.send('Mountable'));
router.get('/message', (req, res) => res.send('Random message'));

app.use('/api', router);
app.listen(port, () => console.info(`Application is listening on port ${port}`));
