import mysql from 'mysql2/promise';
import Url from 'url';
import { loanConnectionSettings } from '../../loanSettings';

// ATM only works from henkilo, must add handling to other tables aswell
// added test so getall works for 2 tables
export default async (ctx) => {
  const url = Url.parse(ctx.url, true);
  const { sort } = url.query;

  const parseSortQuery = ({ urlSortQuery, whitelist }) => {
    let query = '';
    if (urlSortQuery) {
      const sortParams = urlSortQuery.split(',');

      query = 'ORDER BY ';
      sortParams.forEach((param, index) => {
        let trimmedParam = param;
        let desc = false;

        if (param[0] === '-') {
          // Remove the first character
          trimmedParam = param.slice(1);
          // Set descending to true
          desc = true;
        }

        // If parameter is not whitelisted, ignore it
        // This also prevents SQL injection even without statement preparation
        if (!whitelist.includes(trimmedParam)) return;

        // If this is not the first sort parameter, append ', '
        if (index > 0) query = query.concat(', ');

        // Append the name of the field
        query = query.concat(trimmedParam);

        if (desc) query = query.concat(' DESC');
      });
    }
    return query;
  };
  const orderBy = parseSortQuery({ urlSortQuery: sort, whitelist: ['id', 'text', 'done'] });

  try {
    const conn = await mysql.createConnection(loanConnectionSettings);
    const [data] = await conn.execute(`
          SELECT *
          FROM henkilo
          ${orderBy}
        `);

    // Return all henkilo data
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
  // Attempt at getting all data from multiple tables
  try {
    const conn = await mysql.createConnection(loanConnectionSettings);
    const [data] = await conn.execute(`
          SELECT *
          FROM lainaus
          ${orderBy}
        `);

    // Return all lainaus data
    ctx.body = data;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};
