import mysql from 'mysql2/promise';
import { loanConnectionSettings } from '../../../loanSettings';


export default async (ctx) => {
  const { id } = ctx.params;
  const { fname, lname } = ctx.request.body;
  // console.log('.put id contains:', id);
  // console.log('.put text contains:', text);
  // console.log('.put done contains:', done);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
    /*
  } else if (typeof text === 'undefined') {
    ctx.throw(400, 'body.text is required');
  } else if (typeof text !== 'string') {
    ctx.throw(400, 'body.done must be string');
  } else if (typeof done === 'undefined') {
    ctx.throw(400, 'body.done is required');
  } else if (typeof done !== 'boolean') {
    ctx.throw(400, 'body.done must be boolean');
*/
  }

  try {
    const conn = await mysql.createConnection(loanConnectionSettings);

    // Update the user
    const [status] = await conn.execute(`
             UPDATE henkilo
             SET fname = :fname, lname = :lname
             WHERE id = :id;
           `, { id, fname, lname });

    if (status.affectedRows === 0) {
      // If the resource does not already exist, create it
      await conn.execute(`
            INSERT INTO todos (id, text, done)
            VALUES (:id, :text, :done);
          `, { id, fname, lname });
    }

    // Get the user
    const [data] = await conn.execute(`
             SELECT *
             FROM henkilo
             WHERE id = :id;
           `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};
