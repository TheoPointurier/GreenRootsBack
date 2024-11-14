function displayEditUserModal(userId) {
  document.getElementById(`editUserModal-${userId}`).classList.remove('hidden');
}

function hideEditUserModal(userId) {
  document.getElementById(`editUserModal-${userId}`).classList.add('hidden');
}

async function editUser(event, userId) {
  event.preventDefault();

  const firstname = document.querySelector(
    `#editUserModal-${userId} input[name="firstname"]`,
  ).value;
  const lastname = document.querySelector(
    `#editUserModal-${userId} input[name="lastname"]`,
  ).value;
  const email = document.querySelector(
    `#editUserModal-${userId} input[name="email"]`,
  ).value;
  const phone_number =
    document.querySelector(
      `#editUserModal-${userId} input[name="phone_number"]`,
    ).value || null;
  const street_number = document.querySelector(
    `#editUserModal-${userId} input[name="street_number"]`,
  ).value;
  const street = document.querySelector(
    `#editUserModal-${userId} input[name="street"]`,
  ).value;
  const city = document.querySelector(
    `#editUserModal-${userId} input[name="city"]`,
  ).value;
  const postal_code = document.querySelector(
    `#editUserModal-${userId} input[name="postal_code"]`,
  ).value;
  const country = document.querySelector(
    `#editUserModal-${userId} input[name="country"]`,
  ).value;
  const entity_name = document.querySelector(
    `#editUserModal-${userId} input[name="entity_name"]`,
  ).value;
  const entity_siret = document.querySelector(
    `#editUserModal-${userId} input[name="entity_siret"]`,
  ).value;
  const is_admin = document.querySelector(
    `#editUserModal-${userId} input[name="is_admin"]`,
  ).checked;
  const id_role = document.querySelector(
    `#editUserModal-${userId} select[name="id_role"]`,
  ).value;

  try {
    const response = await fetch(`/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        phone_number,
        street_number,
        street,
        city,
        postal_code,
        country,
        entity_name,
        entity_siret,
        is_admin,
        id_role,
      }),
    });

    if (response.ok) {
      console.log('Utilisateur mis à jour avec succès');
      window.location.reload();
    } else {
      const errorMessage = await response.json();
      console.error(
        "Erreur lors de la mise à jour de l'utilisateur",
        errorMessage,
      );
    }
  } catch (error) {
    console.error(
      "Erreur réseau lors de la mise à jour de l'utilisateur",
      error,
    );
  }
}

function displayCreateUserModal() {
  document.getElementById('createUserModal').classList.remove('hidden');
}

function hideCreateUserModal() {
  document.getElementById('createUserModal').classList.add('hidden');
}

async function createUser(event) {
  event.preventDefault();

  const firstname = document.querySelector(
    `#createUserModal input[name="firstname"]`,
  ).value;
  const lastname = document.querySelector(
    `#createUserModal input[name="lastname"]`,
  ).value;
  const email = document.querySelector(
    `#createUserModal input[name="email"]`,
  ).value;
  const password = document.querySelector(
    `#createUserModal input[name="password"]`,
  ).value;
  const phone_number =
    document.querySelector(`#createUserModal input[name="phone_number"]`)
      .value || null;
  const street_number = document.querySelector(
    `#createUserModal input[name="street_number"]`,
  ).value;
  const street = document.querySelector(
    `#createUserModal input[name="street"]`,
  ).value;
  const city = document.querySelector(
    `#createUserModal input[name="city"]`,
  ).value;
  const postal_code = document.querySelector(
    `#createUserModal input[name="postal_code"]`,
  ).value;
  const country = document.querySelector(
    `#createUserModal input[name="country"]`,
  ).value;
  const entity_name = document.querySelector(
    `#createUserModal input[name="entity_name"]`,
  ).value;
  const entity_siret = document.querySelector(
    `#createUserModal input[name="entity_siret"]`,
  ).value;
  const is_admin = document.querySelector(
    `#createUserModal input[name="is_admin"]`,
  ).checked;
  const id_role = document.querySelector(
    `#createUserModal select[name="id_role"]`,
  ).value;

  try {
    const response = await fetch('/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstname,
        lastname,
        phone_number,
        street_number,
        street,
        city,
        postal_code,
        country,
        entity_name,
        entity_siret,
        is_admin,
        id_role,
      }),
    });

    if (response.ok) {
      console.log('Utilisateur créé avec succès');
      window.location.reload();
    } else {
      const errorMessage = await response.json();
      console.error(
        "Erreur lors de la création de l'utilisateur",
        errorMessage,
      );
    }
  } catch (error) {
    console.error("Erreur réseau lors de la création de l'utilisateur", error);
  }
}

function displayDeleteUserModal(userId) {
  document
    .getElementById(`deleteUserModal-${userId}`)
    .classList.remove('hidden');
  document.getElementById(`confirmDeleteButton-${userId}`).onclick = () =>
    deleteUser(userId);
}

function hideDeleteUserModal(userId) {
  document.getElementById(`deleteUserModal-${userId}`).classList.add('hidden');
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/admin/users/${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Utilisateur supprimé avec succès');
      window.location.reload();
    } else {
      const errorMessage = await response.json();
      console.error(
        "Erreur lors de la suppression de l'utilisateur",
        errorMessage,
      );
    }
  } catch (error) {
    console.error(
      "Erreur réseau lors de la suppression de l'utilisateur",
      error,
    );
  }
}
