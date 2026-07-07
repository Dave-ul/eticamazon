# eticamazon 🌍

Parodia critica di Amazon: navighi i prodotti di punta (niente vestiario), li metti nel carrello, ma al checkout — invece del pagamento — ricevi lo **scontrino dell'impatto**: CO₂ del ciclo di vita, acqua nascosta e condizioni dei lavoratori nella filiera, con fonti citate e linkate.

**Sito live:** https://dave-ul.github.io/eticamazon/

## I dati

- Dove il produttore pubblica un report verificato (Apple PER, fact sheet Amazon certificati Carbon Trust/SCS, EPD Samsung), usiamo quello → badge **DATO UFFICIALE VERIFICATO**.
- Dove non esiste, usiamo studi peer-reviewed o proxy dichiarati (es. PS4 → PS5) → badge **STIMA INDIPENDENTE**.
- Dove non esiste nulla (Nintendo), lo diciamo → badge **DATO NON PUBBLICATO** e il totale dello scontrino viene marcato come sottostimato.

Le fonti su lavoro e filiera: report del Strategic Organizing Center e della Commissione HELP del Senato USA sui magazzini Amazon, Amnesty International sul cobalto congolese, The Guardian su Foxconn, BBC sui lavoratori delle fab Samsung, KnowTheChain sulla trasparenza. Tutti i link sono in `data.js`.

## Tecnica

Sito statico puro (HTML + CSS + JS vanilla, zero dipendenze, zero build): `index.html`, `style.css`, `data.js` (catalogo + dati d'impatto + fonti), `app.js` (carrello in `localStorage`, viste via hash routing). GitHub Pages serve direttamente dal branch `main`.

## Disclaimer

Progetto educativo e satirico, non affiliato ad Amazon né ad alcun marchio citato. Nessuna vendita reale, nessun dato personale raccolto, prezzi indicativi. Dati aggiornati a luglio 2026.
