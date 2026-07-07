// eticamazon — carrello in localStorage, tre viste via hash routing, zero dipendenze.

const CART_KEY = "eticamazon_cart";

const leggiCarrello = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
};
const salvaCarrello = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

const fmtEuro = (n) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
const fmtNum = (n, dec = 0) => n.toLocaleString("it-IT", { maximumFractionDigits: dec });
const byId = (id) => PRODOTTI.find((p) => p.id === id);
const esc = (s) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

const BADGE = {
  ufficiale: "DATO UFFICIALE VERIFICATO",
  stima: "STIMA INDIPENDENTE",
  assente: "DATO NON PUBBLICATO",
};

// Foto reale con fallback all'emoji se l'immagine non carica;
// il link porta alla pagina di provenienza (attribuzione per le foto Commons).
function picHtml(p) {
  if (!p.foto) return p.emoji;
  return `<a href="${p.fotoPage}" target="_blank" rel="noopener" title="Origine della foto">
    <img src="${p.foto}" alt="${esc(p.nome)}" loading="lazy"
      onerror="this.closest('.pic').textContent='${p.emoji}'"></a>`;
}

function stelleHtml(p) {
  return `<div class="stars">${"★".repeat(Math.round(p.stelle))}${"☆".repeat(5 - Math.round(p.stelle))}
    ${String(p.stelle).replace(".", ",")} <small>(${p.recensioni})</small></div>`;
}

/* ---------- Catalogo ---------- */
function renderCatalogo(filtro = "") {
  const q = filtro.trim().toLowerCase();
  const lista = PRODOTTI.filter((p) => !q || (p.nome + " " + p.marca).toLowerCase().includes(q));
  document.getElementById("griglia").innerHTML = lista.map((p) => `
    <article class="card">
      <div class="pic">${picHtml(p)}</div>
      <div class="body">
        <div class="marca">${esc(p.marca)}</div>
        <h2>${esc(p.nome)}</h2>
        ${stelleHtml(p)}
        <div class="prezzo">${fmtEuro(p.prezzo)}<small>prezzo indicativo — tanto non lo paghi</small></div>
        <div class="impact-line">
          <span class="badge ${p.transparency}">${BADGE[p.transparency]}</span><br>
          ${p.co2 !== null
            ? `Impronta di carbonio: <b>${fmtNum(p.co2, 1)} kg CO₂e</b> (ciclo di vita)`
            : `Impronta di carbonio: <b>sconosciuta</b> — il produttore non la dichiara`}
          ${p.acquaL ? `<br>Acqua nascosta: <b>${fmtNum(p.acquaL)} litri</b>` : ""}
        </div>
        <details>
          <summary>Da dove viene questo dato?</summary>
          <p>${esc(p.co2Nota)}</p>
          <p><a href="${p.co2Fonte.url}" target="_blank" rel="noopener">Fonte: ${esc(p.co2Fonte.label)}</a></p>
          ${p.acquaNota ? `<p>${esc(p.acquaNota)}${p.acquaFonte ? ` — <a href="${p.acquaFonte.url}" target="_blank" rel="noopener">${esc(p.acquaFonte.label)}</a>` : ""}</p>` : ""}
        </details>
        <button class="add-btn" data-id="${p.id}">Aggiungi al carrello</button>
      </div>
    </article>`).join("");
}

/* ---------- Carrello ---------- */
function renderCarrello() {
  const cart = leggiCarrello();
  const ids = Object.keys(cart);
  const cont = document.getElementById("carrello-righe");
  document.getElementById("btn-checkout").style.display = ids.length ? "" : "none";
  if (!ids.length) {
    cont.innerHTML = `<div class="vuoto">Il carrello è vuoto. Il pianeta ringrazia — ma se vuoi vedere lo scontrino dell'impatto, <a href="#catalogo">aggiungi qualcosa</a>.</div>`;
    return;
  }
  cont.innerHTML = ids.map((id) => {
    const p = byId(id);
    return `
    <div class="cart-row">
      <div class="pic">${picHtml(p)}</div>
      <div class="info">
        <strong>${esc(p.nome)}</strong><br>
        <span class="co2">${p.co2 !== null ? `${fmtNum(p.co2 * cart[id], 1)} kg CO₂e` : "CO₂ non dichiarata dal produttore"}</span>
      </div>
      <div class="qty">
        <button data-meno="${id}" aria-label="Riduci quantità">−</button>
        <span>${cart[id]}</span>
        <button data-piu="${id}" aria-label="Aumenta quantità">+</button>
      </div>
      <div class="prezzo">${fmtEuro(p.prezzo * cart[id])}</div>
    </div>`;
  }).join("");
}

