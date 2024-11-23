async function connect(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    console.log('Base URL utilisée pour la requête :', baseUrl); // Vérification
    const response = await fetch(`${baseUrl}/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // Redirigez vers la page reçue dans la réponse
      window.location.href = data.redirect;
    } else {
      const error = await response.json();
      console.error('Erreur lors de la connexion :', error);
      alert(error);
    }
  } catch (error) {
    console.error('Erreur réseau lors de la connexion', error);
    alert('Impossible de se connecter. Vérifiez votre connexion réseau.');
  }
}

// Initialisation des événements DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('Base URL au chargement :', baseUrl); // Vérification
  document.body.addEventListener('click', (event) => {
    const action = event.target.dataset.action;

    if (!action) return; // Ignorer les clics sans data-action

    switch (action) {
      case 'login':
        connect(event);
        break;
      default:
        console.warn(`Action non gérée : ${action}`);
    }
  });
});
