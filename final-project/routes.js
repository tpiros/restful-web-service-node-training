const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');

function showCharacters(req, res) {
  let query;
  const collection = req.app.locals.collection;
  if (req.query.filter) {
    const filter = req.query.filter;
    query = collection.find({}).project({ [filter]: 1, _id: 0 }).toArray();
  } else {
    query = collection.find({}).toArray();
  }
  query
    .then(characters => res.status(200).json(characters))
    .catch(error => console.error(error));
}

function showOneCharacter(req, res) {
  const collection = req.app.locals.collection;
  const id = ObjectId(req.params.id);
  // const query = { _id: id };
  // const execute = collection.findOne(query);
  // execute.then(character => res.status(200).json(character));
  const query = collection.findOne({ _id: id });
  query
    .then(character => {
      if (character) {
        return res.status(200).json(character);
      } else {
        return res.status(404).json(`Character with ${id} not found.`);
      }
    })
    .catch(error => console.error(error));
}

function addCharacter(req, res) {
  if (req.body) {
    const collection = req.app.locals.collection;
    const character = req.body;
    const query = collection.insertOne(character);
    query.then(character => {
      if (character.result.ok) {
        return res.status(201).json(`Character added ${JSON.stringify(character.ops)}`);
      } else {
        return res.status(400).json('Could not add data');
      }
    }).catch(error => console.error(error));
  } else {
    return res.status(403).json('Please specify some payload');
  }
}

function updateCharacter(req, res) {
  if (req.body && req.params.id) {
    const collection = req.app.locals.collection;
    const character = req.body;
    const id = new ObjectId(req.params.id);
    const query = collection.replaceOne({ _id: id }, { ...character });
    query.then(character => {
      if (character.result.n === 1) {
        return res.status(200).json(`Character with ${id} updated`);
      } else {
        return res.status(404).json(`Character with ${id} not found.`);
      }
    }).catch(error => console.error(error));
  } else {
    return res.status(403).json(`Please specify a payload`);
  }
}

function patchCharacter(req, res) {
  if (req.body && req.params.id) {
    const collection = req.app.locals.collection;
    const payload = req.body;
    const id = new ObjectId(req.params.id);
    const query = collection.updateOne({ _id: id }, { $set: payload });
    query.then(character => {
      if (character.result.n === 0) {
        return res.status(404).json(`Character with ${id} not found.`);
      } else {
        return res.status(204).json();
      }
    }).catch(error => console.error(error));
  } else {
    return res.status(403).json(`Please specify some data`);
  }
}

function deleteCharacter(req, res) {
  const collection = req.app.locals.collection;
  const id = new ObjectId(req.params.id);
  const query = collection.remove({ _id: id });
  query.then(character => {
    if (character.result.n === 0) {
      return res.status(404).json(`Character with ${id} not found.`);
    } else {
      return res.status(200).json(`Character with ${id} deleted.`)
    }
  }).catch(error => console.error(error));
}

function deleteAllCharacters(req, res) {
  const collection = req.app.locals.collection;
  const query = collection.deleteMany({});
  query
    .then(character => res.status(200).json(`Characters collection deleted. (Deleted ${character.deletedCount} documents)`))
    .catch(error => console.error(error));
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 's3cr3t', (error, decoded) => {
      if (error) {
        return res.status(401).send('Unauthorised');
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send('No token provided.');
  }
}

module.exports = {
  showCharacters,
  showOneCharacter,
  addCharacter,
  updateCharacter,
  patchCharacter,
  deleteCharacter,
  deleteAllCharacters,
  authenticate
};