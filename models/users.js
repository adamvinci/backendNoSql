const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('node:path');
const { parse, serialize } = require('../utils/json');

const jwtSecret = 'ilovemymovies!';
const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;

const jsonDbPath = path.join(__dirname, '/../data/users.json');

const defaultUsers = [
  {
    id: 1,
    username: 'guest',
    password: bcrypt.hashSync('guest', saltRounds),
    nbePoint:0,
    nbeGameJoue:0,
    moyennErreur :0,
  },
];

async function login(username, password) {
  const userFound = readOneUserFromUsername(username);
  if (!userFound) return undefined;

  const passwordMatch = await bcrypt.compare(password, userFound.password);
  if (!passwordMatch) return undefined;

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );
  const {id} = userFound;
  const authenticatedUser = {
    username,
    token,
    id,
  };

  return authenticatedUser;
}

async function register(username, password) {
  const userFound = readOneUserFromUsername(username);
  if (userFound) return undefined;

  const user=await createOneUser(username, password);

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );
  const {id} = user;
  const authenticatedUser = {
    username,
    token,
    id
  };

  return authenticatedUser;
}

function readOneUserFromUsername(username) {
  const users = parse(jsonDbPath, defaultUsers);
  const indexOfUserFound = users.findIndex((user) => user.username === username);
  if (indexOfUserFound < 0) return undefined;

  return users[indexOfUserFound];
}

async function createOneUser(username, password) {
  const users = parse(jsonDbPath, defaultUsers);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const createdUser = {
    id: getNextId(),
    username,
    password: hashedPassword,
    nbePoint:0,
    nbeGameJoue:0,
    moyennErreur :0,
  };

  users.push(createdUser);

  serialize(jsonDbPath, users);

  return createdUser;
}

function getNextId() {
  const users = parse(jsonDbPath, defaultUsers);
  const lastItemIndex = users?.length !== 0 ? users.length - 1 : undefined;
  if (lastItemIndex === undefined) return 1;
  const lastId = users[lastItemIndex]?.id;
  const nextId = lastId + 1;
  return nextId;
}
function getPoint(id) {
  const idAsNumber = parseInt(id, 10);
  const users = parse(jsonDbPath, defaultUsers);
  const indexOfUserFound = users.findIndex((user) => user.id === idAsNumber);
  if (indexOfUserFound < 0) return undefined;

  const points={
    point:users[indexOfUserFound].nbePoint,
    nbeGameJoue:users[indexOfUserFound].nbeGameJoue,
    moyennErreur:users[indexOfUserFound].moyennErreur,
  }
  return points;
}

function addPoint(nbePoint,nbeErreu,userId){
  const users = parse(jsonDbPath, defaultUsers);
  const indexOfUserFound = users.findIndex((user) => user.id === userId);
  if (indexOfUserFound < 0) return undefined;
  users[indexOfUserFound].nbeGameJoue+=1;
  users[indexOfUserFound].nbePoint += parseInt(nbePoint,10);
  users[indexOfUserFound].moyennErreur += parseInt(nbeErreu,10) ;
  serialize(jsonDbPath,users);
 
return   users[indexOfUserFound];
}

function getMorePoints(){
  const users = parse(jsonDbPath, defaultUsers);
  const ranking = users.sort(mycomparator);
 return ranking;
}

function mycomparator(a,b) {
  return parseInt(b.nbePoint, 10) - parseInt(a.nbePoint, 10);
}
module.exports = {
  login,
  register,
  readOneUserFromUsername,
  getPoint,
  addPoint,
  getMorePoints,
};