function displayEditTreeModal(treeId) {
  document.getElementById(`editTreeModal-${treeId}`).classList.remove('hidden');
}

function hideEditTreeModal(treeId) {
  document.getElementById(`editTreeModal-${treeId}`).classList.add('hidden');
}

async function editTree(event, treeId) {
  event.preventDefault();

  const id = document.querySelector(
    `#editTreeModal-${treeId} input[name="id"]`,
  ).value;
  const name = document.querySelector(
    `#editTreeModal-${treeId} input[name="name"]`,
  ).value;
  const price_ht =
    document.querySelector(`#editTreeModal-${treeId} input[name="price_ht"]`)
      .value || null;
  const quantity =
    document.querySelector(`#editTreeModal-${treeId} input[name="quantity"]`)
      .value || null;
  const age =
    document.querySelector(`#editTreeModal-${treeId} input[name="age"]`)
      .value || null;
  const species_name = document.querySelector(
    `#editTreeModal-${treeId} input[name="species_name"]`,
  ).value;
  const description =
    document.querySelector(`#editTreeModal-${treeId} input[name="description"]`)
      .value || null;
  const co2_absorption =
    document.querySelector(
      `#editTreeModal-${treeId} input[name="co2_absorption"]`,
    ).value || null;
  const average_lifespan =
    document.querySelector(
      `#editTreeModal-${treeId} input[name="average_lifespan"]`,
    ).value || null;

  const body = JSON.stringify({
    name,
    price_ht: price_ht ? Number.parseFloat(price_ht) : null,
    quantity: quantity ? Number.parseInt(quantity) : null,
    age: age ? Number.parseInt(age) : null,
    species: {
      species_name,
      description,
      co2_absorption: co2_absorption ? Number.parseFloat(co2_absorption) : null,
      average_lifespan: average_lifespan
        ? Number.parseInt(average_lifespan)
        : null,
    },
  });

  try {
    const response = await fetch(`/admin/trees/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.ok) {
      console.log('Arbre mis à jour avec succès');
      window.location.reload();
    } else {
      console.error("Erreur lors de la mise à jour de l'arbre");
    }
  } catch (error) {
    console.error("Erreur réseau lors de la mise à jour de l'arbre", error);
  }
}

function displayDeleteTreeModal(treeId) {
  document
    .getElementById(`deleteTreeModal-${treeId}`)
    .classList.remove('hidden');
  document.getElementById(`confirmDeleteButton-${treeId}`).onclick = () =>
    deleteTree(treeId);
}

function hideDeleteTreeModal(treeId) {
  document.getElementById(`deleteTreeModal-${treeId}`).classList.add('hidden');
}

async function deleteTree(treeId) {
  try {
    const response = await fetch(`/admin/trees/${treeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Arbre supprimé avec succès');
      window.location.reload();
    } else {
      console.error("Erreur lors de la suppression de l'arbre");
    }
  } catch (error) {
    console.error("Erreur réseau lors de la suppression de l'arbre", error);
  }
}

function displayCreateTreeModal() {
  document.getElementById('createTreeModal').classList.remove('hidden');
}

function hideCreateTreeModal() {
  document.getElementById('createTreeModal').classList.add('hidden');
}

async function createTree(event) {
  event.preventDefault();

  const form = document.querySelector('#createTreeForm');

  // Vérifie si le formulaire est valide avant de continuer
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Prépare les données du formulaire
  const name = document.getElementById('createTreeName').value;
  const price_ht = document.getElementById('createTreePriceHt').value || null;
  const quantity = document.getElementById('createTreeQuantity').value || null;
  const age = document.getElementById('createTreeAge').value || null;
  const species_name = document.getElementById('createTreeSpecies').value;
  const description = document.getElementById('createTreeDescription').value;
  const co2_absorption =
    document.getElementById('createTreeCo2Absorption').value || null;
  const average_lifespan =
    document.getElementById('createTreeAverageLifespan').value || null;

  const body = JSON.stringify({
    name,
    price_ht: Number.parseInt(price_ht),
    quantity: Number.parseInt(quantity),
    age: Number.parseInt(age),
    species: {
      species_name,
      description,
      co2_absorption: Number.parseInt(co2_absorption),
      average_lifespan: Number.parseInt(average_lifespan),
    },
  });
  try {
    const response = await fetch('/admin/trees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.ok) {
      console.log('Arbre créé avec succès');
      window.location.href = '/admin/trees';
    } else {
      const error = await response.json();
      console.error("Erreur lors de la création de l'arbre", error);
      console.error("Erreur lors de la création de l'arbre");
      next();
    }
  } catch (error) {
    console.error("Erreur réseau lors de la création de l'arbre", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    const treeId = event.target.dataset.treeId;

    if (!action) return; // Si l'attribut data-action n'est pas défini, on ne fait rien

    switch (action) {
      case 'displayEditTreeModal':
        displayEditTreeModal(treeId);
        break;
      case 'hideEditTreeModal':
        hideEditTreeModal(treeId);
        break;
      case 'displayDeleteTreeModal':
        displayDeleteTreeModal(treeId);
        break;
      case 'hideDeleteTreeModal':
        hideDeleteTreeModal(treeId);
        break;
      case 'displayCreateTreeModal':
        displayCreateTreeModal();
        break;
      case 'hideCreateTreeModal':
        hideCreateTreeModal();
        break;
      case 'createTree':
        createTree(event);
        break;
      case 'editTree':
        editTree(event, treeId);
        break;
      case 'deleteTree':
        deleteTree(treeId);
        break;
      default:
        console.error(`Action non gérée : ${action}`);
    }
  });

  // Pour gérer la recherche dans la barre de recherche
  document
    .querySelector('.searchInput')
    ?.addEventListener('keyup', filterSearchBar);
});
