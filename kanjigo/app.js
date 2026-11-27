/* KanjiGo Web — app (catalogo, livelli, quiz, flashcard, i miei kanji) */
"use strict";
(function () {
const LANGS = ["it", "en", "fr", "es", "de"];
const LNAME = { it: "Italiano", en: "English", fr: "Français", es: "Español", de: "Deutsch" };
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  keys() { try { return Object.keys(localStorage); } catch (e) { return []; } },
};
let LANG = store.get("kgw_lang", "it");
if (!LANGS.includes(LANG)) LANG = "it";

/* ---------------- testi dell'interfaccia: [it, en, fr, es] ---------------- */
const S = {
  tabCat: ["🔍 Catalogo", "🔍 Catalog", "🔍 Catalogue", "🔍 Catálogo", "🔍 Katalog"],
  tabLev: ["📚 Livelli JLPT", "📚 JLPT levels", "📚 Niveaux JLPT", "📚 Niveles JLPT", "📚 JLPT-Stufen"],
  tabQuiz: ["✏️ Quiz", "✏️ Quiz", "✏️ Quiz", "✏️ Quiz", "✏️ Quiz"],
  tabFc: ["🃏 Flashcard", "🃏 Flashcards", "🃏 Fiches", "🃏 Tarjetas", "🃏 Lernkarten"],
  tabMine: ["⭐ I miei kanji", "⭐ My kanji", "⭐ Mes kanji", "⭐ Mis kanji", "⭐ Meine Kanji"],
  language: ["Lingua", "Language", "Langue", "Idioma", "Sprache"],
  searchPh: ["Cerca in italiano (es. gatto), in giapponese (猫, ねこ) o in romaji (neko)", "Search in English (e.g. cat), Japanese (猫, ねこ) or romaji (neko)", "Cherchez en français (ex. chat), en japonais (猫, ねこ) ou en romaji (neko)", "Busca en español (p. ej. gato), en japonés (猫, ねこ) o en romaji (neko)", "Suche auf Deutsch (z. B. Katze), auf Japanisch (猫, ねこ) oder in Romaji (neko)"],
  searchHint: ["Scrivi una parola per cercare tra 13.108 kanji. Intanto ecco i kanji del livello N5:", "Type a word to search 13,108 kanji. Meanwhile, here are the N5 kanji:", "Tapez un mot pour chercher parmi 13 108 kanji. En attendant, voici les kanji N5 :", "Escribe una palabra para buscar entre 13.108 kanji. Mientras tanto, estos son los kanji N5:", "Gib ein Wort ein, um unter 13.108 Kanji zu suchen. Hier schon einmal die Kanji der Stufe N5:"],
  results: ["{n} risultati", "{n} results", "{n} résultats", "{n} resultados", "{n} Ergebnisse"],
  result1: ["1 risultato", "1 result", "1 résultat", "1 resultado", "1 Ergebnis"],
  first120: [" (mostro i primi 120)", " (showing the first 120)", " (les 120 premiers)", " (se muestran los 120 primeros)", " (die ersten 120 werden angezeigt)"],
  noResults: ["Nessun risultato. Prova con un'altra parola.", "No results. Try another word.", "Aucun résultat. Essayez un autre mot.", "Sin resultados. Prueba con otra palabra.", "Keine Ergebnisse. Versuche ein anderes Wort."],
  loading: ["Caricamento dei kanji…", "Loading kanji…", "Chargement des kanji…", "Cargando kanji…", "Kanji werden geladen…"],
  connFail: ["Connessione non riuscita. Ricarica la pagina tra poco.", "Connection failed. Reload the page in a moment.", "Échec de connexion. Rechargez la page dans un instant.", "Error de conexión. Recarga la página en un momento.", "Verbindung fehlgeschlagen. Lade die Seite gleich neu."],
  others: ["Altri", "Others", "Autres", "Otros", "Andere"],
  lvCount: ["{n} kanji del livello {l}", "{n} kanji in level {l}", "{n} kanji du niveau {l}", "{n} kanji del nivel {l}", "{n} Kanji der Stufe {l}"],
  lvOthers: ["{n} kanji fuori dal JLPT", "{n} kanji outside the JLPT", "{n} kanji hors JLPT", "{n} kanji fuera del JLPT", "{n} Kanji außerhalb des JLPT"],
  showMore: ["Mostra altri", "Show more", "Afficher plus", "Mostrar más", "Mehr anzeigen"],
  disclaimer: ["I livelli JLPT sono una classificazione didattica non ufficiale.", "JLPT levels are an unofficial educational classification.", "Les niveaux JLPT sont une classification pédagogique non officielle.", "Los niveles JLPT son una clasificación didáctica no oficial.", "Die JLPT-Stufen sind eine inoffizielle didaktische Einteilung."],
  // scheda kanji
  close: ["Chiudi", "Close", "Fermer", "Cerrar", "Schließen"],
  outJlpt: ["Fuori JLPT", "Not in JLPT", "Hors JLPT", "Fuera del JLPT", "Nicht im JLPT"],
  strokes: ["{n} tratti", "{n} strokes", "{n} traits", "{n} trazos", "{n} Striche"],
  freq: ["Frequenza #{n}", "Frequency #{n}", "Fréquence n°{n}", "Frecuencia #{n}", "Häufigkeit #{n}"],
  meaning: ["Significato", "Meaning", "Sens", "Significado", "Bedeutung"],
  inEnglish: ["in inglese", "English", "en anglais", "en inglés", "auf Englisch"],
  noMeaning: ["Significato non disponibile", "Meaning unavailable", "Sens indisponible", "Significado no disponible", "Bedeutung nicht verfügbar"],
  onR: ["Letture ON (origine cinese)", "ON readings (Chinese origin)", "Lectures ON (origine chinoise)", "Lecturas ON (origen chino)", "ON-Lesungen (chinesischer Ursprung)"],
  kunR: ["Letture KUN (giapponese)", "KUN readings (Japanese)", "Lectures KUN (japonaises)", "Lecturas KUN (japonesas)", "KUN-Lesungen (japanisch)"],
  commonR: ["Lettura più comune", "Most common reading", "Lecture la plus courante", "Lectura más común", "Häufigste Lesung"],
  compTitle: ["Composizione del kanji", "Kanji composition", "Composition du kanji", "Composición del kanji", "Aufbau des Kanji"],
  compTap: ["Tocca un componente per aprire la sua scheda.", "Tap a component to open its entry.", "Touchez un composant pour ouvrir sa fiche.", "Toca un componente para abrir su ficha.", "Tippe auf einen Bestandteil, um seinen Eintrag zu öffnen."],
  vgTitle: ["Composizione grafica (KanjiVG)", "Graphical composition (KanjiVG)", "Composition graphique (KanjiVG)", "Composición gráfica (KanjiVG)", "Grafischer Aufbau (KanjiVG)"],
  vgMulti: ["Componenti grafici indicativi ricavati dai gruppi KanjiVG. Non sono una scomposizione didattica revisionata né una spiegazione etimologica.", "Graphical components derived from KanjiVG groups. These are not a verified teaching decomposition or an etymological explanation.", "Composants graphiques indicatifs issus des groupes KanjiVG. Ce n’est ni une décomposition pédagogique vérifiée ni une explication étymologique.", "Componentes gráficos orientativos obtenidos de los grupos KanjiVG. No son una descomposición didáctica revisada ni una explicación etimológica.", "Grafische Bestandteile aus den KanjiVG-Gruppen. Dies ist weder eine geprüfte didaktische Zerlegung noch eine etymologische Erklärung."],
  vgNested: ["Elementi grafici individuati nei gruppi interni KanjiVG. Elenco parziale: alcune parti potrebbero mancare. Non è una scomposizione completa né un’etimologia.", "Graphical elements found in nested KanjiVG groups. The list may be incomplete; this is neither a full breakdown nor an etymology.", "Éléments graphiques trouvés dans les groupes internes KanjiVG. Liste partielle ; ce n’est ni une décomposition complète ni une étymologie.", "Elementos gráficos hallados en los grupos internos de KanjiVG. Lista parcial; no es una descomposición completa ni una etimología.", "Grafische Elemente aus inneren KanjiVG-Gruppen. Die Liste kann unvollständig sein; sie ist weder eine vollständige Zerlegung noch eine Etymologie."],
  vgNone: ["La struttura completa non è determinata dai gruppi KanjiVG. Nessuna scomposizione viene inventata.", "KanjiVG groups do not determine a complete structure. No breakdown has been invented.", "Les groupes KanjiVG ne déterminent pas une structure complète. Aucune décomposition n’est inventée.", "Los grupos KanjiVG no determinan una estructura completa. No se inventa ninguna descomposición.", "Die KanjiVG-Gruppen bestimmen keine vollständige Struktur. Es wird keine Zerlegung erfunden."],
  vgSource: ["Fonte struttura: KanjiVG — CC BY-SA 3.0. Nessuna etimologia dedotta automaticamente.", "Structure source: KanjiVG — CC BY-SA 3.0. Graphical elements are not evidence of etymology.", "Source de la structure : KanjiVG — CC BY-SA 3.0. Aucune étymologie déduite automatiquement.", "Fuente de la estructura: KanjiVG — CC BY-SA 3.0. No se deduce ninguna etimología.", "Quelle der Struktur: KanjiVG — CC BY-SA 3.0. Grafische Elemente sind kein Beleg für eine Etymologie."],
  openEntry: ["Apri scheda", "Open entry", "Ouvrir la fiche", "Abrir ficha", "Eintrag öffnen"],
  graphComp: ["Componente grafico", "Graphical component", "Composant graphique", "Componente gráfico", "Grafischer Bestandteil"],
  notVerified: ["Significato non verificato", "Component", "Sens non vérifié", "componente gráfico", "Bestandteil"],
  structNote: ["", "Graphical breakdown for study; etymology not verified.", "Décomposition graphique destinée à l’étude ; l’étymologie n’est pas vérifiée.", "Descomposición gráfica orientativa; etimología no verificada.", "Grafische Zerlegung zum Lernen; Etymologie nicht geprüft."],
  words: ["Parole composte e letture", "Compound words and readings", "Mots composés et lectures", "Palabras compuestas y lecturas", "Zusammengesetzte Wörter und Lesungen"],
  wordsNote: ["Letture della parola completa. Le traduzioni italiane automatiche potrebbero contenere imprecisioni.", "Readings of the complete word. Original English dictionary meanings are shown.", "Lectures du mot complet et significations françaises disponibles.", "Lecturas completas y significados disponibles en español.", "Lesungen des ganzen Wortes. Die deutschen Bedeutungen sind Entwürfe und können Ungenauigkeiten enthalten."],
  noWords: ["Nessuna parola composta disponibile per questo kanji.", "No compound words available for this kanji.", "Aucun mot composé disponible pour ce kanji.", "No hay palabras compuestas para este kanji.", "Für dieses Kanji sind keine zusammengesetzten Wörter verfügbar."],
  moreWords: ["Mostra altre parole", "Show more words", "Afficher plus de mots", "Mostrar más palabras", "Weitere Wörter anzeigen"],
  addMine: ["☆ Aggiungi ai miei kanji", "☆ Add to my kanji", "☆ Ajouter à mes kanji", "☆ Añadir a mis kanji", "☆ Zu meinen Kanji hinzufügen"],
  inMine: ["★ Nei miei kanji", "★ In my kanji", "★ Dans mes kanji", "★ En mis kanji", "★ In meinen Kanji"],
  unlock: ["Sblocca tutti i kanji · 3,99 €", "Unlock all kanji · €3.99", "Débloquer tous les kanji · 3,99 €", "Desbloquear todos los kanji · 3,99 €", "Alle Kanji freischalten · 3,99 €"],
  favWord: ["Aggiungi ai vocaboli preferiti", "Add to favorite words", "Ajouter aux mots favoris", "Añadir a palabras favoritas", "Zu Lieblingswörtern hinzufügen"],
  // quiz
  quizIntro: ["Scegli il livello e il tipo di esercizio. I test salvati si possono riprendere o cancellare senza modificare gli altri.", "Choose a level and an exercise. Saved quizzes can be resumed or deleted without affecting others.", "Choisissez un niveau et un exercice. Les tests enregistrés peuvent être repris ou supprimés sans modifier les autres.", "Elige el nivel y el ejercicio. Las pruebas guardadas se pueden reanudar o borrar sin afectar a las demás.", "Wähle eine Stufe und eine Übung. Gespeicherte Tests können fortgesetzt oder gelöscht werden, ohne die anderen zu verändern."],
  mineChip: ["★ I miei kanji", "★ My kanji", "★ Mes kanji", "★ Mis kanji", "★ Meine Kanji"],
  personalized: ["Quiz personalizzati", "Custom quizzes", "Quiz personnalisés", "Cuestionarios personalizados", "Eigene Quizze"],
  personalHelp: ["Soltanto i kanji che hai segnato con ★. Per i composti, tutti i kanji della parola devono essere tra i tuoi.", "Only the kanji you marked with ★. For compounds, every kanji in the word must be one of yours.", "Uniquement les kanji marqués d’une ★. Pour les composés, tous les kanji du mot doivent être sélectionnés.", "Solo los kanji marcados con ★. En los compuestos, todos los kanji de la palabra deben estar seleccionados.", "Nur die Kanji, die du mit ★ markiert hast. Bei zusammengesetzten Wörtern müssen alle Kanji des Wortes markiert sein."],
  qQuick: ["Quiz rapido", "Quick quiz", "Quiz rapide", "Cuestionario rápido", "Schnellquiz"],
  qQuickS: ["Kanji → significato · 10 kanji del livello", "Kanji → meaning · 10 kanji from this level", "Kanji → sens · 10 kanji de ce niveau", "Kanji → significado · 10 kanji del nivel", "Kanji → Bedeutung · 10 Kanji dieser Stufe"],
  qFull: ["Quiz completo", "Full quiz", "Quiz complet", "Cuestionario completo", "Vollständiges Quiz"],
  qFullS: ["Kanji → significato · tutti i kanji del livello", "Kanji → meaning · every kanji in the level", "Kanji → sens · tous les kanji du niveau", "Kanji → significado · todos los kanji del nivel", "Kanji → Bedeutung · alle Kanji der Stufe"],
  qRev: ["Quiz inverso", "Reverse quiz", "Quiz inversé", "Cuestionario inverso", "Umgekehrtes Quiz"],
  qRevS: ["Significato → kanji · 10 domande", "Meaning → kanji · 10 questions", "Sens → kanji · 10 questions", "Significado → kanji · 10 preguntas", "Bedeutung → Kanji · 10 Fragen"],
  qComp: ["Quiz vocaboli composti", "Compound word quiz", "Quiz des mots composés", "Cuestionario de palabras compuestas", "Quiz zu zusammengesetzten Wörtern"],
  qCompF: ["Giapponese → significato", "Japanese → meaning", "Japonais → sens", "Japonés → significado", "Japanisch → Bedeutung"],
  qCompR: ["Significato → giapponese", "Meaning → Japanese", "Sens → japonais", "Significado → japonés", "Bedeutung → Japanisch"],
  qRead: ["Quiz letture · Kanji singoli", "Reading quiz · Single kanji", "Quiz de lecture · Kanji seuls", "Cuestionario de lectura · Kanji individuales", "Lesequiz · Einzel-Kanji"],
  qReadS: ["Scegli il tipo di lettura e la direzione · 10 domande", "Choose the reading type and direction · 10 questions", "Choisissez le type de lecture et le sens · 10 questions", "Elige el tipo de lectura y la dirección · 10 preguntas", "Wähle Lesungsart und Richtung · 10 Fragen"],
  qReadC: ["Quiz letture · Composti", "Reading quiz · Compounds", "Quiz de lecture · Mots composés", "Cuestionario de lectura · Compuestos", "Lesequiz · Komposita"],
  qReadCS: ["Le parole composte usano la loro lettura completa nel dizionario · 10 domande", "Compound words use their complete dictionary reading · 10 questions", "Les mots composés utilisent leur lecture complète du dictionnaire · 10 questions", "Las palabras compuestas usan su lectura completa del diccionario · 10 preguntas", "Zusammengesetzte Wörter verwenden ihre vollständige Wörterbuchlesung · 10 Fragen"],
  rAuto: ["Più comune", "Most common", "La plus courante", "Más común", "Häufigste"],
  kToH: ["Kanji → Hiragana", "Kanji → Hiragana", "Kanji → Hiragana", "Kanji → Hiragana", "Kanji → Hiragana"],
  hToK: ["Hiragana → Kanji", "Hiragana → Kanji", "Hiragana → Kanji", "Hiragana → Kanji", "Hiragana → Kanji"],
  start: ["Inizia", "Start", "Commencer", "Empezar", "Starten"],
  singles: ["Singoli", "Single kanji", "Kanji seuls", "Kanji individuales", "Einzel-Kanji"],
  compounds: ["Composti", "Compounds", "Composés", "Compuestos", "Komposita"],
  pMeanF: ["Kanji → significato", "Kanji → meaning", "Kanji → sens", "Kanji → significado", "Kanji → Bedeutung"],
  pMeanR: ["Significato → kanji", "Meaning → kanji", "Sens → kanji", "Significado → kanji", "Bedeutung → Kanji"],
  resume: ["Riprendi", "Resume", "Reprendre", "Reanudar", "Fortsetzen"],
  del: ["Elimina", "Delete", "Supprimer", "Eliminar", "Löschen"],
  savedAt: ["Test salvato · domanda {i} di {n}", "Saved quiz · question {i} of {n}", "Test enregistré · question {i} sur {n}", "Prueba guardada · pregunta {i} de {n}", "Gespeicherter Test · Frage {i} von {n}"],
  confirmDel: ["Eliminare il quiz salvato? Gli altri quiz resteranno invariati.", "Delete the saved quiz? Other quizzes will remain unchanged.", "Supprimer le quiz enregistré ? Les autres quiz resteront inchangés.", "¿Eliminar el cuestionario guardado? Los demás no cambiarán.", "Gespeichertes Quiz löschen? Die anderen Quizze bleiben unverändert."],
  replaceSaved: ["C'è un test salvato per questo esercizio. Avviare un nuovo quiz sostituirà soltanto questo test. Continuare?", "There is a saved quiz for this exercise. Starting a new one will replace only this quiz. Continue?", "Un test est enregistré pour cet exercice. En démarrer un nouveau remplacera uniquement ce test. Continuer ?", "Hay una prueba guardada para este ejercicio. Empezar otra reemplazará solo esta prueba. ¿Continuar?", "Für diese Übung gibt es einen gespeicherten Test. Ein neues Quiz ersetzt nur diesen Test. Fortfahren?"],
  yes: ["Sì", "Yes", "Oui", "Sí", "Ja"], cancel: ["Annulla", "Cancel", "Annuler", "Cancelar", "Abbrechen"], ok: ["OK", "OK", "OK", "OK", "OK"],
  newTest: ["Nuovo test", "New test", "Nouveau test", "Nueva prueba", "Neuer Test"],
  question: ["Domanda {i} di {n}", "Question {i} of {n}", "Question {i} sur {n}", "Pregunta {i} de {n}", "Frage {i} von {n}"],
  correctN: ["Corrette: {n}", "Correct: {n}", "Correctes : {n}", "Correctas: {n}", "Richtig: {n}"],
  wrongN: ["Sbagliate: {n}", "Incorrect: {n}", "Incorrectes : {n}", "Incorrectas: {n}", "Falsch: {n}"],
  stop: ["Stop", "Stop", "Arrêter", "Detener", "Stopp"],
  go: ["Avvia", "Resume", "Reprendre", "Reanudar", "Fortsetzen"],
  saveTest: ["Salva test", "Save quiz", "Enregistrer le test", "Guardar prueba", "Quiz speichern"],
  saved: ["Test salvato: lo ritrovi nel menu dei quiz.", "Quiz saved: you can find it in the quiz menu.", "Test enregistré : vous le retrouverez dans le menu des quiz.", "Prueba guardada: la encontrarás en el menú de cuestionarios.", "Test gespeichert: Du findest ihn im Quiz-Menü."],
  exit: ["Esci", "Exit", "Quitter", "Salir", "Verlassen"],
  paused: ["Test in pausa: premi Avvia per continuare.", "Quiz paused: tap Resume to continue.", "Quiz en pause : appuyez sur Reprendre pour continuer.", "Prueba en pausa: pulsa Reanudar para continuar.", "Quiz pausiert: Tippe auf Fortsetzen, um weiterzumachen."],
  whichMeaning: ["Qual è il significato di questo kanji?", "What does this kanji mean?", "Que signifie ce kanji ?", "¿Qué significa este kanji?", "Was bedeutet dieses Kanji?"],
  chooseKanji: ["Scegli il kanji corrispondente", "Choose the matching kanji", "Choisissez le kanji correspondant", "Elige el kanji correspondiente", "Wähle das passende Kanji"],
  chooseReading: ["Scegli la lettura in hiragana", "Choose the hiragana reading", "Choisissez la lecture en hiragana", "Elige la lectura en hiragana", "Wähle die Hiragana-Lesung"],
  wordMeaning: ["Cosa significa questa parola giapponese?", "What does this Japanese word mean?", "Que signifie ce mot japonais ?", "¿Qué significa esta palabra japonesa?", "Was bedeutet dieses japanische Wort?"],
  chooseWord: ["Scegli la parola giapponese corrispondente", "Choose the matching Japanese word", "Choisissez le mot japonais correspondant", "Elige la palabra japonesa correspondiente", "Wähle das passende japanische Wort"],
  readingOf: ["Lettura {t}", "{t} reading", "Lecture {t}", "Lectura {t}", "{t}-Lesung"],
  right: ["Corretto!", "Correct!", "Correct !", "¡Correcto!", "Richtig!"],
  rightAns: ["Risposta corretta: {a}", "Correct answer: {a}", "Bonne réponse : {a}", "Respuesta correcta: {a}", "Richtige Antwort: {a}"],
  next: ["Prossima domanda", "Next question", "Question suivante", "Siguiente pregunta", "Nächste Frage"],
  seeRes: ["Vedi risultato", "View results", "Voir le résultat", "Ver resultado", "Ergebnis ansehen"],
  done: ["Quiz completato", "Quiz completed", "Quiz terminé", "Cuestionario completado", "Quiz abgeschlossen"],
  score: ["Punteggio: {n}%", "Score: {n}%", "Score : {n} %", "Puntuación: {n}%", "Punktzahl: {n} %"],
  time: ["Tempo impiegato: {t}", "Time taken: {t}", "Temps écoulé : {t}", "Tiempo empleado: {t}", "Benötigte Zeit: {t}"],
  review: ["Da ripassare", "To review", "À revoir", "Para repasar", "Zum Wiederholen"],
  again: ["Nuovo quiz uguale", "Same quiz again", "Refaire ce quiz", "Repetir el cuestionario", "Gleiches Quiz noch einmal"],
  backQuiz: ["Torna ai quiz", "Back to quizzes", "Retour aux quiz", "Volver a los cuestionarios", "Zurück zu den Quizzen"],
  notEnough: ["Non ci sono abbastanza elementi per questo quiz (servono almeno 4 risposte distinte). Aggiungi altri kanji ai tuoi con ★.", "Not enough items for this quiz (at least 4 distinct answers are needed). Add more kanji to yours with ★.", "Pas assez d’éléments pour ce quiz (il faut au moins 4 réponses distinctes). Ajoutez d’autres kanji avec ★.", "No hay suficientes elementos para este cuestionario (se necesitan al menos 4 respuestas distintas). Añade más kanji con ★.", "Nicht genug Einträge für dieses Quiz (mindestens 4 verschiedene Antworten nötig). Füge mit ★ weitere Kanji hinzu."],
  history: ["I tuoi ultimi risultati", "Your latest results", "Vos derniers résultats", "Tus últimos resultados", "Deine letzten Ergebnisse"],
  noHistory: ["Nessun quiz completato finora.", "No quizzes completed yet.", "Aucun quiz terminé pour l’instant.", "Aún no has completado ningún cuestionario.", "Noch kein Quiz abgeschlossen."],
  help: ["❓ Come funziona", "❓ How it works", "❓ Mode d’emploi", "❓ Cómo funciona", "❓ So funktioniert es"],
  helpTitle: ["Come funziona KanjiGo Web", "How KanjiGo Web works", "Comment fonctionne KanjiGo Web", "Cómo funciona KanjiGo Web", "So funktioniert KanjiGo Web"],
  helpIntro: ["Consulta il dizionario, scegli i kanji che vuoi ripassare ed esercitati con flashcard e quiz.", "Browse the dictionary, choose the kanji you want to review, and practise with flashcards and quizzes.", "Consultez le dictionnaire, choisissez les kanji à réviser et entraînez-vous avec des fiches et des quiz.", "Consulta el diccionario, elige los kanji que quieres repasar y practica con tarjetas y cuestionarios.", "Durchsuche das Wörterbuch, wähle Kanji zum Wiederholen aus und übe mit Lernkarten und Quizfragen."],
  help1: ["<b>1. Catalogo</b> — cerca un kanji per carattere, lettura (anche in romaji) o significato. Tocca un kanji per vedere significato, letture ON e KUN, lettura più comune, composizione e parole composte.", "<b>1. Catalog</b> — search for a kanji by character, reading (romaji too) or meaning. Tap a kanji to see its meaning, ON and KUN readings, most common reading, composition and compound words.", "<b>1. Catalogue</b> — cherchez un kanji par caractère, lecture (aussi en romaji) ou sens. Touchez un kanji pour voir son sens, ses lectures ON et KUN, la lecture la plus courante, sa composition et ses mots composés.", "<b>1. Catálogo</b> — busca un kanji por carácter, lectura (también en romaji) o significado. Toca un kanji para ver su significado, lecturas ON y KUN, lectura más común, composición y palabras compuestas.", "<b>1. Katalog</b> — suche ein Kanji nach Zeichen, Lesung (auch in Romaji) oder Bedeutung. Tippe auf ein Kanji, um Bedeutung, ON- und KUN-Lesungen, häufigste Lesung, Aufbau und zusammengesetzte Wörter zu sehen."],
  help2: ["<b>2. I miei kanji</b> — nella scheda di un kanji tocca ☆ per aggiungerlo ai tuoi. Tocca ☆ accanto a una parola per salvarla tra i vocaboli preferiti.", "<b>2. My kanji</b> — in a kanji entry tap ☆ to add it to yours. Tap ☆ next to a word to save it to your favorite words.", "<b>2. Mes kanji</b> — dans la fiche d’un kanji, touchez ☆ pour l’ajouter aux vôtres. Touchez ☆ à côté d’un mot pour l’enregistrer dans vos mots favoris.", "<b>2. Mis kanji</b> — en la ficha de un kanji toca ☆ para añadirlo a los tuyos. Toca ☆ junto a una palabra para guardarla en tus palabras favoritas.", "<b>2. Meine Kanji</b> — tippe im Eintrag eines Kanji auf ☆, um es hinzuzufügen. Tippe auf ☆ neben einem Wort, um es in deinen Lieblingswörtern zu speichern."],
  help3: ["<b>3. Flashcard</b> — ripassa i kanji per livello o i tuoi, oppure i vocaboli composti (per livello, combinazioni dei tuoi kanji o preferiti). Tocca i riquadri per scoprire le risposte.", "<b>3. Flashcards</b> — review kanji by level or your own, or compound words (by level, combinations of your kanji or favorites). Tap the boxes to reveal the answers.", "<b>3. Fiches</b> — révisez les kanji par niveau ou les vôtres, ou les mots composés (par niveau, combinaisons de vos kanji ou favoris). Touchez les cases pour révéler les réponses.", "<b>3. Tarjetas</b> — repasa los kanji por nivel o los tuyos, o las palabras compuestas (por nivel, combinaciones de tus kanji o favoritas). Toca los recuadros para ver las respuestas.", "<b>3. Lernkarten</b> — wiederhole Kanji nach Stufe oder deine eigenen, oder zusammengesetzte Wörter (nach Stufe, Kombinationen deiner Kanji oder Favoriten). Tippe auf die Felder, um die Antworten zu sehen."],
  help4: ["<b>4. Quiz</b> — scegli un livello JLPT o i tuoi kanji: significato, quiz inverso, parole composte e letture ON/KUN in entrambe le direzioni. Con Stop metti in pausa, con Salva test lo riprendi più tardi dal menu.", "<b>4. Quiz</b> — choose a JLPT level or your own kanji: meaning, reverse quiz, compound words and ON/KUN readings in both directions. Stop pauses the quiz; Save quiz lets you resume it later from the menu.", "<b>4. Quiz</b> — choisissez un niveau JLPT ou vos kanji : sens, quiz inversé, mots composés et lectures ON/KUN dans les deux sens. Arrêter met en pause ; Enregistrer permet de reprendre plus tard depuis le menu.", "<b>4. Cuestionarios</b> — elige un nivel JLPT o tus kanji: significado, cuestionario inverso, palabras compuestas y lecturas ON/KUN en ambas direcciones. Detener pausa la prueba; Guardar prueba te permite reanudarla después desde el menú.", "<b>4. Quiz</b> — wähle eine JLPT-Stufe oder deine Kanji: Bedeutung, umgekehrtes Quiz, zusammengesetzte Wörter und ON/KUN-Lesungen in beide Richtungen. Stopp pausiert, mit „Quiz speichern“ setzt du später im Menü fort."],
  help5: ["<b>5. Lingua e progressi</b> — cambia lingua dal menu in alto. I tuoi kanji, i preferiti, i test salvati e i risultati restano salvati in questo browser.", "<b>5. Language and progress</b> — change language from the menu at the top. Your kanji, favorites, saved quizzes and results are kept in this browser.", "<b>5. Langue et progrès</b> — changez de langue dans le menu en haut. Vos kanji, favoris, tests enregistrés et résultats restent dans ce navigateur.", "<b>5. Idioma y progreso</b> — cambia el idioma en el menú superior. Tus kanji, favoritos, pruebas guardadas y resultados se conservan en este navegador.", "<b>5. Sprache und Fortschritt</b> — ändere die Sprache im Menü oben. Deine Kanji, Favoriten, gespeicherten Tests und Ergebnisse bleiben in diesem Browser gespeichert."],
  // flashcard
  fcKanji: ["Kanji", "Kanji", "Kanji", "Kanji", "Kanji"],
  fcWords: ["Vocaboli composti", "Compound words", "Mots composés", "Palabras compuestas", "Zusammengesetzte Wörter"],
  fcMine: ["★ I miei kanji", "★ My kanji", "★ Mes kanji", "★ Mis kanji", "★ Meine Kanji"],
  fcCombo: ["Combinazioni dei miei kanji", "Combinations of my kanji", "Combinaisons de mes kanji", "Combinaciones de mis kanji", "Kombinationen meiner Kanji"],
  fcFav: ["Vocaboli preferiti", "Favorite words", "Mots favoris", "Palabras favoritas", "Lieblingswörter"],
  card: ["Carta {i} di {n}", "Card {i} of {n}", "Fiche {i} sur {n}", "Tarjeta {i} de {n}", "Karte {i} von {n}"],
  tapReveal: ["Tocca un riquadro per rivelare la risposta", "Tap a box to reveal the answer", "Touchez une case pour révéler la réponse", "Toca un recuadro para ver la respuesta", "Tippe auf ein Feld, um die Antwort zu sehen"],
  hidden: ["Risposta nascosta · tocca per vedere", "Answer hidden · tap to show", "Réponse masquée · touchez pour voir", "Respuesta oculta · toca para ver", "Antwort verborgen · zum Anzeigen tippen"],
  readings: ["Letture ON / KUN", "ON / KUN readings", "Lectures ON / KUN", "Lecturas ON / KUN", "ON- / KUN-Lesungen"],
  reading: ["Lettura", "Reading", "Lecture", "Lectura", "Lesung"],
  prev: ["← Precedente", "← Previous", "← Précédente", "← Anterior", "← Zurück"],
  nextC: ["Successiva →", "Next →", "Suivante →", "Siguiente →", "Weiter →"],
  shuffle: ["🔀 Mescola", "🔀 Shuffle", "🔀 Mélanger", "🔀 Mezclar", "🔀 Mischen"],
  revealAll: ["Rivela tutto", "Reveal all", "Tout révéler", "Mostrar todo", "Alles zeigen"],
  hideAll: ["Nascondi tutto", "Hide all", "Tout masquer", "Ocultar todo", "Alles verbergen"],
  emptyMine: ["Non hai ancora kanji segnati. Apri un kanji dal catalogo e tocca ☆ Aggiungi ai miei kanji.", "You have no marked kanji yet. Open a kanji in the catalog and tap ☆ Add to my kanji.", "Vous n’avez encore aucun kanji. Ouvrez un kanji du catalogue et touchez ☆ Ajouter à mes kanji.", "Aún no tienes kanji marcados. Abre un kanji del catálogo y toca ☆ Añadir a mis kanji.", "Du hast noch keine Kanji markiert. Öffne ein Kanji im Katalog und tippe auf ☆ Zu meinen Kanji hinzufügen."],
  emptyCombo: ["Nessuna parola composta fatta solo dei tuoi kanji. Aggiungi altri kanji con ★.", "No compound word is made only of your kanji. Add more kanji with ★.", "Aucun mot composé n’est formé uniquement de vos kanji. Ajoutez-en avec ★.", "Ninguna palabra compuesta está formada solo por tus kanji. Añade más con ★.", "Kein zusammengesetztes Wort besteht nur aus deinen Kanji. Füge mit ★ weitere Kanji hinzu."],
  emptyFav: ["Nessun vocabolo preferito. Nella scheda di un kanji tocca ☆ accanto a una parola.", "No favorite words. In a kanji entry, tap ☆ next to a word.", "Aucun mot favori. Dans la fiche d’un kanji, touchez ☆ à côté d’un mot.", "No hay palabras favoritas. En la ficha de un kanji, toca ☆ junto a una palabra.", "Keine Lieblingswörter. Tippe im Eintrag eines Kanji auf ☆ neben einem Wort."],
  // i miei kanji
  mineCount: ["{n} kanji segnati", "{n} marked kanji", "{n} kanji marqués", "{n} kanji marcados", "{n} markierte Kanji"],
  favWords: ["Vocaboli preferiti ({n})", "Favorite words ({n})", "Mots favoris ({n})", "Palabras favoritas ({n})", "Lieblingswörter ({n})"],
  goQuiz: ["✏️ Quiz sui miei kanji", "✏️ Quiz on my kanji", "✏️ Quiz sur mes kanji", "✏️ Cuestionario de mis kanji", "✏️ Quiz zu meinen Kanji"],
  goFc: ["🃏 Flashcard dei miei kanji", "🃏 Flashcards of my kanji", "🃏 Fiches de mes kanji", "🃏 Tarjetas de mis kanji", "🃏 Lernkarten meiner Kanji"],
  progress: ["I tuoi progressi", "Your progress", "Vos progrès", "Tu progreso", "Dein Fortschritt"],
  progStats: ["Quiz completati: {q} · Risposte corrette: {c} su {t}", "Quizzes completed: {q} · Correct answers: {c} of {t}", "Quiz terminés : {q} · Bonnes réponses : {c} sur {t}", "Cuestionarios completados: {q} · Respuestas correctas: {c} de {t}", "Abgeschlossene Quizze: {q} · Richtige Antworten: {c} von {t}"],
};
const t = (k, v) => { const a = S[k]; if (!a) return k; let s = a[LANGS.indexOf(LANG)]; if (s == null || s === "") s = a[0]; if (v) for (const x in v) s = s.split("{" + x + "}").join(v[x]); return s; };

/* ---------------- utilità ---------------- */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const kata2hira = s => String(s).replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const hiraR = s => kata2hira(String(s).replace(/[.\-]/g, ""));
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const CJK = /[㐀-鿿豈-﫿]/;
const cjkChars = w => [...w].filter(ch => CJK.test(ch));
const fmtTime = s => { s = Math.max(0, s | 0); const m = Math.floor(s / 60), x = s % 60; return (m < 10 ? "0" : "") + m + ":" + (x < 10 ? "0" : "") + x; };
const R2H = (() => { const tb = { a: "あ", i: "い", u: "う", e: "え", o: "お", ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ", sa: "さ", shi: "し", si: "し", su: "す", se: "せ", so: "そ", ta: "た", chi: "ち", ti: "ち", tsu: "つ", tu: "つ", te: "て", to: "と", na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の", ha: "は", hi: "ひ", fu: "ふ", hu: "ふ", he: "へ", ho: "ほ", ma: "ま", mi: "み", mu: "む", me: "め", mo: "も", ya: "や", yu: "ゆ", yo: "よ", ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ", wa: "わ", wo: "を", n: "ん", ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご", za: "ざ", ji: "じ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ", da: "だ", de: "で", do: "ど", ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ", pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ", kya: "きゃ", kyu: "きゅ", kyo: "きょ", sha: "しゃ", shu: "しゅ", sho: "しょ", cha: "ちゃ", chu: "ちゅ", cho: "ちょ", nya: "にゃ", nyu: "にゅ", nyo: "にょ", hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", mya: "みゃ", myu: "みゅ", myo: "みょ", rya: "りゃ", ryu: "りゅ", ryo: "りょ", gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ", ja: "じゃ", ju: "じゅ", jo: "じょ", bya: "びゃ", byu: "びゅ", byo: "びょ", pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ" };
  return s => { s = s.toLowerCase(); let o = "", i = 0; while (i < s.length) { if (i + 1 < s.length && s[i] === s[i + 1] && !"aeioun".includes(s[i])) { o += "っ"; i++; continue; } let hit = false; for (const L of [3, 2, 1]) { const p = s.substr(i, L); if (tb[p] && !(p === "n" && i + 1 < s.length && "aeiouy".includes(s[i + 1]))) { o += tb[p]; i += L; hit = true; break; } } if (!hit) { o += s[i]; i++; } } return o; }; })();
const H2R = (() => { const m = {}; "あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をwo んn がga ぎgi ぐgu げge ごgo ざza じji ずzu ぜze ぞzo だda ぢji づzu でde どdo ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo ゔvu".split(" ").forEach(x => m[x[0]] = x.slice(1));
  const sm = { "ゃ": "ya", "ゅ": "yu", "ょ": "yo" };
  return s => { s = kata2hira(s); let o = ""; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === "っ") { const n = m[s[i + 1]]; if (n) o += n[0] === "c" ? "t" : n[0]; continue; } if (c === "ー") { o += o.slice(-1); continue; } let r = m[c]; if (r == null) { if (c === "." || c === "-") continue; o += c; continue; } if (sm[s[i + 1]]) { r = ["shi", "chi", "ji"].includes(r) ? r.slice(0, -1) + sm[s[i + 1]].slice(1) : r.slice(0, -1) + sm[s[i + 1]]; i++; } o += r; } return o; }; })();

