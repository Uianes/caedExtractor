document.getElementById('extrairDados').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
      {
          target: { tabId: tab.id },
          function: extrairDadosDaTabela,
      },
      (injectionResults) => {
          const result = injectionResults[0].result;
          document.getElementById('resultado').textContent = JSON.stringify(result, null, 2);
      }
  );
});

function extrairDadosDaTabela() {
  // Seleciona todas as divs com a classe table-holder
  const tableHolders = document.querySelectorAll('.table-holder.ng-scope');
  if (tableHolders.length < 3) {
      return 'Menos de 3 tabelas encontradas.';
  }

  // Seleciona a terceira div
  const tableHolder = tableHolders[2]; // Índice 2 para a terceira
  const table = tableHolder.querySelector('table'); // Seleciona a tabela dentro da terceira div
  if (!table) {
      return 'Tabela não encontrada na terceira div.';
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const data = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return cells.map(cell => cell.innerText.trim());
  });

  return data;
}
