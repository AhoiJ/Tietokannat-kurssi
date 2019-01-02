import 'babel-polyfill';
import Koa from 'koa';
import Router from 'koa-router';
import mysql from 'mysql2/promise';
import KoaBody from 'koa-bodyparser';
import Url from 'url';

import { connectionSettings } from './settings';
import { loanConnectionSettings } from './loanSettings';
import { databaseReady } from './helpers';
import { loanDataBaseReady } from './helpers/loansystem/index';
import { initloanDB } from './fixtures/loansystem/index';
// import { initDB } from './fixtures';

import { testGet } from './apis/test/index';
import { loanGetUser, loanGetEquipment, loanGetLoans } from './apis/loansystem/index';
import {
  todosGetAll, todosGetSingle, post, put, del,
} from './todos/index';
import {
  userGetAll, userGetSingle, userPost, userDel, userPut,
} from './todos/loansystem/user/index';
import {
  equipmentGetAll, equipmentGetSingle, equipmentPost, equipmentDel, equipmentPut,
} from './todos/loansystem/equipment/index';
import {
  loanGetAll, loanGetSingle, loanPost, loanDel, loanPut,
} from './todos/loansystem/loan/index';
import {
  apiPath,
  todoPath,
  todosPath,
  usersPath,
  loansPath,
  equipmentsPath,
  userPath,
  loanPath,
  equipmentPath,
} from './apis/index';

// import { checkAccept, checkContent } from './middleware/index';
import { loanCheckAccept, loanCheckContent } from './middleware/loansystem/index';

// Initialize DB
(async () => {
  // await databaseReady();
//  await initDB();
  await loanDataBaseReady();
  await initloanDB();
})();

// The port that this server will run on, defaults to 9000
const port = process.env.PORT || 9000;

// Instantiate a Koa server
const app = new Koa();
const koaBody = new KoaBody();

// Instantiate routers
// const test = new Router();
// const todos = new Router();
const loansystem = new Router();


// test.get(`${apiPath}/test`, testGet); // in test/get.js
// loansystem.get(`${apiPath}/users`, loanGetUser);// in loansystem/getUser.js
// loansystem.get(`${apiPath}/equipments`, loanGetEquipment);
// loansystem.get(`${apiPath}/loans`, loanGetLoans);

// GET /resource
// todos.get(todosPath, todosGetAll, checkAccept); // Get All/ checkAccept function in /todos/getAll
loansystem.get(usersPath, userGetAll, loanCheckAccept);
loansystem.get(loansPath, loanGetAll, loanCheckAccept);
loansystem.get(equipmentsPath, equipmentGetAll, loanCheckAccept);

// GET /resource/:id
// todos.get(todoPath, todosGetSingle, checkAccept); // get resource by id  in  /todos/getSingle
loansystem.get(userPath, userGetSingle, loanCheckAccept);
loansystem.get(equipmentPath, equipmentGetSingle, loanCheckAccept);
loansystem.get(loanPath, loanGetSingle, loanCheckAccept);

// POST /resource
// todos.post(todosPath, post, checkAccept, checkContent, koaBody); // POST is in /todos/post.js
loansystem.post(usersPath, loanCheckAccept, loanCheckContent, koaBody, userPost);
loansystem.post(equipmentsPath, loanCheckAccept, loanCheckContent, koaBody, equipmentPost);
loansystem.post(loansPath, loanCheckAccept, loanCheckContent, koaBody, loanPost);

// PUT /resource/:id
// todos.put(todoPath, put, checkAccept, checkContent, koaBody); // PUT is in /todos/put.js
loansystem.put(userPath, loanCheckAccept, loanCheckContent, koaBody, userPut);
loansystem.put(equipmentPath, loanCheckAccept, loanCheckContent, koaBody, equipmentPut);
loansystem.put(loanPath, loanCheckAccept, loanCheckContent, koaBody, loanPut);

// DELETE /resource/:id
// todos.del(todoPath, del);
loansystem.del(userPath, userDel);
loansystem.del(equipmentPath, equipmentDel);
loansystem.del(loanPath, loanDel);

// app.use(test.routes());
// app.use(test.allowedMethods());
// app.use(todos.routes());
// app.use(todos.allowedMethods());
app.use(loansystem.routes());
app.use(loansystem.allowedMethods());

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
