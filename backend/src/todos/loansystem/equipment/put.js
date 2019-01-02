import mysql from 'mysql2/promise';
import { loanConnectionSettings } from '../../../loanSettings';


export default async (ctx) => {
  const { id } = ctx.params;
  const { sarjanumero, kunto } = ctx.request.body;
  console.log('.put id contains:', id);
  console.log('.put sarjanumero contains:', sarjanumero);
  console.log('.put kunto contains:', kunto);

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

    // Update the equipment
    const [status] = await conn.execute(`
             UPDATE laite
             SET sarjanumero = :sarjanumero, kunto = :kunto
             WHERE id = :id;
           `, { id, sarjanumero, kunto });

    if (status.affectedRows === 0) {
      // If the resource does not already exist, create it
      await conn.execute(`
            INSERT INTO laite (id, sarjanumero, kunto)
            VALUES (:id, :sarjanumero, :kunto);
          `, { id, sarjanumero, kunto });
    }

    // Get the equipment
    const [data] = await conn.execute(`
             SELECT *
             FROM laite
             WHERE id = :id;
           `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};
