const express = require('express');
const app = express();

const port = 3000;

// app.use(express.static('images'));
app.use('/images', express.static('images'));

app.listen(port, () => console.info(`Application is listening on port ${port}`));
