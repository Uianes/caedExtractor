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

  // Extraindo o cabeçalho
  const headerCells = Array.from(table.querySelectorAll('thead th'));
  const header = headerCells.map(cell => cell.innerText.trim());

  // Extraindo os dados dos alunos
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const data = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return cells.map(cell => cell.innerText.trim());
  });

  // Extraindo a opção selecionada do select (Etapa)
  const selectEtapa = document.getElementById('selectrl0k62e2f97eDADOS.VL_FILTRO_ETAPA');
  const selectedEtapa = selectEtapa ? selectEtapa.options[selectEtapa.selectedIndex].text.trim() : 'Nenhuma etapa selecionada';
  
  // Extraindo a disciplina selecionada do select
  const selectDisciplina = document.getElementById('selectuwbpa24dd3d6DADOS.VL_FILTRO_DISCIPLINA');
  const selectedDisciplina = selectDisciplina ? selectDisciplina.options[selectDisciplina.selectedIndex].text.trim() : 'Nenhuma disciplina selecionada';

  // Retornando um objeto com o cabeçalho, dados, a etapa selecionada e a disciplina selecionada
  return {
      header,
      data,
      selectedEtapa,
      selectedDisciplina
  };
}