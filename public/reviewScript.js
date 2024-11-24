function displayEditReviewModal(reviewId) {
  const reviewModal = document.getElementById(`editReviewModal-${reviewId}`);
  if (reviewModal) {
    reviewModal.classList.remove('hidden');
  } else {
    console.error(`Modal d'édition pour la review ${reviewId} introuvable.`);
  }
}

function hideEditReviewModal(reviewId) {
  const editModal = document.getElementById(`editReviewModal-${reviewId}`);
  if (editModal) {
    editModal.classList.add('hidden');
  }
}

async function editReview(event, reviewId) {
  event.preventDefault();

  const form = document.querySelector(`#editReviewForm-${reviewId}`);

  // Vérifie si le formulaire est valide avant de continuer
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Récupérer les champs du formulaire
  const id = document.querySelector(`#editReviewId-${reviewId}`).value;
  const content = document.querySelector(
    `#editReviewContent-${reviewId}`,
  ).value;
  const rating = document.querySelector(`#editReviewRating-${reviewId}`).value;
  const id_user = document.querySelector(`#editReviewUserId-${reviewId}`).value;

  const body = JSON.stringify({
    content,
    rating: Number.parseInt(rating),
    id_user: Number.parseInt(id_user),
  });

  try {
    const response = await fetch(`${baseUrl}/admin/reviews/${id}`, {
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

function displayDeleteReviewModal(reviewId) {
  document
    .getElementById(`deleteReviewModal-${reviewId}`)
    .classList.remove('hidden');
  document.getElementById(`confirmDeleteButton-${reviewId}`).onclick = () =>
    deleteReview(reviewId);
}

function hideDeleteReviewModal(reviewId) {
  document
    .getElementById(`deleteReviewModal-${reviewId}`)
    .classList.add('hidden');
}

async function deleteReview(reviewId) {
  try {
    const response = await fetch(`${baseUrl}/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Review supprimée avec succès');
      window.location.reload();
    } else {
      console.error('Erreur lors de la suppression de la review');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la suppression de la review', error);
  }
}

// Initialisation des événements DOM
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    const reviewId = event.target.dataset.reviewId;

    const validActions = [
      'displayEditReviewModal',
      'hideEditReviewModal',
      'editReview',
      'displayDeleteReviewModal',
      'hideDeleteReviewModal',
      'deleteReview',
    ];

    if (!action || !validActions.includes(action)) return; // Ignorer les clics sans action valide

    switch (action) {
      case 'displayEditReviewModal':
        displayEditReviewModal(reviewId);
        break;
      case 'hideEditReviewModal':
        hideEditReviewModal(reviewId);
        break;
      case 'displayDeleteReviewModal':
        displayDeleteReviewModal(reviewId);
        break;
      case 'hideDeleteReviewModal':
        hideDeleteReviewModal(reviewId);
        break;
      case 'editReview':
        editReview(event, reviewId);
        break;
      case 'deleteReview':
        deleteReview(reviewId);
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
