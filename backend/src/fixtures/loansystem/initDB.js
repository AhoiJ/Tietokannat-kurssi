import mysql from 'mysql2/promise';

import { loanConnectionSettings } from '../../loanSettings';

export default async () => {
  const conn = await mysql.createConnection(loanConnectionSettings);
  try {
    await conn.execute(`
        SELECT *
        FROM henkilo
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: henkilo');
      await conn.execute(`
        CREATE TABLE henkilo (
          id int UNSIGNED NOT NULL AUTO_INCREMENT,
          fname varchar(45) NOT NULL,
          lname varchar(45) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM lainaus
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: lainaus');
      await conn.execute(`
        CREATE TABLE lainaus (
          id int UNSIGNED AUTO_INCREMENT,
          laite_id int UNSIGNED NOT NULL,
          lainaaja_id int UNSIGNED NOT NULL,
          luovutus_id int UNSIGNED NOT NULL,
          vastaanotto_id int ,
          lainaus_pvm DATE,
          era_pvm DATE,
          palautus_pvm DATE,
          kunto_palautettaessa varchar(45) NOT NULL,
          PRIMARY KEY (id, laite_id, lainaaja_id, luovutus_id, vastaanotto_id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM laite
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: laite');
      await conn.execute(`
        CREATE TABLE laite (
          id int UNSIGNED AUTO_INCREMENT,
          sarjanumero varchar(45) NOT NULL,
          kunto varchar(45) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM laite_kategoria
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: laite_kategoria');
      await conn.execute(`
        CREATE TABLE laite_kategoria (
          id int UNSIGNED AUTO_INCREMENT,
          nimi varchar(45) NOT NULL,
          tyyppi varchar(45) NOT NULL,
          kuvaus varchar(45) NOT NULL,
          PRIMARY KEY (id)
        )
      `);
      console.log('...success!');
    }
  }
  try {
    await conn.execute(`
        SELECT *
        FROM vastuu_henkilo
      `);
  } catch (error) {
    // If table does not exist, create it
    if (error.errno === 1146) {
      console.log('Initializing table: vastuu_henkilo');
      await conn.execute(`
        CREATE TABLE vastuu_henkilo (
          henkilo_id int UNSIGNED NOT NULL,
          laite_kategoria_id int UNSIGNED NOT NULL,
          PRIMARY KEY (henkilo_id, laite_kategoria_id)
        )
      `);
      console.log('...success!');
    }
  }
};
