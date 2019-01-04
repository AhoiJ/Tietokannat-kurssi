## Lainausjärjestelmä

----

## Tässä dokumentissa

1. Johdanto
2. Apis kansio
3. Fixtures kansio
4. Helpers kansio
5. Middleware kansio
6. Todos kansio
7. Index.js
8. LoanSettings.js
9. Liitteet

----

### Johdanto
Loansystemin käynnistäessä taulut luodaan tietokantaan, mutta niissä ei ole dataa. Data täytyy käydä insertoimassa MyWebSQL:ssä. Esimerkkidata löytyy tämän tiedoston lopussa.
Kaikki loansystem:in käyttämät tiedostot löytyvät loansystem alikansiosta.

### apis kansio
Apis kansiossa on lainausjärjestelmän testauksessa käytetyt get-funktiot.

### fixtures kansio
Fixtures kansio sisältää initDB tiedoston joka ajetaan aina käynnistyksen yhteydessä.
InitDB tarkistaa onko taulut olemassa, jossei ole se luo ne.

### helpers kansio
Helpers kansio sisältää dataBaseReady tiedoston, joka ajetaan käynnistyksen yhteydessä.
Se estää muita asynkronisia funktioita toimimasta ennen kuin tietokanta on toimintavalmis.

### middleware kansio
Middlewaressa on kaksi tiedostoa, checkAccept ja checkContent.
Nämä tiedostot tarkistavat hyväksyykö client response tyyppiä 'application/json' ja onko request content type samaa.

### todos kansio
Todos kansio sisältää kolme alikansiota, equipment, loan ja user. Nämä kaikki sisältävät jokaiselle taululle omat getAll, getSingle, post, put ja del funktiot.
###### getAll
getAll - funktio hakee pyydetystä taulusta kaikki tiedot. Se sisältää myös metodin jolla listan hakemisjärjestystä voi muuttaa.
###### getSingle
getSingle - funktio hakee taulusta yhden merkinnän tiedot id:n perusteella.
###### post
post - funktio hoitaa uuden sisällön lisäämisen tauluihin.
###### put
put - funktiolla voidaan aiempaa sisältöä muokata. Jos sisällön muokkauksessa referensoi id:tä jota ei vielä ole taulukossa, put - funktio luo sellaisen kohdan taulukkoon.
###### del 
del - funktio poistaa pyynnössä id:llä määritellyn kohdan taulukosta

### Index.js
Tämä repositorion juuressa oleva index.js kutsuu kaikkia työssä käytettyjä funktioita.

### loanSettings.js
loanSettings sisältää tietokannan käynnistyksessä tarvittavat tiedot.

### Liitteet

insert into henkilo (id, fname, lname) values ("1", "Jere", "Aho");
insert into henkilo (id, fname, lname) values ("2", "Manu", "Maiskuttelija");
insert into henkilo (id, fname, lname) values ("3", "pööpö", "pööpöilijä");

insert into laite (id, kategoria_id, sarjanumero, kunto) values ("1", "1", "12345", "hyvä");
insert into laite (id, kategoria_id, sarjanumero, kunto) values ("2", "2", "67891", "ok");

insert into lainaus (id, laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm, kunto_palautettaessa) values ("1", "1", "1", "2", "3", "2018.12.11", "2018.12.12", "2018.12.11", "OK");
insert into lainaus (id, laite_id, lainaaja_id, luovutus_id, vastaanotto_id, lainaus_pvm, era_pvm, palautus_pvm, kunto_palautettaessa) values ("2", "2", "1", "2", "3", "2018.11.01", "2018.11.15", "2018.11.14", "hyvä");

insert into laite_kategoria (id, nimi, tyyppi, kuvaus)
values ('1', 'lappari', 'kannettava', 'tyokone');
insert into laite_kategoria (id, nimi, tyyppi, kuvaus)
values ('2', 'tapletti', '10 inch tablet', 'viihde');

insert into vastuu_henkilo (henkilo_id, laite_kategoria_id)
values ('2', '1');
insert into vastuu_henkilo (henkilo_id, laite_kategoria_id)
values ('3', '2');
