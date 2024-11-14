function displayEditReviewModal(
  id,
  content,
  rating,
  id_user,
  firstname,
  lastname,
  email,
) {
  console.log(id, content, rating, id_user, firstname, lastname, email);
  console.log('identificant avis', id);
  console.log('contenu avis', content);
  console.log('note avis', rating);
  console.log('identifiant utilisateur', id_user);
  console.log('prénom utilisateur', firstname);
  console.log('nom utilisateur', lastname);
  console.log('email utilisateur', email);

  document.getElementById('editReviewId').value = id;
  document.getElementById('editReviewContent').value = content;
  document.getElementById('editReviewRating').value = rating;
  document.getElementById('editReviewUserId').value = id_user;
  document.getElementById('editReviewFirstname').value = firstname;
  document.getElementById('editReviewLastname').value = lastname;
  document.getElementById('editReviewEmail').value = email;

  document.getElementById('editReviewModal').classList.remove('hidden');
}

function hideEditReviewModal() {
  document.getElementById('editReviewModal').classList.add('hidden');
}

async function editReview(event) {
  event.preventDefault();

  const id = document.getElementById('editReviewId').value;
  const content = document.getElementById('editReviewContent').value;
  const rating = document.getElementById('editReviewRating').value;
  const id_user = document.getElementById('editReviewUserId').value;

  const body = JSON.stringify({
    content,
    rating: Number.parseInt(rating),
    id_user: Number.parseInt(id_user),
  });

  console.log(body);

  try {
    const response = await fetch(`/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    if (response.ok) {
      console.log('Review mise à jour avec succès');
      window.location.reload();
    } else {
      const error = await response.json();
      console.error('Erreur lors de la mise à jour de la review', error);
      console.log('Review non mise à jour');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la mise à jour de la review', error);
  }
}
