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
  const parsedTreeCampaign = JSON.parse(treeCampaign);

  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editDescription').value = description;

  // Convertir la date au format YYYY-MM-DD pour les champs de type date
  const startDate = new Date(start_campaign).toISOString().split('T')[0];
  const endDate = new Date(end_campaign).toISOString().split('T')[0];

  // Affecter les valeurs de date formatées
  document.getElementById('editStartCampain').value = startDate;
  document.getElementById('editEndCampain').value = endDate;
  document.getElementById('editLocation').value = location;
  document.getElementById('editCountry').value = country;

  // Sélectionner tous les boutons radio

  const allRadioButtons = document.querySelectorAll('input[type="radio"]');

  // Mapper les IDs des arbres dans la campagne pour une vérification plus rapide
  const treeIdsInCampaign = parsedTreeCampaign.map((tree) => tree.id);

  // Réinitialiser tous les boutons radio à "exclude" par défaut
  for (const radio of allRadioButtons) {
    radio.checked = radio.value === 'exclude';
  }

  // Cocher les boutons radio "include" pour les arbres dans `treeIdsInCampaign`
  for (const treeId of treeIdsInCampaign) {
    const includeRadio = document.querySelector(
      `input[type="radio"][name="tree_${treeId}"][value="include"]`,
    );
    if (includeRadio) {
      includeRadio.checked = true;
    }
  }

  // Afficher la modal
  document.getElementById('editModal').classList.remove('hidden');
}

function hideEditCampaignModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function editCampaign(event) {
  event.preventDefault();

  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value;
  const description = document.getElementById('editDescription').value;
  const start_campaign = document.getElementById('editStartCampain').value;
  const end_campaign = document.getElementById('editEndCampain').value;
  const location = {
    name_location: document.getElementById('editLocation').value,
    country: {
      name: document.getElementById('editCountry').value,
    },
  };

  const treesCampaign = [];

  const allRadioButtons = document.querySelectorAll('input[type="radio"]');

  for (const radio of allRadioButtons) {
    const treeId = radio.name.split('_')[1];
    if (radio.value === 'include' && radio.checked) {
      // Ajoute chaque arbre sous forme d'objet { id: <treeId> }
      treesCampaign.push({ id: Number.parseInt(treeId) });
    }
  }
  console.log(JSON.stringify(treesCampaign, null, 2));
  try {
    const response = await fetch(`/admin/campaigns/${id}`, {
      method: 'PATCH',
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
    console.log(treesCampaign);
    console.log(JSON.stringify(treesCampaign, null, 2));

    if (response.ok) {
      console.log('Campagne mise à jour avec succès');
      window.location.reload();
    } else {
      console.error('Erreur lors de la mise à jour de la campagne');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la mise à jour de la campagne', error);
  }
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
