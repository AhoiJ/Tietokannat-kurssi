import mysql from 'mysql2/promise';
import { loanConnectionSettings } from '../../../loanSettings';

// ATM only deletes from lainaus, must add deletion and handling to other tables aswell
export default async (ctx) => {
  const { id } = ctx.params;
  console.log('.del id contains:', id);

  if (isNaN(id) || id.includes('.')) {
    ctx.throw(400, 'id must be an integer');
  }

  try {
    const conn = await mysql.createConnection(loanConnectionSettings);
    const [status] = await conn.execute(`
            DELETE FROM lainaus
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
};
