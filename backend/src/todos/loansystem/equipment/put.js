import mysql from 'mysql2/promise';
import { loanConnectionSettings } from '../../../loanSettings';


export default async (ctx) => {
  const { id } = ctx.params;
  // eslint-disable-next-line camelcase
  const { kategoria_id, sarjanumero, kunto } = ctx.request.body;
  console.log('.put id contains:', id);
  console.log('put.kategoria_id contains:', kategoria_id);
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
             SET kategoria_id = :kategoria_id, sarjanumero = :sarjanumero, kunto = :kunto
             WHERE id = :id;
           `, {
      id, kategoria_id, sarjanumero, kunto,
    });

    if (status.affectedRows === 0) {
      // If the resource does not already exist, create it
      await conn.execute(`
            INSERT INTO laite (id, kategoria_id, sarjanumero, kunto)
            VALUES (:id, :kategoria_id, :sarjanumero, :kunto);
          `, {
        id, kategoria_id, sarjanumero, kunto,
      });
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
