function editCampaignModal(
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
  console.log('treeIdsInCampaign:', treeIdsInCampaign);

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
