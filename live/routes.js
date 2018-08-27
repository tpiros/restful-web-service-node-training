const characters = require('./characters');

function showCharacters(req, res) {
  if (req.query.filter) {
    const filter = req.query.filter;
    const filtered = characters.map(character => character[filter]);
    return res.status(200).json(filtered);
  }
  return res.status(200).json(characters);
}

function showOneCharacter(req, res) {
  const id = parseInt(req.params.id);
  const character = characters.filter(character => character.id === id);
  return res.status(200).json(character);
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

module.exports = {
  showCharacters,
  showOneCharacter,
  addCharacter
};