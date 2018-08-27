const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

const token = jwt.sign({ exp:Math.floor(Date.now() / 1000) + (60 * 60), username: 'tamas' }, 's3cr3t');
console.log('Token ==> ', token);

function showCharacters(req, res) {
  let query;
  const collection = req.app.locals.collection;
  if (req.query.filter) {
    const filter = req.query.filter;
    query = collection.find({}).project({ [filter]: 1 }).toArray();
  } else {
    query = collection.find({}).toArray();
  }
  query.then(characters => res.status(200).json(characters)).catch(error => console.error(error));
}

function showOneCharacter(req, res) {
  const collection = req.app.locals.collection;
  const id = new ObjectID(req.params.id);
  const query = collection.findOne({ _id: id });
  query.then(character => res.status(200).json(character))
  .catch(error => console.error(error));
}

function addCharacter(req, res) {
  if (req.body) {
    characters.push({
      name: req.body.name,
      homeworld: req.body.homeworld
    });
  }
  return res.status(201).json(`Character ${req.body.name} added`);
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 's3cr3t', (error, decoded) => {
      if (error) {
        return res.status(401).send('Unauthorised');
      } else {
        next();
      }
    });
  } else {
    return res.status(403).send('No token provided.');
  }
}

module.exports = {
  showCharacters,
  showOneCharacter,
  addCharacter,
  authenticate
};