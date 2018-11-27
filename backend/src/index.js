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
import { todosGetAll, todosGetSingle, post } from './todos/index';
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
todos.put(todoPath, checkAccept, checkContent, koaBody, async (ctx) => {
  const { id } = ctx.params;
  const { text, done } = ctx.request.body;
  console.log('.put id contains:', id);
  console.log('.put text contains:', text);
  console.log('.put done contains:', done);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  } else if (typeof text === 'undefined') {
    ctx.throw(400, 'body.text is required');
  } else if (typeof text !== 'string') {
    ctx.throw(400, 'body.done must be string');
  } else if (typeof done === 'undefined') {
    ctx.throw(400, 'body.done is required');
  } else if (typeof done !== 'boolean') {
    ctx.throw(400, 'body.done must be boolean');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);

    // Update the todo
    const [status] = await conn.execute(`
           UPDATE todos
           SET text = :text, done = :done
           WHERE id = :id;
         `, { id, text, done: Number(done) });

    if (status.affectedRows === 0) {
      // If the resource does not already exist, create it
      await conn.execute(`
          INSERT INTO todos (id, text, done)
          VALUES (:id, :text, :done);
        `, { id, text, done: Number(done) });
    }

    // Get the todo
    const [data] = await conn.execute(`
           SELECT *
           FROM todos
           WHERE id = :id;
         `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});

// DELETE /resource/:id
todos.del(todoPath, async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(connectionSettings);
    const [status] = await conn.execute(`
          DELETE FROM todos
          WHERE id = :id;
        `, { id });

    if (status.affectedRows === 0) {
      // The row did not exist, return '404 Not found'
      ctx.status = 404;
    } else {
      // Return '204 No Content' status code for successful delete
      ctx.status = 204;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
});


app.use(test.routes());
app.use(test.allowedMethods());
app.use(todos.routes());
app.use(todos.allowedMethods());

// Start the server and keep listening on port until stopped
app.listen(port);

console.log(`App listening on port ${port}`);
