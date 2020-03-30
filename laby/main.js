/* Wypisuje do konsoli zawartosc pola z imieniem */
/*let el = document.querySelector("input[name=fname]") as HTMLInputElement;
console.log(el.value);*/
var komunikat = document.querySelector(".message");
function message(text) {
    /* Dodaje cien */
    var shadow = document.createElement("div");
    shadow.setAttribute("class", "shadow");
    document.body.appendChild(shadow);
    /* Wyswietla komunikat */
    komunikat.querySelector("p").innerHTML = text;
    komunikat.style.display = "inline";
}
message("Zamknij, żeby przejść do strony");
/* Ukrywa komunikat i usuwa cień */
function zamknij() {
    komunikat.style.display = "none";
    var shadow = document.querySelector(".shadow");
    shadow.remove();
}
/* Po dwoch sekundach wypisuje tekst na konsole */
/*setTimeout(() => {
    console.log("No już wreszcie.");
  }, 2000);*/ 