/* ---------------- dati ---------------- */
let D = { K: [], V: [], G: {} }, byChar = {}, FULL = false, vIdx = null;
let mine = new Set(store.get("kgw_mine", null) || store.get("kanjigo_web_fav_v1", []));
let favW = new Set(store.get("kgw_favw", []));
const saveMine = () => store.set("kgw_mine", [...mine]);
const saveFavW = () => store.set("kgw_favw", [...favW]);
function load(data, full) {
  if (Array.isArray(data)) data = { K: data.map(k => Object.assign({ en: k.e ? k.m : [] }, k)), V: [], G: {} };
  D = data; D.G = D.G || {}; byChar = {}; D.K.forEach(k => byChar[k.c] = k); FULL = !!full; vIdx = null;
  D.navSet = new Set(D.G.nav || []);
}
function vocabFor(c) {
  if (!vIdx) { vIdx = {}; D.V.forEach((v, i) => { for (const ch of new Set(cjkChars(v[0]))) (vIdx[ch] = vIdx[ch] || []).push(i); }); }
  return (vIdx[c] || []).map(i => D.V[i]).filter(v => v[0].length > 1);
}
const wid = v => v[0] + "|" + v[1];
// significato kanji nella lingua scelta
function km(k) {
  if (LANG === "it") return (k.m && k.m.length) ? { a: k.m, en: !!k.e } : { a: k.en || [], en: true };
  if (LANG === "en") return { a: (k.en && k.en.length) ? k.en : (k.e ? k.m : []) };
  const a = k[LANG]; if (a && a.length) return { a }; return { a: k.en || [], en: true };
}
function kmQuiz(k) { // significato principale usabile nei quiz (solo lingua scelta, niente inglese di ripiego)
  if (LANG === "it") return (!k.e && k.m && k.m[0]) ? k.m[0] : null;
  const a = LANG === "en" ? (k.en && k.en.length ? k.en : (k.e ? k.m : null)) : k[LANG];
  return a && a[0] ? a[0] : null;
}
function vm(v, quiz) { if (LANG === "it") return v[4] || ""; if (LANG === "en") return v[5] || ""; if (LANG === "fr") return v[6] || (quiz ? "" : v[7] || ""); if (LANG === "de") return v[10] || ""; return v[8] || ""; }
function vmShow(v) { const m = vm(v, false); return m ? { m } : { m: v[5] || "", en: true }; }
const enTag = () => `<span class="en">${esc(t("inEnglish"))}</span>`;