/* ---------- Scontrino dell'impatto ---------- */
function renderCheckout() {
  const cart = leggiCarrello();
  const righe = Object.entries(cart).map(([id, qta]) => ({ p: byId(id), qta }));
  const cont = document.getElementById("scontrino");
  if (!righe.length) {
    cont.innerHTML = `<div class="vuoto">Nessun articolo: nessun impatto. È il miglior checkout possibile.</div>`;
    document.getElementById("btn-svuota").style.display = "none";
    return;
  }
  document.getElementById("btn-svuota").style.display = "";

  const co2Tot = righe.reduce((s, r) => s + (r.p.co2 ?? 0) * r.qta, 0);
  const acquaTot = righe.reduce((s, r) => s + (r.p.acquaL ?? 0) * r.qta, 0);
  const senzaDato = righe.filter((r) => r.p.co2 === null);

  // Flag lavoro unici su tutto l'ordine
  const visti = new Set();
  const flagLavoro = [];
  righe.forEach((r) => r.p.lavoro.forEach((f) => {
    if (!visti.has(f.text)) { visti.add(f.text); flagLavoro.push(f); }
  }));

  // Fonti uniche (CO2 + lavoro + acqua)
  const fonti = new Map();
  righe.forEach((r) => {
    fonti.set(r.p.co2Fonte.url, r.p.co2Fonte.label);
    if (r.p.acquaFonte) fonti.set(r.p.acquaFonte.url, r.p.acquaFonte.label);
    r.p.lavoro.forEach((f) => fonti.set(f.fonte.url, f.fonte.label));
  });

  const kmAuto = co2Tot / EQUIV.kgCo2PerKmAuto;
  const alberi = co2Tot / EQUIV.kgCo2PerAlberoAnno;
  const docce = acquaTot / EQUIV.litriPerDoccia;

  cont.innerHTML = `
    <div class="sez">
      <h2>🌫️ Anidride carbonica (ciclo di vita)</h2>
      ${righe.map((r) => `
        <div class="riga-sc">
          <span>${r.qta} × ${esc(r.p.nome)}</span>
          <span class="val ${r.p.co2 === null ? "na" : ""}">${r.p.co2 !== null ? fmtNum(r.p.co2 * r.qta, 1) + " kg" : "non dichiarata"}</span>
        </div>`).join("")}
      <div class="totale"><span>Totale CO₂e</span><span class="val">${fmtNum(co2Tot, 1)} kg${senzaDato.length ? " +?" : ""}</span></div>
      ${senzaDato.length ? `<p class="nota-metodo">⚠️ Il totale è sottostimato: ${senzaDato.map((r) => esc(r.p.nome)).join(", ")} non dichiara la propria impronta di carbonio.</p>` : ""}
      <div class="equiv">
        <div class="box"><div class="n">${fmtNum(kmAuto)}</div><div class="l">km in auto (media UE)</div></div>
        <div class="box"><div class="n">${fmtNum(alberi, 1)}</div><div class="l">alberi al lavoro per un anno intero per riassorbirla</div></div>
      </div>
    </div>

    ${acquaTot > 0 ? `
    <div class="sez">
      <h2>💧 Acqua nascosta</h2>
      <div class="totale"><span>Totale (solo articoli con dato disponibile)</span><span class="val">${fmtNum(acquaTot)} L</span></div>
      <div class="equiv">
        <div class="box"><div class="n">${fmtNum(docce)}</div><div class="l">docce da ${EQUIV.litriPerDoccia} litri</div></div>
      </div>
      <p class="nota-metodo">Per la maggior parte dell'elettronica l'acqua di filiera non viene dichiarata: qui compare solo dove esiste una stima pubblicata.</p>
    </div>` : ""}

    <div class="sez">
      <h2>🧑‍🏭 Le persone dietro il tuo ordine</h2>
      ${flagLavoro.map((f) => `
        <div class="lavoro-item">
          ${esc(f.text)}<br>
          <a href="${f.fonte.url}" target="_blank" rel="noopener">→ ${esc(f.fonte.label)}</a>
        </div>`).join("")}
    </div>

    <div class="sez">
      <h2>📚 Tutte le fonti di questo scontrino</h2>
      <ul class="fonti-list">
        ${[...fonti.entries()].map(([url, label]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join("")}
      </ul>
      <p class="nota-metodo">Equivalenze indicative: ${EQUIV.kgCo2PerKmAuto} kg CO₂/km per un'auto media, ${EQUIV.kgCo2PerAlberoAnno} kg CO₂ assorbiti da un albero in un anno.</p>
    </div>`;
}

/* ---------- Routing e contatore ---------- */
function aggiornaContatore() {
  const cart = leggiCarrello();
  document.getElementById("cart-count").textContent =
    Object.values(cart).reduce((s, n) => s + n, 0);
}

function mostraVista() {
  const hash = location.hash || "#catalogo";
  const viste = { "#catalogo": "view-catalogo", "#carrello": "view-carrello", "#checkout": "view-checkout" };
  const attiva = viste[hash] || "view-catalogo";
  Object.values(viste).forEach((id) => (document.getElementById(id).hidden = id !== attiva));
  if (attiva === "view-carrello") renderCarrello();
  if (attiva === "view-checkout") renderCheckout();
  window.scrollTo(0, 0);
}

function modificaQta(id, delta) {
  const cart = leggiCarrello();
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  salvaCarrello(cart);
  aggiornaContatore();
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-id]");
  const piu = e.target.closest("[data-piu]");
  const meno = e.target.closest("[data-meno]");
  if (add) {
    modificaQta(add.dataset.id, 1);
    add.textContent = "Aggiunto ✓";
    setTimeout(() => (add.textContent = "Aggiungi al carrello"), 900);
  }
  if (piu) { modificaQta(piu.dataset.piu, 1); renderCarrello(); }
  if (meno) { modificaQta(meno.dataset.meno, -1); renderCarrello(); }
});

document.getElementById("btn-checkout").addEventListener("click", () => (location.hash = "#checkout"));
document.getElementById("btn-svuota").addEventListener("click", () => {
  salvaCarrello({});
  aggiornaContatore();
  location.hash = "#catalogo";
});
document.getElementById("cerca").addEventListener("input", (e) => renderCatalogo(e.target.value));
window.addEventListener("hashchange", mostraVista);

renderCatalogo();
aggiornaContatore();
mostraVista();
