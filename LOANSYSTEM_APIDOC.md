## Lainausjärjestelmä

----

## Tässä dokumentissa

1. Johdanto
2. Apis kansio
3. Fixtures kansio
4. Helpers kansio
5. Middleware kansio
6. Todos kansio

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
#### getAll
getAll - funktio hakee pyydetystä taulusta kaikki tiedot. Se sisältää myös metodin jolla listan hakemisjärjestystä voi muuttaa.
#### getSingle
getSingle - funktio hakee taulusta yhden merkinnän tiedot id:n perusteella.
#### post
post - funktio hoitaa uuden sisällön lisäämisen tauluihin.
#### put
put - funktiolla voidaan aiempaa sisältöä muokata. Jos sisällön muokkauksessa referensoi id:tä jota ei vielä ole taulukossa, put - funktio luo sellaisen kohdan taulukkoon.
#### del 
del - funktio poistaa pyynnössä id:llä määritellyn kohdan taulukosta

### Index.js
Tämä repositorion juuressa oleva index.js kutsuu kaikkia työssä käytettyjä funktioita.

### loanSettings.js
loanSettings sisältää tietokannan käynnistyksessä tarvittavat tiedot.