/* ---------------- scheda kanji ---------------- */
let mdWords = 60;
function card(k) {
  const m = km(k).a;
  return `<div class="kc" data-c="${esc(k.c)}">${mine.has(k.c) ? '<span class="st">★</span>' : ""}<div class="lv">${k.l || "&nbsp;"}</div><div class="ch">${esc(k.c)}</div><div class="mn">${esc(m[0] || "")}</div></div>`;
}
function bindCards(root) { root.querySelectorAll(".kc").forEach(el => el.onclick = () => { mdWords = 60; openKanji(el.dataset.c); }); }
function readingList(arr) { return arr && arr.length ? arr.map(r => `<span class="rd">${esc(r)} <small>${esc(H2R(r))}</small></span>`).join("") : "—"; }
const PART_MAP = { "亻": "人", "氵": "水", "扌": "手", "艹": "艸", "阝": "阜" };
function compositionHtml(k) {
  const G = D.G || {};
  if (k.st) {
    const parts = k.st.p.map(([ch, mIt]) => {
      const m = LANG === "it" ? mIt : LANG === "en" ? ((G.pt && G.pt.en || {})[mIt] || "Component") : LANG === "fr" ? ((G.pt && G.pt.fr || {})[mIt] || "composant graphique") : LANG === "es" ? ((G.pt && G.pt.es || {})[mIt] || "componente gráfico") : t("notVerified");
      const target = PART_MAP[ch] || ch, can = !!byChar[target];
      return `<button class="part" ${can ? `data-c="${esc(target)}"` : "disabled"}><span>${esc(ch)}</span><small>${esc(m)}</small></button>`;
    }).join("");
    const note = LANG === "it" ? k.st.n : LANG === "en" ? ((G.ne || {})[k.st.n] || t("structNote")) : t("structNote");
    return `<div class="box"><h4>${t("compTitle")}</h4><p class="note">${t("compTap")}</p><div class="parts">${parts}</div><p class="note">${esc(note)}</p></div>`;
  }
  if (k.vg) {
    const [kind, list] = k.vg;
    const txt = kind === 1 ? t("vgMulti") : kind === 2 ? t("vgNested") : t("vgNone");
    const parts = list.map(sym => {
      const can = D.navSet.has(sym) && !!byChar[sym];
      const g = LANG === "it" ? ((G.it || {})[sym] || t("notVerified")) : LANG === "fr" ? ((G.fr || {})[sym] || t("notVerified")) : t("notVerified");
      return `<button class="part" ${can ? `data-c="${esc(sym)}"` : "disabled"}><span>${esc(sym)}</span><small>${esc(g)}</small><em>${can ? t("openEntry") : t("graphComp")}</em></button>`;
    }).join("");
    return `<div class="box"><h4>${t("vgTitle")}</h4><p class="note">${txt}</p>${parts ? `<div class="parts">${parts}</div>` : ""}<p class="note" style="font-size:11px">${t("vgSource")}</p></div>`;
  }
  return "";
}
function wordRow(v) {
  const s = vmShow(v), id = wid(v), fav = favW.has(id);
  return `<div class="word"><span class="w">${esc(v[0])}</span><span class="wm"><span class="r">${esc(v[1])} · ${esc(v[2])}</span><br>${esc(s.m)}${s.en ? enTag() : ""} ${v[3] ? `<span class="tag">${esc(v[3])}</span>` : ""}</span>${FULL ? `<button class="fw${fav ? " on" : ""}" data-w="${esc(id)}" title="${esc(t("favWord"))}">${fav ? "★" : "☆"}</button>` : ""}</div>`;
}
function openKanji(c) {
  const k = byChar[c]; if (!k) return;
  const mm = km(k), isMine = mine.has(c);
  let words = vocabFor(c);
  if (LANG === "it" && k.lw) { const seen = new Set(words.map(wid)); k.lw.forEach(w => { const v = [w[0], w[1], w[2], "", w[3], "", "", "", "", 0]; if (!seen.has(wid(v))) words.push(v); }); }
  const shown = words.slice(0, mdWords);
  $("#md").innerHTML = `<button class="x" aria-label="${esc(t("close"))}">×</button>
    <div class="big">${esc(k.c)}</div>
    <div class="meta">${k.l ? `<span class="tag"><b>JLPT ${k.l}</b></span>` : `<span class="tag">${t("outJlpt")}</span>`}${k.s ? `<span class="tag">${t("strokes", { n: k.s })}</span>` : ""}${k.f ? `<span class="tag">${t("freq", { n: k.f })}</span>` : ""}</div>
    ${FULL ? `<button class="btn small ${isMine ? "" : "ghost"}" id="mineBtn" style="margin:0 auto 12px;display:flex">${isMine ? t("inMine") : t("addMine")}</button>` : ""}
    <div class="box"><h4>${t("meaning")}</h4><div class="v">${mm.a.length ? esc(mm.a.join(", ")) : `<span class="note">${t("noMeaning")}</span>`}${mm.en && mm.a.length ? enTag() : ""}</div></div>
    ${k.r ? `<div class="box"><h4>${t("commonR")}</h4><div class="v"><span class="rd">${esc(k.r[0])} <small>${esc(H2R(k.r[0]))} · ${k.r[1]}</small></span></div></div>` : ""}
    <div class="box"><h4>${t("onR")}</h4><div class="v">${readingList(k.o)}</div></div>
    <div class="box"><h4>${t("kunR")}</h4><div class="v">${readingList(k.k)}</div></div>
    ${compositionHtml(k)}
    <div class="box"><h4>${t("words")}</h4><p class="note">${t("wordsNote")}</p>${shown.length ? shown.map(wordRow).join("") : `<p class="note">${t("noWords")}</p>`}
    ${words.length > shown.length ? `<button class="btn small ghost" id="moreW" style="margin-top:8px">${t("moreWords")}</button>` : ""}</div>
    ${FULL ? "" : `<a href="#prezzo" class="btn small" id="unlockBtn">${t("unlock")}</a>`}`;
  const md = $("#md");
  md.querySelector(".x").onclick = closeMd;
  const mb = $("#mineBtn"); if (mb) mb.onclick = () => { isMine ? mine.delete(c) : mine.add(c); saveMine(); openKanji(c); refreshAfterMine(); };
  const more = $("#moreW"); if (more) more.onclick = () => { mdWords += 60; openKanji(c); };
  md.querySelectorAll(".part[data-c]").forEach(b => b.onclick = () => { mdWords = 60; openKanji(b.dataset.c); $("#ov").scrollTop = 0; });
  md.querySelectorAll(".fw").forEach(b => b.onclick = () => { const id = b.dataset.w; favW.has(id) ? favW.delete(id) : favW.add(id); saveFavW(); b.classList.toggle("on"); b.textContent = favW.has(id) ? "★" : "☆"; });
  const ub = $("#unlockBtn"); if (ub) ub.onclick = closeMd;
  $("#ov").classList.add("on");
}
function closeMd() { $("#ov").classList.remove("on"); }
function dialog(html, buttons) { // buttons: [[label, fn, primary]]
  $("#md").innerHTML = `<button class="x">×</button><h2 style="margin-top:4px">KanjiGo Web</h2><p>${html}</p><div class="row">${buttons.map((b, i) => `<button class="btn ${b[2] ? "" : "ghost"}" data-i="${i}">${esc(b[0])}</button>`).join("")}</div>`;
  $("#md .x").onclick = closeMd;
  $("#md").querySelectorAll("[data-i]").forEach(el => el.onclick = () => { closeMd(); const f = buttons[+el.dataset.i][1]; if (f) f(); });
  $("#ov").classList.add("on");
}

