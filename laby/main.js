/*let jsonString: string = `{
    "piloci": [
        "Pirx",
        "Exupery",
        "Idzikowski",
        "Główczewski"
    ],
    "lotniska": {
        "WAW": ["Warszawa", [3690, 2800]],
        "NRT": ["Narita", [4000, 2500]],
        "BQH": ["Biggin Hill", [1802, 792]],
        "LBG": ["Paris-Le Bourget", [2665, 3000, 1845]]
    }
}`;

interface ILotnisko {
    [nazwa: string]: [string, number[]];
}

type Pilot = string;

interface ILiniaLotnicza {
    piloci: Pilot[];
    lotniska: ILotnisko;
}
let daneLiniiLotniczej = JSON.parse(jsonString);

function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza {
    return dane.piloci !== undefined && dane.lotniska !== undefined;
}

if (sprawdzDaneLiniiLotniczej(daneLiniiLotniczej)) {
    const juzNaPewnoDaneLinii = daneLiniiLotniczej;
    console.log(juzNaPewnoDaneLinii);
}*/
let komunikat = document.querySelector(".message");
function message(text) {
    /* Dodaje cien */
    const shadow = document.createElement("div");
    shadow.setAttribute("class", "shadow");
    document.body.appendChild(shadow);
    /* Wyswietla komunikat */
    komunikat.querySelector("p").innerHTML = text;
    komunikat.style.display = "inline";
}
/* Ukrywa komunikat i usuwa cień */
function zamknij() {
    komunikat.style.display = "none";
    const shadow = document.querySelector(".shadow");
    shadow.remove();
}
/*
function fib(n: number): number {
    if (n < 2) return 1;
    return fib(n - 1) + fib(n - 2);
}*/
/** DZIŁA? */ /*
document.addEventListener("click", (e : Event) => {
    const target = e.target as HTMLElement;
    let clickCount = parseInt(target.dataset['clickCount'] || "0");
    console.log(fib(clickCount));
    clickCount++;
    target.dataset['clickCount'] = clickCount.toString();
})*/
let elForm = document.getElementById("rezerwacjaForm");
let elZamknij = document.getElementById("zamknijpopup");
const textFieldImie = document.getElementById("fname");
const textFieldNazwisko = document.getElementById("lname");
const textFieldData = document.getElementById("date");
elForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (textFieldImie.value === "") {
        message("Pole imię nie może być puste.");
    }
    else if (textFieldNazwisko.value === "") {
        message("Pole nazwisko nie może być puste.");
    }
    else if (textFieldData.value === "") {
        message("Proszę wybrać datę.");
    }
    else {
        const GivenDate = new Date(textFieldData.value);
        const CurrentDate = new Date();
        if (GivenDate <= CurrentDate) {
            message("Wybrano za wczesną datę.");
        }
        else {
            // Tutaj wszystko ok
        }
    }
    // message('Kliknięto submit');
});
elZamknij.addEventListener("click", (e) => {
    zamknij();
});
let lotyOdwolane = document.getElementsByClassName("lotOdwolany");
let naglowek = document.getElementsByTagName("header");
function changeColor(seconds, color, el) {
    return new Promise(resolve => {
        for (const e of el)
            e.style.backgroundColor = color;
        setTimeout(resolve, seconds * 1000);
    });
}
function teczoweKolory(el) {
    changeColor(2, "red", el).then(() => changeColor(2, "orange", el)).then(() => changeColor(2, "yellow", el)).then(() => changeColor(2, "green", el)).then(() => changeColor(2, "blue", el)).then(() => changeColor(2, "indigo", el)).then(() => changeColor(2, "purple", el));
}
function losoweKolory(el) {
    let promise = changeColor(2, "white", el);
    let i = 0;
    while (i < 10) {
        promise = promise.then(() => changeColor(2, "#" + Math.floor(Math.random() * 16777215).toString(16), el));
        i++;
    }
}
teczoweKolory(lotyOdwolane);
losoweKolory(naglowek);
