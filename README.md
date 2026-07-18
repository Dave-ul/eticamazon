# eticamazon 🌍

Parodia critica di Amazon: navighi i prodotti di punta (niente vestiario), li metti nel carrello, ma al checkout — invece del pagamento — ricevi lo **scontrino dell'impatto**: CO₂ del ciclo di vita, acqua nascosta e condizioni dei lavoratori nella filiera, con fonti citate e linkate.

**Sito live:** https://dave-ul.github.io/eticamazon/

## I dati

**Solo dati certificati.** Ogni prodotto in catalogo ha un'impronta di carbonio del ciclo di vita **pubblicata dal produttore o verificata da terze parti** → badge **DATO UFFICIALE VERIFICATO**. Le fonti: Apple Product Environmental Report (ISO 14067), fact sheet Amazon e Product Environmental Report Google/Samsung certificati/verificati Carbon Trust/SCS, EPD Samsung, Eco Profile Microsoft, LCA Fairphone rivista da Fraunhofer IZM, PCF Logitech ISO 14067 (revisione DEKRA).

Niente stime, proxy o dati non pubblicati: dove un produttore non pubblica un dato verificato, il prodotto non entra nel negozio.

Non tutto è condanna: il **Fairphone 5** (LCA ufficiale, oro Fairtrade, cobalto equo, 10/10 su iFixit, 8-10 anni di aggiornamenti) è il contro-esempio del catalogo — l'opposto dell'usa-e-getta.

Le fonti su lavoro e filiera: report del Strategic Organizing Center e della Commissione HELP del Senato USA sui magazzini Amazon, Amnesty International sul cobalto congolese, The Guardian su Foxconn, BBC sui lavoratori delle fab Samsung, KnowTheChain sulla trasparenza, Fairphone sui materiali equi. Tutti i link sono in `data.js`.

## Tecnica

Sito statico puro (HTML + CSS + JS vanilla, zero dipendenze, zero build): `index.html`, `style.css`, `data.js` (catalogo + dati d'impatto + fonti), `app.js` (carrello in `localStorage`, viste via hash routing). GitHub Pages serve direttamente dal branch `main`.

## Disclaimer

Progetto educativo e satirico, non affiliato ad Amazon né ad alcun marchio citato. Nessuna vendita reale, nessun dato personale raccolto, prezzi indicativi. Dati aggiornati a luglio 2026.