/* ---------------- app: struttura ---------------- */
let cur = "cerca";
const TABS = [["cerca", "tabCat"], ["livelli", "tabLev"], ["quiz", "tabQuiz"], ["flash", "tabFc"], ["mine", "tabMine"]];
function appShell() {
  $("#app").innerHTML = `
  <div class="toolbar"><div class="tabs" id="tabs">${TABS.map(([id, k]) => `<button class="tab${id === cur ? " on" : ""}" data-t="${id}">${t(k)}</button>`).join("")}</div>
  <button class="tab small" id="helpBtn">${t("help")}</button><label class="lang">${t("language")} <select id="langSel">${LANGS.map(l => `<option value="${l}"${l === LANG ? " selected" : ""}>${LNAME[l]}</option>`).join("")}</select></label></div>
  <section id="t-cerca"><input id="q" class="search" placeholder="${esc(t("searchPh"))}" autocomplete="off"><p id="qCount" class="count"></p><div id="qGrid" class="grid"></div></section>
  <section id="t-livelli" class="hide"><div class="lvls" id="lvBtns"></div><p id="lvCount" class="count"></p><div id="lvGrid" class="grid"></div><button id="lvMore" class="btn ghost more hide">${t("showMore")}</button><p class="note">${t("disclaimer")}</p></section>
  <section id="t-quiz" class="hide"></section>
  <section id="t-flash" class="hide"></section>
  <section id="t-mine" class="hide"></section>`;
  document.querySelectorAll("#tabs .tab").forEach(b => b.onclick = () => showTab(b.dataset.t));
  $("#langSel").onchange = e => { LANG = e.target.value; store.set("kgw_lang", LANG); document.documentElement.lang = LANG; const q = $("#q").value; appShell(); $("#q").value = q; doSearch(); showLevel(curLevel); showTab(cur); };
  $("#q").oninput = doSearch;
  $("#helpBtn").onclick = () => dialog(`<b>${t("helpTitle")}</b><br>${t("helpIntro")}<br><br>${["help1","help2","help3","help4","help5"].map(k => t(k)).join("<br><br>")}<br><br><span class="note">${t("disclaimer")}</span>`, [[t("ok"), null, 1]]);
  const L = ["N5", "N4", "N3", "N2", "N1", "Altri"];
  $("#lvBtns").innerHTML = L.map(l => `<button class="tab" data-l="${l}">${l === "Altri" ? t("others") : l}</button>`).join("");
  $("#lvBtns").querySelectorAll(".tab").forEach(b => b.onclick = () => showLevel(b.dataset.l));
  $("#lvMore").onclick = moreLevel;
}
function showTab(id) {
  cur = id;
  document.querySelectorAll("#tabs .tab").forEach(b => b.classList.toggle("on", b.dataset.t === id));
  TABS.forEach(([x]) => $("#t-" + x).classList.toggle("hide", x !== id));
  if (id === "quiz") { if (!runner) quizMenu(); }
  if (id === "flash") fcMenu();
  if (id === "mine") renderMine();
  window.scrollTo(0, 0);
}
function refreshAfterMine() { if (cur === "mine") renderMine(); }

