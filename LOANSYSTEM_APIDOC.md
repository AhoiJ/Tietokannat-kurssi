## Lainausjärjestelmä

----

## Tässä dokumentissa

1. apis kansio
2. fixtures kansio
3. helpers kansio
4. 

----

### apis kansio
apis kansiossa on lainausjärjestelmän testauksessa käytetyt get-funktiot.

### fixtures kansio
fixtures kansio sisältää initDB tiedoston joka ajetaan aina käynnistyksen yhteydessä. InitDB tarkistaa onko taulut olemassa, jossei ole se luo ne.

### helpers kansio
helpers kansio sisältää dataBaseReady tiedoston, joka ajetaan käynnistyksen yhteydessä. Se estää muita asynkronisia funktioita toimimasta ennen kuin tietokanta on toimintavalmis.
