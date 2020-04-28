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

/* Ukrywa komunikat i usuwa cień */
function zamknij():void {
    komunikat.style.display="none";
    const shadow = document.querySelector(".shadow") as HTMLElement;
    shadow.remove();
}



/*
function fib(n: number): number {
    if (n < 2) return 1;
    return fib(n - 1) + fib(n - 2);
}*/

/** DZIŁA? *//*
document.addEventListener("click", (e : Event) => {
    const target = e.target as HTMLElement;
    let clickCount = parseInt(target.dataset['clickCount'] || "0");
    console.log(fib(clickCount));
    clickCount++;
    target.dataset['clickCount'] = clickCount.toString();
})*/


let elForm = document.getElementById("rezerwacjaForm") as HTMLInputElement;
let elZamknij = document.getElementById("zamknijpopup") as HTMLElement;

const textFieldImie = document.getElementById("fname") as HTMLInputElement;
const textFieldNazwisko = document.getElementById("lname") as HTMLInputElement;
const textFieldData = document.getElementById("date") as HTMLInputElement;

elForm.addEventListener("submit", (e : Event) => {
    e.preventDefault();
    if (textFieldImie.value === "") {
        message("Pole imię nie może być puste.");
    } else if (textFieldNazwisko.value === "") {
        message("Pole nazwisko nie może być puste.");
    } else if (textFieldData.value === "") {
        message("Proszę wybrać datę.");
    } else {
        const GivenDate = new Date(textFieldData.value);
        const CurrentDate = new Date();
        if (GivenDate <= CurrentDate) {
            message("Wybrano za wczesną datę.");
        } else {
            message(`Formularz wysłany. Imię: ${textFieldImie.value},
                Nazwisko: ${textFieldNazwisko.value},
                Data: ${textFieldData.value}
                `);
        }
    }
    // message('Kliknięto submit');
})

elZamknij.addEventListener("click", (e : Event) => {
    zamknij();
})


let lotyOdwolane = document.getElementsByClassName("lotOdwolany") as HTMLCollectionOf<HTMLElement>;
let naglowek = document.getElementsByTagName("header") as HTMLCollectionOf<HTMLElement>;

function changeColor(seconds : number, color : string, el: HTMLCollectionOf<HTMLElement>) : Promise<void> {
    return new Promise(resolve => {
        for (const e of el)
            e.style.backgroundColor = color;

        setTimeout(resolve, seconds * 1000);
    });
}

function teczoweKolory(el: HTMLCollectionOf<HTMLElement>) {
    changeColor(2, "red", el).then(
        () => changeColor(2, "orange", el)
    ).then(
        () => changeColor(2, "yellow", el)
    ).then(
        () => changeColor(2, "green", el)
    ).then(
        () => changeColor(2, "blue", el)
    ).then(
        () => changeColor(2, "indigo", el)
    ).then(
        () => changeColor(2, "purple", el)
    );
}

function losoweKolory(el: HTMLCollectionOf<HTMLElement>) {
    let promise = changeColor(2, "white", el);
    let i = 0
    while (i < 10){
        promise = promise.then(() => changeColor(2, "#" + Math.floor(Math.random() * 16777215).toString(16), el));
        i++;
    }
}
// teczoweKolory(lotyOdwolane);
losoweKolory(naglowek);


let canc = document.getElementsByClassName("cancelled")[0] as HTMLElement;
canc.style.background = "pink";
canc.addEventListener("click", () => {
    canc.style.background = "green";
    console.log("kliknieto");
});

document.body.addEventListener("click", (ev : MouseEvent) => {
    if (document.getElementsByClassName("rezerwacja")[0].contains(ev.target as Node)) {
        (document.getElementsByClassName("rezerwacja")[0] as HTMLElement).style.background = "red";
    }
});

document.getElementsByClassName("rezerwacja")[0].addEventListener("input",
    () => {
        if (textFieldImie.value === "" || textFieldNazwisko.value === "" ||
            textFieldData.value === "" || new Date(textFieldData.value) <= new Date()) {
                (document.getElementById("sbm") as HTMLInputElement).disabled = true;
                // console.log("pusto lub za wczesna data");
        } else {
            (document.getElementById("sbm") as HTMLInputElement).disabled = false;
        }

    }
);