/* catalogo */
function doSearch() {
  const raw = $("#q").value.trim(); let res;
  if (!raw) { res = D.K.filter(k => k.l === "N5"); $("#qCount").textContent = t("searchHint"); }
  else {
    const n = norm(raw), isLatin = /^[a-z' ]+$/i.test(raw), h = kata2hira(isLatin ? R2H(raw.replace(/[' ]/g, "")) : raw);
    const wordHits = new Set();
    if (raw.length >= 2) D.V.forEach(v => { if (v[1] === h || v[0] === raw || (isLatin && v[2].toLowerCase() === raw.toLowerCase()) || norm(vm(v, false)).split(/[,;]\s*/).some(x => x === n)) cjkChars(v[0]).forEach(ch => wordHits.add(ch)); });
    const score = k => {
      if (raw.includes(k.c)) return 0;
      const mm = km(k).a, all = mm.concat(LANG === "it" ? [] : (k.m || []));
      if (all.some(m => norm(m) === n)) return 1;
      if ((k.k || []).some(r => hiraR(r) === h) || (k.o || []).some(r => kata2hira(r) === h)) return 2;
      if (all.some(m => norm(m).includes(n))) return 3;
      if (wordHits.has(k.c)) return 4;
      return 9;
    };
    res = D.K.map(k => [score(k), k]).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0] || (!!a[1].e - !!b[1].e) || ((a[1].f || 99999) - (b[1].f || 99999))).map(x => x[1]);
    $("#qCount").textContent = res.length ? (res.length === 1 ? t("result1") : t("results", { n: res.length })) + (res.length > 120 ? t("first120") : "") : t("noResults");
  }
  $("#qGrid").innerHTML = res.slice(0, 120).map(card).join(""); bindCards($("#qGrid"));
}
/* livelli */
let lvList = [], lvShown = 0, curLevel = "N5";
function showLevel(l) {
  curLevel = l;
  $("#lvBtns").querySelectorAll(".tab").forEach(b => b.classList.toggle("on", b.dataset.l === l));
  lvList = l === "Altri" ? D.K.filter(k => !k.l) : D.K.filter(k => k.l === l);
  lvShown = 0; $("#lvGrid").innerHTML = ""; moreLevel();
  $("#lvCount").textContent = l === "Altri" ? t("lvOthers", { n: lvList.length }) : t("lvCount", { n: lvList.length, l });
}
function moreLevel() {
  const part = lvList.slice(lvShown, lvShown + 120); lvShown += part.length;
  const tmp = document.createElement("div"); tmp.innerHTML = part.map(card).join(""); bindCards(tmp);
  [...tmp.children].forEach(c => $("#lvGrid").appendChild(c));
  $("#lvMore").classList.toggle("hide", lvShown >= lvList.length);
}

