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
import {
  todosGetAll, todosGetSingle, post, put, del,
} from './todos/index';
import {
  apiPath,
  todoPath,
  todosPath,
} from './apis/index';


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


test.get(`${apiPath}/test`, testGet); // in test/get.js

// Middleware for checking accept headers
const checkAccept = async (ctx, next) => {
  console.log('checkAccept');
  // If client does not accept 'application/json' as response type, throw '406 Not Acceptable'
  if (!ctx.accepts('application/json')) {
    ctx.throw(406);
  }
  // Set the response content type
  ctx.type = 'application/json; charset=utf-8';
  // Move to next middleware
  await next();
};

// Middleware for checking request body content
const checkContent = async (ctx, next) => {
  console.log('checkContent');
  // Check that the request content type is 'application/json'
  if (!ctx.is('application/json')) {
    ctx.throw(415, 'Request must be application/json');
  }
  // Move to next middleware
  await next();
};

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
