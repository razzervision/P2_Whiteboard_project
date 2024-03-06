# P2_Whiteboard_projectdw

## Start local server:
I terminalen kør **npm run devStart**
kan tilgås på localhost:3000

## Install dependences
I terminalen kør **npm install**

## Deployment
Bliver sendt til cloud når i pusher til Github master branch.
På hjemmesiden: https://online-writeboard-v2.azurewebsites.net/

## Anbefalinger
brug extension **EJS language support**

## File structure
**app.js:** Opsætning  
**views:** Dynamiske hjemmesider slutter på .ejs  
**public:** Statiske filer som .html, .js og .css  
**routes:** Hvor http logik som get, post og delete er og hjemmeside routes som hjemmesidenavn/home og hjemmesidenavn/about/mads  
**package.json:** Her kan man se vores project dependences og npm scripts for node.  
**bin:** Opsætning af ting som hvilken port der bliver brugt og error handeling.  