/* ---------------- QUIZ ---------------- */
const QKEY = id => "kgw_q_" + id;
let quizScope = store.get("kgw_qscope", "N5"), runner = null;
const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
function kanjiPool(scope) { return scope === "MINE" ? D.K.filter(k => mine.has(k.c)) : D.K.filter(k => k.l === scope); }
function wordPool(scope) {
  const list = D.V.filter(v => v[1] && cjkChars(v[0]).length >= 2);
  return scope === "MINE" ? list.filter(v => cjkChars(v[0]).every(ch => mine.has(ch))) : list.filter(v => v[3] === scope);
}
const allJlpt = () => D.K.filter(k => k.l);
function pickOptions(answer, cands, key, exclude) { // 4 opzioni distinte
  const out = [answer], seen = new Set([key(answer)]);
  for (const c of shuffle(cands.slice())) { const k = key(c); if (!k || seen.has(k) || (exclude && exclude(c))) continue; seen.add(k); out.push(c); if (out.length === 4) break; }
  return out.length === 4 ? shuffle(out) : null;
}
const kReadings = k => new Set((k.o || []).map(hiraR).concat((k.k || []).map(hiraR)));
function readOf(k, rt) { return rt === "auto" ? (k.r && k.r[0]) : rt === "on" ? k.ro : k.rk; }
const RT = { auto: "rAuto", on: "ON", kun: "KUN" };
function modeTitle(scope, kind) {
  const sc = scope === "MINE" ? t("mineChip") : "JLPT " + scope;
  const p = kind.split("_");
  let x;
  if (kind === "mean_quick") x = t("qQuick");
  else if (kind === "mean_full") x = t("qFull");
  else if (kind === "mean_f") x = t("singles") + " · " + t("pMeanF");
  else if (kind === "mean_r") x = scope === "MINE" ? t("singles") + " · " + t("pMeanR") : t("qRev");
  else if (kind === "comp_f") x = t("compounds") + " · " + t("qCompF");
  else if (kind === "comp_r") x = t("compounds") + " · " + t("qCompR");
  else if (p[0] === "read") x = t("reading") + " · " + (p[1] === "auto" ? t("rAuto") : p[1].toUpperCase()) + " · " + (p[2] === "f" ? t("kToH") : t("hToK"));
  else if (p[0] === "rcomp") x = t("compounds") + " · " + (p[1] === "f" ? t("kToH") : t("hToK"));
  return sc + " · " + x;
}
function buildQuestions(scope, kind) {
  const p = kind.split("_"), N = kind === "mean_full" ? 1e9 : 10, qs = [];
  const KP = kanjiPool(scope), distK = KP.length >= 8 ? KP : allJlpt();
  if (p[0] === "mean") {
    const items = shuffle(KP.filter(k => kmQuiz(k)));
    const cands = distK.filter(k => kmQuiz(k));
    for (const k of items) {
      if (qs.length >= N) break;
      const ans = kmQuiz(k);
      const opts = pickOptions(k, cands, x => norm(kmQuiz(x)));
      if (!opts) continue;
      if (kind === "mean_r") qs.push({ p: t("chooseKanji"), big: ans, bigK: false, o: opts.map(x => x.c), a: k.c, ok: 1, ref: k.c });
      else qs.push({ p: t("whichMeaning"), big: k.c, bigK: true, o: opts.map(kmQuiz), a: ans, ref: k.c });
    }
  } else if (p[0] === "read") {
    const rt = p[1], dir = p[2];
    const items = shuffle(KP.filter(k => readOf(k, rt)));
    const cands = distK.filter(k => readOf(k, rt));
    for (const k of items) {
      if (qs.length >= N) break;
      const ans = readOf(k, rt), mine_ = kReadings(k);
      if (dir === "f") {
        const opts = pickOptions(k, cands, x => readOf(x, rt), x => mine_.has(readOf(x, rt)));
        if (opts) qs.push({ p: t("chooseReading") + (rt !== "auto" ? " · " + t("readingOf", { t: rt.toUpperCase() }) : ""), big: k.c, bigK: true, o: opts.map(x => readOf(x, rt)), a: ans, ref: k.c });
      } else {
        const opts = pickOptions(k, cands, x => x.c, x => kReadings(x).has(ans));
        if (opts) qs.push({ p: t("chooseKanji"), big: ans, bigK: false, kana: true, o: opts.map(x => x.c), a: k.c, ok: 1, ref: k.c });
      }
    }
  } else { // composti
    const WP = wordPool(scope).filter(v => p[0] === "rcomp" || vm(v, true));
    const distW = WP.length >= 8 ? WP : D.V.filter(v => v[1] && cjkChars(v[0]).length >= 2 && (p[0] === "rcomp" || vm(v, true)));
    for (const v of shuffle(WP.slice())) {
      if (qs.length >= N) break;
      const ref = wid(v);
      if (kind === "comp_f") { const o = pickOptions(v, distW, x => norm(vm(x, true))); if (o) qs.push({ p: t("wordMeaning"), big: v[0], bigK: true, o: o.map(x => vm(x, true)), a: vm(v, true), w: ref }); }
      else if (kind === "comp_r") { const o = pickOptions(v, distW, x => x[0], x => norm(vm(x, true)) === norm(vm(v, true))); if (o) qs.push({ p: t("chooseWord"), big: vm(v, true), bigK: false, o: o.map(x => x[0]), a: v[0], ok: 1, w: ref }); }
      else if (kind === "rcomp_f") { const o = pickOptions(v, distW, x => x[1]); if (o) qs.push({ p: t("chooseReading"), big: v[0], bigK: true, o: o.map(x => x[1]), a: v[1], w: ref }); }
      else { const o = pickOptions(v, distW, x => x[0], x => x[1] === v[1]); if (o) qs.push({ p: t("chooseWord"), big: v[1], bigK: false, kana: true, o: o.map(x => x[0]), a: v[0], ok: 1, w: ref }); }
    }
  }
  return qs;
}
function savedLine(scope, kind) {
  const s = store.get(QKEY(scope + ":" + kind), null); if (!s) return "";
  return `<div class="saved"><span>💾 ${t("savedAt", { i: Math.min(s.i + 1, s.qs.length), n: s.qs.length })}</span><button class="btn small" data-res="${scope}:${kind}">${t("resume")}</button><button class="btn small ghost" data-del="${scope}:${kind}">${t("del")}</button></div>`;
}
function modeCard(title, sub, kinds, scope, extra) {
  // kinds: [[kind, label]]
  return `<div class="mode"><h3>${title}</h3><p class="note">${sub}</p>${extra || ""}<div class="row">${kinds.map(([k, l]) => `<button class="btn small" data-go="${k}">${l}</button>`).join("")}</div>${kinds.map(([k]) => savedLine(scope, k)).join("")}</div>`;
}
function quizMenu() {
  runner = null;
  const sc = quizScope, box = $("#t-quiz");
  const chips = LEVELS.map(l => `<button class="tab${sc === l ? " on" : ""}" data-sc="${l}">JLPT ${l}</button>`).join("") + `<button class="tab${sc === "MINE" ? " on" : ""}" data-sc="MINE">${t("mineChip")}</button>`;
  const rtChoice = (name) => `<div class="chips" data-rt="${name}">${["auto", "on", "kun"].map((r, i) => `<label><input type="radio" name="${name}" value="${r}"${i === 0 ? " checked" : ""}> ${r === "auto" ? t("rAuto") : r.toUpperCase()}</label>`).join("")}</div>`;
  let html = `<p class="note">${t("quizIntro")}</p><div class="lvls">${chips}</div>`;
  const readKinds = ["auto", "on", "kun"].flatMap(r => [`read_${r}_f`, `read_${r}_r`]);
  const readSaved = readKinds.map(k => savedLine(sc, k)).join("");
  if (sc === "MINE") {
    html += `<div class="mode"><h3>${t("personalized")}</h3><p class="note">${t("personalHelp")}</p><p class="note"><b>${t("mineCount", { n: mine.size })}</b></p></div>`;
    html += modeCard(t("singles") + " · " + t("meaning"), "", [["mean_f", t("pMeanF")], ["mean_r", t("pMeanR")]], sc);
    html += `<div class="mode"><h3>${t("singles")} · ${t("reading")}</h3>${rtChoice("rtM")}<div class="row"><button class="btn small" data-read="f" data-rtn="rtM">${t("kToH")}</button><button class="btn small" data-read="r" data-rtn="rtM">${t("hToK")}</button></div>${readSaved}</div>`;
    html += modeCard(t("compounds") + " · " + t("meaning"), "", [["comp_f", t("qCompF")], ["comp_r", t("qCompR")]], sc);
    html += modeCard(t("compounds") + " · " + t("reading"), "", [["rcomp_f", t("kToH")], ["rcomp_r", t("hToK")]], sc);
  } else {
    html += modeCard(t("qQuick"), t("qQuickS"), [["mean_quick", t("start")]], sc);
    html += modeCard(t("qFull"), t("qFullS"), [["mean_full", t("start")]], sc);
    html += modeCard(t("qRev"), t("qRevS"), [["mean_r", t("start")]], sc);
    html += modeCard(t("qComp"), "10 · " + t("compounds"), [["comp_f", t("qCompF")], ["comp_r", t("qCompR")]], sc);
    html += `<div class="mode"><h3>${t("qRead")}</h3><p class="note">${t("qReadS")}</p>${rtChoice("rtL")}<div class="row"><button class="btn small" data-read="f" data-rtn="rtL">${t("kToH")}</button><button class="btn small" data-read="r" data-rtn="rtL">${t("hToK")}</button></div>${readSaved}</div>`;
    html += modeCard(t("qReadC"), t("qReadCS"), [["rcomp_f", t("kToH")], ["rcomp_r", t("hToK")]], sc);
  }
  html += historyHtml();
  box.innerHTML = html;
  box.querySelectorAll("[data-sc]").forEach(b => b.onclick = () => { quizScope = b.dataset.sc; store.set("kgw_qscope", quizScope); quizMenu(); });
  box.querySelectorAll("[data-go]").forEach(b => b.onclick = () => launch(sc, b.dataset.go));
  box.querySelectorAll("[data-read]").forEach(b => b.onclick = () => { const r = box.querySelector(`input[name="${b.dataset.rtn}"]:checked`).value; launch(sc, `read_${r}_${b.dataset.read}`); });
  box.querySelectorAll("[data-res]").forEach(b => b.onclick = () => { const s = store.get(QKEY(b.dataset.res), null); if (s) runQuiz(s); });
  box.querySelectorAll("[data-del]").forEach(b => b.onclick = () => dialog(esc(t("confirmDel")), [[t("cancel")], [t("del"), () => { store.del(QKEY(b.dataset.del)); quizMenu(); }, 1]]));
}
function launch(scope, kind) {
  const id = scope + ":" + kind;
  const go = () => {
    const qs = buildQuestions(scope, kind);
    if (qs.length < 1) { dialog(esc(t("notEnough")), [[t("ok"), null, 1]]); return; }
    runQuiz({ id, scope, kind, lang: LANG, qs, i: 0, ok: 0, ko: 0, sel: null, secs: 0, wrong: [] });
  };
  if (store.get(QKEY(id), null)) dialog(esc(t("replaceSaved")), [[t("cancel")], [t("newTest"), go, 1]]);
  else go();
}
function historyHtml() {
  const h = store.get("kgw_hist", []);
  const rows = h.slice(0, 10).map(x => `<div class="hrow"><span>${esc(x.kind ? modeTitle(x.scope, x.kind) : x.title)}</span><b>${x.ok}/${x.n}</b><span class="note">${fmtTime(x.secs)} · ${new Date(x.at).toLocaleDateString()}</span></div>`).join("");
  return `<div class="mode"><h3>${t("history")}</h3>${rows || `<p class="note">${t("noHistory")}</p>`}</div>`;
}
function runQuiz(state) {
  runner = state; let paused = false, timer = null, startAt = Date.now(), base = state.secs;
  const box = $("#t-quiz");
  const persist = () => { state.secs = base + (paused ? 0 : Math.floor((Date.now() - startAt) / 1000)); store.set(QKEY(state.id), state); };
  const tick = () => { if (!paused) { const el = $("#qzTime"); if (el) el.textContent = fmtTime(base + Math.floor((Date.now() - startAt) / 1000)); } };
  const stopTimer = () => { clearInterval(timer); timer = null; };
  timer = setInterval(() => { if (runner !== state) { stopTimer(); return; } tick(); }, 1000);
  const draw = () => {
    if (state.i >= state.qs.length) return finish();
    const q = state.qs[state.i], answered = state.sel != null;
    const optCls = o => !answered ? "" : (o === q.a ? " ok" : (o === state.sel ? " ko" : ""));
    let info = "";
    if (answered) {
      if (q.ref) { const k = byChar[q.ref]; if (k) info = `<b class="jp">${esc(k.c)}</b> · ${esc((k.r && k.r[0]) || hiraR((k.k || [])[0] || (k.o || [])[0] || ""))} — ${esc(km(k).a.join(", "))}`; }
      if (q.w) { const v = D.V.find(x => wid(x) === q.w); if (v) info = `<b class="jp">${esc(v[0])}</b> (${esc(v[1])}, ${esc(v[2])}) — ${esc(vmShow(v).m)}`; }
    }
    box.innerHTML = `<div class="qhead"><span>${t("question", { i: state.i + 1, n: state.qs.length })}</span><span>⏱ <b id="qzTime">${fmtTime(base + Math.floor((Date.now() - startAt) / 1000))}</b></span></div>
      <div class="bar"><i style="width:${(state.i + (answered ? 1 : 0)) * 100 / state.qs.length}%"></i></div>
      <div class="qhead"><span class="okc">✔ ${t("correctN", { n: state.ok })}</span><span class="koc">✘ ${t("wrongN", { n: state.ko })}</span></div>
      <div class="row"><button class="btn small ghost" id="qzPause">${paused ? "▶ " + t("go") : "⏸ " + t("stop")}</button><button class="btn small ghost" id="qzSave">💾 ${t("saveTest")}</button><button class="btn small ghost" id="qzExit">${t("exit")}</button></div>
      ${paused ? `<p class="warn" style="text-align:center">${t("paused")}</p>` : ""}
      <p class="qp">${esc(q.p)}</p>
      <div class="${q.bigK || q.kana ? "qk" : "qm"}">${esc(q.big)}</div>
      <div class="opts${q.ok ? " kopts" : ""}">${q.o.map((o, i) => `<button class="opt${optCls(o)}" data-i="${i}"${answered || paused ? " disabled" : ""}>${esc(o)}</button>`).join("")}</div>
      ${answered ? `<p class="fb">${state.sel === q.a ? "✅ " + t("right") : "❌ " + esc(t("rightAns", { a: q.a }))}</p>${info ? `<p class="fbi">${info}</p>` : ""}<button class="btn" id="qzNext" style="width:100%"${paused ? " disabled" : ""}>${state.i === state.qs.length - 1 ? t("seeRes") : t("next")}</button>` : ""}`;
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      const o = q.o[+b.dataset.i]; state.sel = o;
      if (o === q.a) state.ok++; else { state.ko++; state.wrong.push(q.ref || q.w); }
      persist(); draw();
    });
    $("#qzPause").onclick = () => { if (paused) { paused = false; startAt = Date.now(); } else { base += Math.floor((Date.now() - startAt) / 1000); paused = true; } persist(); draw(); };
    $("#qzSave").onclick = () => { persist(); toast(t("saved")); };
    $("#qzExit").onclick = () => { persist(); stopTimer(); quizMenu(); };
    const nx = $("#qzNext"); if (nx) nx.onclick = () => { state.i++; state.sel = null; persist(); draw(); window.scrollTo(0, $("#t-quiz").offsetTop - 70); };
  };
  const finish = () => {
    stopTimer();
    const secs = base + (paused ? 0 : Math.floor((Date.now() - startAt) / 1000));
    store.del(QKEY(state.id));
    const title = modeTitle(state.scope, state.kind);
    const h = store.get("kgw_hist", []); h.unshift({ scope: state.scope, kind: state.kind, ok: state.ok, n: state.qs.length, secs, at: Date.now() }); store.set("kgw_hist", h.slice(0, 50));
    const st = store.get("kgw_stats", { q: 0, c: 0, t: 0 }); st.q++; st.c += state.ok; st.t += state.qs.length; store.set("kgw_stats", st);
    const rev = [...new Set(state.wrong)].map(r => {
      if (byChar[r]) { const k = byChar[r]; return `<div class="word"><span class="w">${esc(k.c)}</span><span>${esc((k.r && k.r[0]) || "")} — ${esc(km(k).a.join(", "))}</span></div>`; }
      const v = D.V.find(x => wid(x) === r); return v ? wordRow(v) : "";
    }).join("");
    box.innerHTML = `<div class="result"><h2>${t("done")}</h2><p class="note">${esc(title)}</p><div class="sc">${state.ok} / ${state.qs.length}</div>
      <p>${t("correctN", { n: state.ok })} · ${t("wrongN", { n: state.ko })}</p><p>${t("score", { n: Math.round(state.ok * 100 / state.qs.length) })}</p><p>${t("time", { t: fmtTime(secs) })}</p>
      <div class="row" style="justify-content:center"><button class="btn" id="qzAgain">🔁 ${t("again")}</button><button class="btn ghost" id="qzBack">${t("backQuiz")}</button></div></div>
      ${rev ? `<div class="box"><h4>${t("review")}</h4>${rev}</div>` : ""}`;
    $("#qzAgain").onclick = () => launch(state.scope, state.kind);
    $("#qzBack").onclick = quizMenu;
    box.querySelectorAll(".fw").forEach(b => b.onclick = () => { const id = b.dataset.w; favW.has(id) ? favW.delete(id) : favW.add(id); saveFavW(); b.classList.toggle("on"); b.textContent = favW.has(id) ? "★" : "☆"; });
    runner = null;
  };
  showTabSilent("quiz");
  draw();
}
function showTabSilent(id) { cur = id; document.querySelectorAll("#tabs .tab").forEach(b => b.classList.toggle("on", b.dataset.t === id)); TABS.forEach(([x]) => $("#t-" + x).classList.toggle("hide", x !== id)); }
function toast(msg) { let el = $("#toast"); if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); } el.textContent = msg; el.className = "on"; clearTimeout(el._t); el._t = setTimeout(() => el.className = "", 2500); }

