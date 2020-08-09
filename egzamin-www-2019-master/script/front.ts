fetch(`/newentries`, {
  method: 'get',
  headers: {
    'Accept': 'application/json, text/plain, */*'
  }
}).then(async (response) => {
  const entries = JSON.parse(await response.json());

  const container = document.getElementById("ostatnieWpisy") as HTMLElement;

  entries.forEach((entry: any) => {
    const li: HTMLElement = document.createElement('li');
    li.innerText = `${entry.login_osoby}: ${entry.tresc} (${entry.timestamp})`;
    container.appendChild(li);
  });

});