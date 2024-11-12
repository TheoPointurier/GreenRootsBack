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

  console.log(
    id,
    name,
    price_ht,
    quantity,
    age,
    species_name,
    description,
    co2_absorption,
    average_lifespan,
  );
  document.getElementById('editTreeModal').classList.remove('hidden');
}

function hideEditTreeModal() {
  document.getElementById('editTreeModal').classList.add('hidden');
}

async function editTree(event) {
  event.preventDefault();

  const id = document.getElementById('editTreeId').value;
  const name = document.getElementById('editTreeName').value;
  const price_ht = document.getElementById('editTreePriceHt').value;
  const quantity = document.getElementById('editTreeQuantity').value;
  const age = document.getElementById('editTreeAge').value;
  const species_name = document.getElementById('editTreeSpecies').value;
  const description = document.getElementById('editTreeDescription').value;
  const co2_absorption = document.getElementById('editTreeCo2Absorption').value;
  const average_lifespan = document.getElementById(
    'editTreeAverageLifespan',
  ).value;

  const body = JSON.stringify({
    name,
    price_ht,
    quantity,
    age,
    species: {
      species_name,
      description,
      co2_absorption,
      average_lifespan,
    },
  });

  console.log(body);

  try {
    const response = await fetch(`/admin/trees/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        price_ht,
        quantity,
        age,
        species: {
          species_name,
          description,
          co2_absorption,
          average_lifespan,
        },
      }),
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

async function deleteTree(id) {
  try {
    const response = await fetch(`/admin/trees/${id}`, {
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
