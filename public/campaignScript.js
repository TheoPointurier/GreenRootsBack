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
async function editCampaign(event) {
  event.preventDefault();

  const form = event.target;
  const campaignId = form.querySelector('input[name="id"]').value;

  const name = form.querySelector(`#editName-${campaignId}`).value;
  const description = form.querySelector(
    `#editDescription-${campaignId}`,
  ).value;
  const start_campaign =
    form.querySelector(`#editStartCampain-${campaignId}`).value || null;
  const end_campaign =
    form.querySelector(`#editEndCampain-${campaignId}`).value || null;
  const location = {
    name_location: form.querySelector(`#editLocation-${campaignId}`).value,
    country: {
      name: form.querySelector(`#editCountry-${campaignId}`).value,
    },
  };

  const treesCampaign = [];
  const allRadioButtons = form.querySelectorAll(
    `#editTreesContainer-${campaignId} input[type="radio"]`,
  );

  for (const radio of allRadioButtons) {
    if (radio.value === 'include' && radio.checked) {
      treesCampaign.push({ id: Number.parseInt(radio.dataset.treeId, 10) });
    }
  }

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
function displayDeleteCampaignModal(campaignId, campaignName) {
  const deleteModal = document.getElementById(
    `deleteCampaignModal-${campaignId}`,
  );
  if (deleteModal) {
    deleteModal.classList.remove('hidden');
    const campaignNameSpan = document.getElementById(
      `deleteCampaignName-${campaignId}`,
    );
    if (campaignNameSpan) {
      campaignNameSpan.textContent = campaignName;
    }
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
    '#createModal input[type="radio"]',
  );

  for (const radio of allRadioButtons) {
    if (radio.value === 'include' && radio.checked) {
      treesCampaign.push({ id: Number.parseInt(radio.dataset.treeId) });
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
    const campaignId = event.target.dataset.userId;

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
