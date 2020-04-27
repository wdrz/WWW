let el = document.getElementById("akapitZawartosc") as HTMLElement;
let zdj = document.getElementById("zdjZawartosc") as HTMLImageElement;

fetch('https://api.github.com/repos/Microsoft/TypeScript/commits')
    .then((response) => {
        return response.json();
        // return response.text();
    })
    .then((data) => {
        el.innerText = data[0].commit.author.name;
        zdj.src = data[0].author.avatar_url;
    })
    .catch(() => {
        el.innerText = "error";
    });