/* ---------------- FLASHCARD ---------------- */
let fcType = store.get("kgw_fctype", "k"), fcSrc = store.get("kgw_fcsrc", "N5"), fc = null;
function fcDeck() {
  if (fcType === "k") return fcSrc === "MINE" ? D.K.filter(k => mine.has(k.c)) : D.K.filter(k => k.l === fcSrc);
  if (fcSrc === "COMBO") return wordPool("MINE");
  if (fcSrc === "FAV") return D.V.filter(v => favW.has(wid(v)));
  return D.V.filter(v => v[3] === fcSrc && v[1] && cjkChars(v[0]).length >= 2);
}
function fcMenu() {
  const box = $("#t-flash");
  const srcs = fcType === "k" ? [...LEVELS.map(l => [l, "JLPT " + l]), ["MINE", t("fcMine")]] : [...LEVELS.map(l => [l, "JLPT " + l]), ["COMBO", t("fcCombo")], ["FAV", t("fcFav")]];
  if (!srcs.some(s => s[0] === fcSrc)) fcSrc = "N5";
  const deckKey = "kgw_fc_" + fcType + "_" + fcSrc;
  const list = fcDeck();
  let saved = store.get(deckKey, null);
  if (!fc || fc.key !== deckKey) {
    const ids = list.map(x => fcType === "k" ? x.c : wid(x));
    const idSet = new Set(ids);
    let order = saved && saved.order && saved.order.length === ids.length && saved.order.every(i => idSet.has(i)) ? saved.order : ids;
    fc = { key: deckKey, order, i: saved && saved.i < order.length ? saved.i : 0, open: {} };
  }
  box.innerHTML = `<div class="lvls"><button class="tab${fcType === "k" ? " on" : ""}" data-ft="k">${t("fcKanji")}</button><button class="tab${fcType === "w" ? " on" : ""}" data-ft="w">${t("fcWords")}</button></div>
    <div class="lvls">${srcs.map(([s, l]) => `<button class="tab small${fcSrc === s ? " on" : ""}" data-fs="${s}">${esc(l)}</button>`).join("")}</div><div id="fcBox"></div>`;
  box.querySelectorAll("[data-ft]").forEach(b => b.onclick = () => { fcType = b.dataset.ft; store.set("kgw_fctype", fcType); fc = null; fcMenu(); });
  box.querySelectorAll("[data-fs]").forEach(b => b.onclick = () => { fcSrc = b.dataset.fs; store.set("kgw_fcsrc", fcSrc); fc = null; fcMenu(); });
  drawCard();
}
function drawCard() {
  const box = $("#fcBox"); if (!box) return;
  const n = fc.order.length;
  if (!n) { box.innerHTML = `<p class="count">${fcType === "k" ? t("emptyMine") : fcSrc === "COMBO" ? t("emptyCombo") : t("emptyFav")}</p>`; return; }
  store.set(fc.key, { order: fc.order, i: fc.i });
  const id = fc.order[fc.i];
  let front, answers, star;
  if (fcType === "k") {
    const k = byChar[id], mm = km(k);
    front = `<div class="qk">${esc(k.c)}</div>`;
    answers = [[t("meaning"), esc(mm.a.join(", ")) + (mm.en ? enTag() : "")], [t("readings"), `ON: ${esc((k.o || []).join("、") || "—")}<br>KUN: ${esc((k.k || []).join("、") || "—")}`]];
    star = `<button class="btn small ${mine.has(id) ? "" : "ghost"}" id="fcStar">${mine.has(id) ? t("inMine") : t("addMine")}</button>`;
  } else {
    const v = D.V.find(x => wid(x) === id), s = vmShow(v);
    front = `<div class="qk">${esc(v[0])}</div>${v[3] ? `<span class="tag">${esc(v[3])}</span>` : ""}`;
    answers = [[t("reading"), esc(v[1]) + " · " + esc(v[2])], [t("meaning"), esc(s.m) + (s.en ? enTag() : "")]];
    star = `<button class="btn small ${favW.has(id) ? "" : "ghost"}" id="fcStar">${favW.has(id) ? "★" : "☆"} ${t("fcFav")}</button>`;
  }
  const allOpen = answers.every((_, i) => fc.open[i]);
  box.innerHTML = `<p class="count">${t("card", { i: fc.i + 1, n })} · ${t("tapReveal")}</p>
    <div class="flash">${front}${answers.map(([h, v], i) => `<div class="ans${fc.open[i] ? " open" : ""}" data-a="${i}"><h4>${esc(h)}</h4><div>${fc.open[i] ? v : `<span class="note">${t("hidden")}</span>`}</div></div>`).join("")}<div style="margin-top:10px">${star}</div></div>
    <div class="row" style="justify-content:center;margin-top:12px"><button class="btn ghost" id="fcPrev">${t("prev")}</button><button class="btn ghost" id="fcAll">${allOpen ? t("hideAll") : t("revealAll")}</button><button class="btn ghost" id="fcShuf">${t("shuffle")}</button><button class="btn" id="fcNext">${t("nextC")}</button></div>`;
  box.querySelectorAll(".ans").forEach(el => el.onclick = () => { fc.open[el.dataset.a] = !fc.open[el.dataset.a]; drawCard(); });
  $("#fcAll").onclick = () => { answers.forEach((_, i) => fc.open[i] = !allOpen); drawCard(); };
  $("#fcPrev").onclick = () => { fc.i = (fc.i - 1 + n) % n; fc.open = {}; drawCard(); };
  $("#fcNext").onclick = () => { fc.i = (fc.i + 1) % n; fc.open = {}; drawCard(); };
  $("#fcShuf").onclick = () => { fc.order = shuffle(fc.order.slice()); fc.i = 0; fc.open = {}; drawCard(); };
  $("#fcStar").onclick = () => {
    if (fcType === "k") { mine.has(id) ? mine.delete(id) : mine.add(id); saveMine(); }
    else { favW.has(id) ? favW.delete(id) : favW.add(id); saveFavW(); }
    drawCard();
  };
}

