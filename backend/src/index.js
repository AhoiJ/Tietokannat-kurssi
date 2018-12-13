import 'babel-polyfill';
import Koa from 'koa';
import Router from 'koa-router';
import mysql from 'mysql2/promise';
import KoaBody from 'koa-bodyparser';
import Url from 'url';

import { connectionSettings } from './settings';
import { databaseReady } from './helpers';
import { initDB } from './fixtures';

import { testGet } from './apis/test/index';
import { loanGet } from './apis/loansystem/index';
import {
  todosGetAll, todosGetSingle, post, put, del,
} from './todos/index';
import {
  apiPath,
  todoPath,
  todosPath,
  equipmentsPath,
  loansPath,
  usersPath,
} from './apis/index';

import { checkAccept, checkContent } from './middleware/index';


// Initialize DB
(async () => {
  await databaseReady();
  await initDB();
})();

// The port that this server will run on, defaults to 9000
const port = process.env.PORT || 9000;

// Instantiate a Koa server
const app = new Koa();
const koaBody = new KoaBody();

// Instantiate routers
const test = new Router();
const todos = new Router();
const loansystem = new Router();


test.get(`${apiPath}/test`, testGet); // in test/get.js
loansystem.get(`${apiPath}/loansystem`, loanGet);// in loansystem/get.js

// GET /resource
todos.get(todosPath, todosGetAll, checkAccept); // Get All/ checkAccept function in /todos/getAll

// GET /resource/:id
todos.get(todoPath, todosGetSingle, checkAccept); // get resource by id  in  /todos/getSingle

// POST /resource
todos.post(todosPath, post, checkAccept, checkContent, koaBody); // POST is in /todos/post.js

// PUT /resource/:id
todos.put(todoPath, put, checkAccept, checkContent, koaBody); // PUT is in /todos/put.js

// DELETE /resource/:id
todos.del(todoPath, del);

app.use(test.routes());
app.use(test.allowedMethods());
app.use(todos.routes());
app.use(todos.allowedMethods());

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
