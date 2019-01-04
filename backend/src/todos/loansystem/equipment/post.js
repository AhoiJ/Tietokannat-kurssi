import mysql from 'mysql2/promise';
import Router from 'koa-router';
import { equipmentsPath } from '../../../apis';
import { loanConnectionSettings } from '../../../loanSettings';

export default async (ctx) => {
  // eslint-disable-next-line camelcase
  const { kategoria_id, sarjanumero, kunto } = ctx.request.body;
  console.log('.post contains:', kategoria_id, sarjanumero, kunto);

  if (typeof sarjanumero === 'undefined') {
    ctx.throw(400, 'body.text is required');
  } else if (typeof sarjanumero !== 'string') {
    ctx.throw(400, 'body.done must be string');
  }

  try {
    const conn = await mysql.createConnection(loanConnectionSettings);

    // Insert a new laite
    const [status] = await conn.execute(`
            INSERT INTO laite (kategoria_id, sarjanumero, kunto)
            VALUES ( :kategoria_id, :sarjanumero, :kunto);
          `, { kategoria_id, sarjanumero, kunto });
    const { insertId } = status;

    // Get the new laite
    const [data] = await conn.execute(`
            SELECT *
            FROM laite
            WHERE id = :id;
          `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(equipmentsPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new laite
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};
