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
  const price_ht = document.getElementById('editTreePriceHt').value || null;
  const quantity = document.getElementById('editTreeQuantity').value || null;
  const age = document.getElementById('editTreeAge').value || null;
  const species_name = document.getElementById('editTreeSpecies').value;
  const description =
    document.getElementById('editTreeDescription').value || null;
  const co2_absorption =
    document.getElementById('editTreeCo2Absorption').value || null;
  const average_lifespan =
    document.getElementById('editTreeAverageLifespan').value || null;

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

function displayCreateTreeModal() {
  document.getElementById('createTreeModal').classList.remove('hidden');
}

function hideCreateTreeModal() {
  document.getElementById('createTreeModal').classList.add('hidden');
}

async function createTree(event) {
  event.preventDefault();

  const name = document.getElementById('createTreeName').value;
  const price_ht = document.getElementById('createTreePriceHt').value || null;
  const quantity = document.getElementById('createTreeQuantity').value || null;
  const age = document.getElementById('createTreeAge').value || null;
  const species_name = document.getElementById('createTreeSpecies').value;
  const description =
    document.getElementById('createTreeDescription').value || null;
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
      window.location.reload();
    } else {
      const error = await response.json();
      console.error("Erreur lors de la création de l'arbre", error);
      console.error("Erreur lors de la création de l'arbre");
    }
  } catch (error) {
    console.error("Erreur réseau lors de la création de l'arbre", error);
  }
}
