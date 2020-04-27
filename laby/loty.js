var listaPasazerow = document.getElementById("passengerList");
var elementyListy = listaPasazerow.getElementsByTagName("li");
for (var i = 0; i < elementyListy.length; i++) {
    elementyListy.item(i).setAttribute('data-pasazer-id', (Math.floor(Math.random() * 1000) + 1).toString());
}
//# sourceMappingURL=loty.js.map