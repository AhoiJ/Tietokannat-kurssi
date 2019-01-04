import mysql from 'mysql2/promise';
import { loanConnectionSettings } from '../../../loanSettings';


export default async (ctx) => {
  const { id } = ctx.params;
  const {
    // eslint-disable-next-line camelcase
    laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm,
    // eslint-disable-next-line camelcase
    kunto_palautettaessa,
  } = ctx.request.body;

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

    // Update the loan
    const [status] = await conn.execute(`
             UPDATE lainaus
             SET laite_id = :laite_id, lainaaja_id = :lainaaja_id, luovutus_id = :luovutus_id, vastaanotto_id = :vastaanotto_id, lainaus_pvm = :lainaus_pvm, era_pvm = :era_pvm, palautus_pvm = :palautus_pvm, kunto_palautettaessa = :kunto_palautettaessa
             WHERE id = :id;
           `, {
      // eslint-disable-next-line camelcase
      id,
      laite_id,
      lainaaja_id,
      luovutus_id,
      vastaanotto_id,
      lainaus_pvm,
      era_pvm,
      palautus_pvm,
      kunto_palautettaessa,
    });

    if (status.affectedRows === 0) {
      // If the resource does not already exist, create it
      await conn.execute(`
            INSERT INTO lainaus(laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm, kunto_palautettaessa)
            VALUES (:laite_id, :lainaaja_id, :luovutus_id, :vastaanotto_id, :lainaus_pvm, :era_pvm, :palautus_pvm, :kunto_palautettaessa);
          `, {
        // eslint-disable-next-line camelcase
        id,
        laite_id,
        lainaaja_id,
        luovutus_id,
        vastaanotto_id,
        lainaus_pvm,
        era_pvm,
        palautus_pvm,
        kunto_palautettaessa,
      });
    }

    // Get the user
    const [data] = await conn.execute(`
             SELECT *
             FROM lainaus
             WHERE id = :id;
           `, { id });

    // Return the resource
    ctx.body = data[0];
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  }
};
