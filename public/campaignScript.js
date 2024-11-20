// Afficher la modal d'édition pour une campagne donnée
function displayEditCampaignModal(campaignId) {
  const editModal = document.getElementById(`editCampaignModal-${campaignId}`);
  if (editModal) {
    editModal.classList.remove('hidden');
  } else {
    console.error(`Modal pour la campagne ${campaignId} introuvable.`);
  }
}

// Masquer la modal d'édition pour une campagne donnée
function hideEditCampaignModal(campaignId) {
  const editModal = document.getElementById(`editCampaignModal-${campaignId}`);
  if (editModal) {
    editModal.classList.add('hidden');
  }
}

// Mettre à jour une campagne
async function editCampaign(event, campaignId) {
  event.preventDefault();

  // Récupérer les champs du formulaire
  const name = document.querySelector(
    `#editCampaignModal-${campaignId} input[name="name"]`,
  ).value;

  const description = document.querySelector(
    `#editCampaignModal-${campaignId} input[name="description"]`,
  ).value;

  const start_campaign = document.querySelector(
    `#editCampaignModal-${campaignId} input[name="start_campaign"]`,
  ).value;

  let end_campaign = document.querySelector(
    `#editCampaignModal-${campaignId} input[name="end_campaign"]`,
  ).value;

  // Ne pas inclure le champ si la date est vide
  end_campaign = end_campaign ? new Date(end_campaign).toISOString() : null;

  const location = {
    name_location: document.querySelector(
      `#editCampaignModal-${campaignId} input[name="location[name_location]"]`,
    ).value,
    country: {
      name: document.querySelector(
        `#editCampaignModal-${campaignId} input[name="location[country][name]"]`,
      ).value,
    },
  };

  // Récupérer les arbres associés
  const treesCampaign = [];
  const allRadioButtons = document.querySelectorAll(
    `#editCampaignModal-${campaignId} input[type="radio"]`,
  );

  // biome-ignore lint/complexity/noForEach: <explanation>
  allRadioButtons.forEach((radio) => {
    if (radio.value === 'include' && radio.checked) {
      treesCampaign.push({ id: Number.parseInt(radio.dataset.treeId, 10) });
    }
  });

  // Construire le corps de la requête
  const body = JSON.stringify({
    name,
    description,
    start_campaign,
    end_campaign,
    location,
    treesCampaign,
  });

  console.log('Données envoyées pour la mise à jour :', body);

  try {
    // Envoyer la requête PATCH pour mettre à jour la campagne
    const response = await fetch(`/admin/campaigns/${campaignId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (response.ok) {
      console.log('Campagne mise à jour avec succès');
      window.location.reload();
    } else {
      const error = await response.json();
      console.error('Erreur lors de la mise à jour de la campagne', error);
    }
  } catch (error) {
    console.error('Erreur réseau lors de la mise à jour de la campagne', error);
  }
}

// Afficher la modal de suppression pour une campagne donnée
function displayDeleteCampaignModal(campaignId) {
  const deleteModal = document.getElementById(
    `deleteCampaignModal-${campaignId}`,
  );
  if (deleteModal) {
    deleteModal.classList.remove('hidden');
  } else {
    console.error(
      `Modal de suppression pour la campagne ${campaignId} introuvable.`,
    );
  }
}

// Masquer la modal de suppression pour une campagne donnée
function hideDeleteCampaignModal(campaignId) {
  const deleteModal = document.getElementById(
    `deleteCampaignModal-${campaignId}`,
  );
  if (deleteModal) {
    deleteModal.classList.add('hidden');
  }
}

// Supprimer une campagne
async function deleteCampaign(campaignId) {
  try {
    const response = await fetch(`/admin/campaigns/${campaignId}`, {
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

// Afficher la modal de création
function displayCreateCampaignModal() {
  document.getElementById('createCampaignModal').classList.remove('hidden');
}

// Masquer la modal de création
function hideCreateCampaignModal() {
  document.getElementById('createCampaignModal').classList.add('hidden');
}

// Créer une campagne
async function createCampaign(event) {
  event.preventDefault();

  const submitButton = event.target.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
  }

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
    `#createCampaignModal input[type="radio"]`,
  );

  // biome-ignore lint/complexity/noForEach: <explanation>
  allRadioButtons.forEach((radio) => {
    if (radio.value === 'include' && radio.checked) {
      treesCampaign.push({ id: Number.parseInt(radio.dataset.treeId, 10) });
    }
  });

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
      console.log('Campagne créée avec succès');
      window.location.reload();
    } else {
      const error = await response.json();
      console.error('Erreur lors de la création de la campagne', error);
    }
  } catch (error) {
    console.error('Erreur réseau lors de la création de la campagne', error);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

// Initialisation des événements DOM
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    const campaignId = event.target.dataset.campaignId;

    if (!action) return; // Ignorer les clics sans data-action

    switch (action) {
      case 'displayCreateCampaignModal':
        displayCreateCampaignModal();
        break;
      case 'hideCreateCampaignModal':
        hideCreateCampaignModal();
        break;
      case 'displayEditCampaignModal':
        displayEditCampaignModal(campaignId);
        break;
      case 'hideEditCampaignModal':
        hideEditCampaignModal(campaignId);
        break;
      case 'displayDeleteCampaignModal':
        displayDeleteCampaignModal(campaignId);
        break;
      case 'hideDeleteCampaignModal':
        hideDeleteCampaignModal(campaignId);
        break;
      case 'createCampaign':
        createCampaign(event);
        break;
      case 'editCampaign':
        editCampaign(event, campaignId);
        break;
      case 'deleteCampaign':
        deleteCampaign(campaignId);
        break;
      default:
        console.warn(`Action non gérée : ${action}`);
    }
  });

  // Pour gérer la recherche dans la barre de recherche
  document
    .querySelector('.searchInput')
    ?.addEventListener('keyup', filterSearchBar);
});
