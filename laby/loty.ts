const listaPasazerow = document.getElementById("passengerList");
const elementyListy : HTMLCollection = listaPasazerow.getElementsByTagName("li");

for (let i : number = 0; i < elementyListy.length; i++){
    elementyListy.item(i).setAttribute('data-pasazer-id', (Math.floor(Math.random() * 1000) + 1).toString());
}
