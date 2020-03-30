
/* Wypisuje do konsoli zawartosc pola z imieniem */
/*let el = document.querySelector("input[name=fname]") as HTMLInputElement;
console.log(el.value);*/

let komunikat = document.querySelector(".message") as HTMLElement;

function message(text:string):void {
    /* Dodaje cien */
    const shadow = document.createElement("div");
    shadow.setAttribute("class", "shadow");
    document.body.appendChild(shadow);

    /* Wyswietla komunikat */
    komunikat.querySelector("p").innerHTML = text;
    komunikat.style.display="inline";
}

message("Zamknij, żeby przejść do strony");

/* Ukrywa komunikat i usuwa cień */
function zamknij():void {
    komunikat.style.display="none";
    const shadow = document.querySelector(".shadow") as HTMLElement;
    shadow.remove();
}


/* Po dwoch sekundach wypisuje tekst na konsole */
/*setTimeout(() => {
    console.log("No już wreszcie.");
  }, 2000);*/