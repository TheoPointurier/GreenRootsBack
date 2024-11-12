//Fonction pour gérer les accents dans la searchbar
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\p{Diacritic}]/gu, '');
}

function filterSearchBar() {
  const filter = removeAccents(
    document.querySelector('.searchInput').value.toLowerCase(),
  );

  // Récupère toutes les lignes du tableau
  const tableRows = document.querySelectorAll('.treeTableBody tr');

  for (row of tableRows) {
    // Récupère le texte de toutes les cellules de la ligne
    const cells = row.getElementsByTagName('td');
    let rowText = '';

    // Concatène le texte de toutes les cellules pour une recherche sur plusieurs colonnes
    for (const cell of cells) {
      rowText += `${removeAccents(cell.textContent.toLowerCase())} `;
    }

    //Si saisie dans la searchbar est dans le texte de la ligne, on affiche la ligne, sinon display none
    if (rowText.includes(filter)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  }
}
