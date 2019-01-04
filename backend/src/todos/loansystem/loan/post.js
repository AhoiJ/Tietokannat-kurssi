import mysql from 'mysql2/promise';
import Router from 'koa-router';
import { loansPath } from '../../../apis/index';
import { loanConnectionSettings } from '../../../loanSettings';


export default async (ctx) => {
  const {
    // eslint-disable-next-line camelcase
    laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm,
    // eslint-disable-next-line camelcase
    kunto_palautettaessa,
  } = ctx.request.body;
  console.log('.post contains:', laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm, kunto_palautettaessa);

  /* if (typeof text === 'undefined') {
    ctx.throw(400, 'body.text is required');
  } else if (typeof text !== 'string') {
    ctx.throw(400, 'body.done must be string');
  }
   */

  try {
    const conn = await mysql.createConnection(loanConnectionSettings);

    // Insert a new loan
    const [status] = await conn.execute(`
            INSERT INTO lainaus (laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm, kunto_palautettaessa)
            VALUES (:laite_id, :lainaaja_id, :luovutus_id, :vastaanotto_id, :lainaus_pvm, :era_pvm, :palautus_pvm, :kunto_palautettaessa);
          `, {
      laite_id,
      lainaaja_id,
      luovutus_id,
      vastaanotto_id,
      lainaus_pvm,
      era_pvm,
      palautus_pvm,
      kunto_palautettaessa,
    });
    const { insertId } = status;

    // Get the new loan
    const [data] = await conn.execute(`
            SELECT *
            FROM lainaus
            WHERE id = :id;
          `, { id: insertId });

    // Set the response header to 201 Created
    ctx.status = 201;

    // Set the Location header to point to the new resource
    const newUrl = `${ctx.host}${Router.url(loansPath, { id: insertId })}`;
    ctx.set('Location', newUrl);

    // Return the new loan
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};
