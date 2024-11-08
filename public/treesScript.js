function displayEditTreeModal(
  id,
  name,
  price_ht,
  quantity,
  age,
  species_name,
  description,
  co2_absorption,
  average_lifespan,
) {
  document.getElementById('editTreeId').value = id;
  document.getElementById('editTreeName').value = name;
  document.getElementById('editTreePriceHt').value = price_ht;
  document.getElementById('editTreeQuantity').value = quantity;
  document.getElementById('editTreeAge').value = age;
  document.getElementById('editTreeSpecies').value = species_name;
  document.getElementById('editTreeDescription').value = description;
  document.getElementById('editTreeCo2Absorption').value = co2_absorption;
  document.getElementById('editTreeAverageLifespan').value = average_lifespan;

  document.getElementById('editTreeModal').classList.remove('hidden');
}
