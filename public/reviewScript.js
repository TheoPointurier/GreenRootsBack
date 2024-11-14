function displayEditReviewModal(
  id,
  content,
  rating,
  firstname,
  lastname,
  email,
) {
  document.getElementById('editReviewId').value = id;
  document.getElementById('editReviewContent').value = content;
  document.getElementById('editReviewRating').value = rating;
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
  const firstname = document.getElementById('editReviewFirstname').value;
  const lastname = document.getElementById('editReviewLastname').value;
  const email = document.getElementById('editReviewEmail').value;

  const body = JSON.stringify({
    content,
    rating: Number.parseInt(rating),
    user: {
      firstname,
      lastname,
      email,
    },
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