/* ---------------- I MIEI KANJI ---------------- */
function renderMine() {
  const box = $("#t-mine");
  const list = D.K.filter(k => mine.has(k.c));
  const words = D.V.filter(v => favW.has(wid(v)));
  const st = store.get("kgw_stats", { q: 0, c: 0, t: 0 });
  box.innerHTML = `<div class="mode"><h3>${t("progress")}</h3><p>${t("progStats", st)}</p></div>
    <div class="row"><button class="btn small" id="mQuiz">${t("goQuiz")}</button><button class="btn small ghost" id="mFc">${t("goFc")}</button></div>
    <p class="count">${list.length ? t("mineCount", { n: list.length }) : t("emptyMine")}</p><div class="grid" id="mGrid">${list.map(card).join("")}</div>
    <h3 style="margin-top:24px">${t("favWords", { n: words.length })}</h3><div class="box">${words.length ? words.map(wordRow).join("") : `<p class="note">${t("emptyFav")}</p>`}</div>`;
  bindCards($("#mGrid"));
  box.querySelectorAll(".fw").forEach(b => b.onclick = () => { const id = b.dataset.w; favW.delete(id); saveFavW(); renderMine(); });
  $("#mQuiz").onclick = () => { quizScope = "MINE"; store.set("kgw_qscope", "MINE"); showTab("quiz"); quizMenu(); };
  $("#mFc").onclick = () => { fcType = "k"; fcSrc = "MINE"; fc = null; showTab("flash"); };
}

/* ---------------- avvio ---------------- */
function startApp(data) {
  load(data, true);
  const n5 = document.getElementById("n5free"); if (n5) n5.classList.add("hide");
  document.documentElement.lang = LANG;
  appShell(); doSearch(); showLevel("N5");
}
$("#ov").addEventListener("click", e => { if (e.target.id === "ov") closeMd(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMd(); });

window.KG = { load, startApp, card, bindCards, openKanji, closeMd, dialog, t, setLang(l) { LANG = l; }, get lang() { return LANG; }, get D() { return D; } };
})();
