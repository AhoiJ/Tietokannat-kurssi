import mysql from 'mysql2/promise';
import { loanConnectionSettings } from '../../loanSettings';


export default async (ctx) => {
  try {
    const conn = await mysql.createConnection(loanConnectionSettings);
    const [data] = await conn.execute(`
          SELECT *
          FROM henkilo
        `);

    console.log('Data fetched:', data);

    // Tell the HTTP response that it contains JSON data encoded in UTF-8
    ctx.type = 'application/json; charset=utf-8';

    // Add stuff to response body
    ctx.body = { greeting: 'User List', data };
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};