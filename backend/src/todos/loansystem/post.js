import mysql from 'mysql2/promise';
import Router from 'koa-router';
import { usersPath } from '../../apis/index';
import { loanConnectionSettings } from '../../loanSettings';

// modify to take in henkilo data
export default async (ctx) => {
  const { text } = ctx.request.body;
  console.log('.post text contains:', text);

  if (typeof text === 'undefined') {
    ctx.throw(400, 'body.text is required');
  } else if (typeof text !== 'string') {
    ctx.throw(400, 'body.done must be string');
  }

  try {
    const conn = await mysql.createConnection(loanConnectionSettings);

    // Insert a new henkilo
    const [status] = await conn.execute(`
            INSERT INTO todos (text)
            VALUES (:text);
          `, { text });
    const { insertId } = status;

    // Get the new todo
    const [data] = await conn.execute(`
            SELECT *
            FROM todos
            WHERE id = :id;
          `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(todoPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new todo
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};