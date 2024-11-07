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
  console.log('treeCampaign:', treeCampaign);
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editDescription').value = description;
  document.getElementById('editStartCampain').value = new Date(
    start_campaign,
  ).toLocaleDateString('fr-FR');
  document.getElementById('editEndCampain').value = new Date(
    end_campaign,
  ).toLocaleDateString('fr-FR');
  document.getElementById('editLocation').value = location;
  document.getElementById('editCountry').value = country;

  // Sélectionner tous les boutons radio

  const allRadioButtons = document.querySelectorAll('input[type="radio"]');

  // Mapper les IDs des arbres dans la campagne pour une vérification plus rapide
  const treeIdsInCampaign = treeCampaign.map((tree) => tree.id);
  console.log('treeIdsInCampaign:', treeIdsInCampaign);

  // Réinitialiser tous les boutons radio à "exclude" par défaut
  allRadioButtons.forEach((radio) => {
    radio.checked = radio.value === 'exclude';
  });

  // Parcourir les arbres inclus dans la campagne et cocher les boutons "include"
  treeIdsInCampaign.forEach((tree) => {
    const includeRadio = document.querySelector(
      `input[type="radio"][name="tree_${tree.id}"][value="include"]`,
    );
    if (includeRadio) {
      includeRadio.checked = true;
    }
  });

  // récupérer les arbres de  campaginTrees

  // Récupérer les treesCampaign

  //Voir si trees de campaigntress sont présent

  //Si oui, cocher input radio en checked
}
