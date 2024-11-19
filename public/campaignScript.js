function displayEditCampaignModal(
  id,
  name,
  description,
  start_campaign,
  end_campaign,
  location,
  country,
  treeCampaign,
) {
  console.log('Données reçues pour modification : ', {
    id,
    name,
    description,
    start_campaign,
    end_campaign,
    location,
    country,
    treeCampaign,
  });

  // Étape 1 : Afficher la modal
  const editModal = document.getElementById('editModal');
  editModal.classList.remove('hidden');

  // Étape 2 : Remplir les champs avec les données
  document.getElementById('editId').value = id || '';
  document.getElementById('editName').value = name || '';
  document.getElementById('editDescription').value = description || '';
  document.getElementById('editStartCampain').value = start_campaign
    ? new Date(start_campaign).toISOString().split('T')[0]
    : '';
  document.getElementById('editEndCampain').value = end_campaign
    ? new Date(end_campaign).toISOString().split('T')[0]
    : '';
  document.getElementById('editLocation').value = location || '';
  document.getElementById('editCountry').value = country || '';

  // Étape 3 : Gérer les arbres inclus/exclus
  const parsedTreeCampaign = JSON.parse(treeCampaign); // Convertir la chaîne JSON en objet
  const treeIdsInCampaign = parsedTreeCampaign.map((tree) => tree.id); // Liste des IDs d'arbres inclus

  // Sélectionner tous les boutons radio
  const allRadioButtons = document.querySelectorAll(
    '#editModal input[type="radio"]',
  );

  // Réinitialiser tous les boutons radio à "exclude"
  for (const radio of allRadioButtons) {
    radio.checked = radio.value === 'exclude';
  }

  // Cocher les boutons radio "include" pour les arbres dans `treeIdsInCampaign`
  for (const treeId of treeIdsInCampaign) {
    const includeRadio = document.querySelector(
      `#editModal input[type="radio"][name="tree_${treeId}"][value="include"]`,
    );
    if (includeRadio) {
      includeRadio.checked = true;
    }
  }

  console.log('Modal de modification affichée avec succès.');
}

function hideEditCampaignModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function editCampaign(event) {
  event.preventDefault();

  // Récupérer les données du formulaire
  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value;
  const description = document.getElementById('editDescription').value;
  const start_campaign =
    document.getElementById('editStartCampain').value || null;
  const end_campaign = document.getElementById('editEndCampain').value || null;
  const location = {
    name_location: document.getElementById('editLocation').value,
    country: {
      name: document.getElementById('editCountry').value,
    },
  };

  const treesCampaign = [];
  const allRadioButtons = document.querySelectorAll(
    '#editTreesContainer input[type="radio"]',
  );

  // biome-ignore lint/complexity/noForEach: <explanation>
  allRadioButtons.forEach((radio) => {
    if (radio.value === 'include' && radio.checked) {
      treesCampaign.push({ id: Number.parseInt(radio.dataset.treeId, 10) });
    }
  });

  // Préparer le corps de la requête
  const body = JSON.stringify({
    name,
    description,
    start_campaign,
    end_campaign,
    location,
    treesCampaign,
  });

  try {
    const response = await fetch(`/admin/campaigns/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.ok) {
      console.log('Campagne mise à jour avec succès');
      window.location.reload();
    } else {
      console.error('Erreur lors de la mise à jour', await response.json());
    }
  } catch (error) {
    console.error('Erreur réseau lors de la mise à jour de la campagne', error);
  }
}

function displayDeleteCampaignModal(id, name) {
  console.log('Données reçues pour suppression : ', { id, name });

  // Étape 1 : Afficher la modal
  const deleteModal = document.getElementById('deleteCampaignModal');
  deleteModal.classList.remove('hidden');

  // Étape 2 : Afficher le nom de la campagne dans le message de confirmation
  const campaignNameSpan = document.getElementById('deleteCampaignName');
  campaignNameSpan.textContent = name;

  // Étape 3 : Configurer le bouton "Confirmer"
  const confirmDeleteButton = document.getElementById('confirmDeleteButton');
  confirmDeleteButton.onclick = () => deleteCampaign(id);

  console.log('Modal de suppression affichée avec succès.');
}

function hideDeleteCampaignModal() {
  document.getElementById('deleteCampaignModal').classList.add('hidden');
}

async function deleteCampaign(id) {
  try {
    const response = await fetch(`/admin/campaigns/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Campagne supprimée avec succès');
      window.location.reload();
    } else {
      console.error('Erreur lors de la suppression de la campagne');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la suppression de la campagne', error);
  }
}

function displayCreateCampaignModal() {
  document.getElementById('createModal').classList.remove('hidden');
}

function hideCreateCampaignModal() {
  document.getElementById('createModal').classList.add('hidden');
}

async function createCampaign(event) {
  event.preventDefault();

  const name = document.getElementById('createName').value;
  const description = document.getElementById('createDescription').value;
  const start_campaign =
    document.getElementById('createStartCampain').value || null;
  const end_campaign =
    document.getElementById('createEndCampain').value || null;
  const location = {
    name_location: document.getElementById('createLocation').value,
    country: {
      name: document.getElementById('createCountry').value,
    },
  };

  const treesCampaign = [];

  const allRadioButtons = document.querySelectorAll(
    '#createModal input[type="radio"]',
  );

  for (const radio of allRadioButtons) {
    const treeId = radio.getAttribute('data-tree-id');
    if (radio.value === 'include' && radio.checked) {
      treesCampaign.push({ id: Number.parseInt(treeId) });
    }
  }

  try {
    const response = await fetch('/admin/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        start_campaign,
        end_campaign,
        location,
        treesCampaign,
      }),
    });

    if (response.ok) {
      console.log('Campagne crée avec succès');
      window.location.reload();
    } else {
      console.error('Erreur lors de la création de la campagne');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la création de la campagne', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const createButton = document.getElementById('create_button-campaign');
  if (createButton) {
    createButton.addEventListener('click', () => {
      displayCreateCampaignModal();
    });
  } else {
    console.warn('Le bouton #create_button est introuvable.');
  }

  // Boutons de modification
  // biome-ignore lint/complexity/noForEach: <explanation>
  document.querySelectorAll('.button.save').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const name = button.dataset.name;
      const description = button.dataset.description;
      const start_campaign = button.dataset.start;
      const end_campaign = button.dataset.end;
      const location = button.dataset.location;
      const country = button.dataset.country;
      const trees = button.dataset.trees; // Les données des arbres sont au format JSON

      displayEditCampaignModal(
        id,
        name,
        description,
        start_campaign,
        end_campaign,
        location,
        country,
        trees,
      );
    });
  });

  // Boutons de suppression
  // biome-ignore lint/complexity/noForEach: <explanation>
  document.querySelectorAll('.delete.button').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const name = button.dataset.name; // Récupération du nom pour affichage

      displayDeleteCampaignModal(id, name);
    });
  });
  // Bouton d'annulation dans le formulaire de modification
  const cancelEditButton = document.getElementById('cancelEditButton');
  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', () => {
      hideEditCampaignModal();
    });
  }

  // Bouton d'annulation dans le formulaire de suppression
  const cancelDeleteButton = document.getElementById('cancelDeleteButton');
  if (cancelDeleteButton) {
    cancelDeleteButton.addEventListener('click', () => {
      hideDeleteCampaignModal();
    });
  }

  // Bouton d'annulation dans le formulaire de création
  const cancelCreateButton = document.getElementById('cancelCreateButton');
  if (cancelCreateButton) {
    cancelCreateButton.addEventListener('click', () => {
      hideCreateCampaignModal();
    });
  }

  // Formulaire de création de campagne
  const createForm = document.getElementById('createForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      createCampaign(event);
    });
  }

  // Formulaire de modification de campagne
  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', editCampaign);
  }

  // Bouton de confirmation de suppression
  const confirmDeleteButton = document.getElementById('confirmDeleteButton');
  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener('click', () => {
      // Ajoutez ici la logique de suppression
      console.log('Suppression confirmée');
    });
  }
});
