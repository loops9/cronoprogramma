/* Terni Comics 2026 — caricamento del programma condiviso da dati.json
   Va eseguito PRIMA dell'app. Non serve modificare il resto della pagina. */
(function () {
  var KEY = "tc26_schedule";  // chiave usata dall'app per il programma
  var SIG = "tc26_pubsig";    // firma dell'ultima versione pubblicata gia' vista

  function firma(str) {           // piccola impronta del contenuto
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return String(h);
  }

  try {
    // richiesta sincrona: si completa PRIMA che parta l'app,
    // cosi' l'app legge subito i dati aggiornati.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "dati.json?t=" + Date.now(), false);
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300) {
      var data = JSON.parse(xhr.responseText);
      var eventi = Array.isArray(data) ? data : (data && data.events);

      if (eventi && eventi.length) {
        // firma = numero di versione se presente, altrimenti impronta del contenuto
        var firmaRemota = (data && data.version != null)
          ? ("v" + data.version)
          : ("h" + firma(JSON.stringify(eventi)));

        // aggiorna solo quando su GitHub e' stata pubblicata una versione nuova.
        // Cosi' le modifiche non ancora pubblicate su questo dispositivo non vengono cancellate.
        if (firmaRemota !== localStorage.getItem(SIG)) {
          localStorage.setItem(KEY, JSON.stringify(eventi));
          localStorage.setItem(SIG, firmaRemota);
        }
      }
    }
  } catch (e) {
    /* pagina aperta in locale o senza rete: l'app usa i dati che ha gia'. */
  }
})();
