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
  query.then(character => {
    if (character.result.n > 0) {
      return res.status(200).json(character);
    } else {
      return res.status(404).json(`Character with id ${id} not found.`);
    }
  })
  .catch(error => console.error(error));
}

function addCharacter(req, res) {
  if (req.body) {
    const collection = req.app.locals.collection;
    const character = req.body;
    const query = collection.insert(character);
    query.then(character => {
      if (character.result.ok) {
        return res.status(201).json(`Character added ${JSON.stringify(character.ops)}`);
      } else {
        return res.status(400).json('Could not add data');
      }
    })
    .catch(error => console.error(error));
  } else {
    return res.status(403).json('Please specify some data');
  }
}

function updateCharacter(req, res) {
  if (req.body) {
    if (req.params.id) {
      const collection = req.app.locals.collection;
      const character = req.body;
      const id = new ObjectID(req.params.id);
      const query = collection.save({ _id: id, ...character });
      query.then(character => {
        console.log(character.result);
        if (character.result.n === 0) {
          return res.status(404).json(`Character with ${id} not found.`);
        } else if (character.result.n === 1 && character.result.nModified === 0) {
          return res.status(200).json(`Character with ${id} did not change.`);
        } else if (character.result.n === 1 && character.result.nModified === 1) {
          return res.status(201).json(`Character with ${id} updated.`);
        } else if (character.result.nModified === 1 &&  character.result.nModified === 0 && character.result.upserted) {
          return res.status(201).json(`Character with ${id} updated.`);
        } else {
          return res.status(200).json(`Character with ${id} created.`);
        }
      })
      .catch(error => console.error(error));
    }
  } else {
    return res.status(403).json(`Please specify some data`);
  }
}

function patchCharacter(req, res) {
  if (req.body) {
    if (req.params.id) {
      const collection = req.app.locals.collection;
      const character = req.body;
      const id = new ObjectID(req.params.id);
      const query = collection.update({ _id: id }, { $set: character });
      query.then(character => {
        if (character.result.n === 0) {
          return res.status(404).json(`Character with ${id} not found.`);
        } else {
          return res.status(204).json(`Character with ${id} patched.`);
        }
      })
      .catch(error => console.error(error));
    }
  } else {
    return res.status(403).json(`Please specify some data`);
  }
}

function deleteCharacter(req, res) {
  const collection = req.app.locals.collection;
  const id = new ObjectID(req.params.id);
  const query = collection.remove({ _id: id });
  query.then(character => {
    if (character.result.n === 0) {
      return res.status(404).json(`Character with ${id} not found.`);
    } else {
      return res.status(200).json(`Character with ${id} deleted.`);
    }
  })
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
  updateCharacter,
  patchCharacter,
  deleteCharacter,
  authenticate
};