function displayEditOrderModal(orderId) {
  document
    .getElementById(`editOrderModal-${orderId}`)
    .classList.remove('hidden');
}

function hideEditOrderModal(orderId) {
  document.getElementById(`editOrderModal-${orderId}`).classList.add('hidden');
}

// permet de mettre à jour le contenu de la ligne de commande en front
function updateLineTotal(orderId, lineId, unitPrice) {
  // Cibler le champ de quantité avec `orderLine.id` comme identifiant unique
  const quantityInput = document.querySelector(
    `#editOrderModal-${orderId} input[name="orderLines[${lineId}][quantity]"]`,
  );

  // Vérifie si l'élément est trouvé avant d'accéder à sa valeur
  if (quantityInput) {
    const lineTotalField = document.getElementById(
      `lineTotal-${orderId}-${lineId}`,
    );
    const quantity = Number.parseInt(quantityInput.value) || 0;
    const lineTotal = (quantity * unitPrice).toFixed(2);

    // Mise à jour du champ de total de la ligne
    if (lineTotalField) {
      lineTotalField.value = `${lineTotal} €`;
    }

    // Mise à jour du total général de la commande
    updateOrderTotal(orderId);
  } else {
    console.error(
      `Impossible de trouver le champ de quantité pour la ligne ${lineId} de la commande ${orderId}`,
    );
  }
}
// permet de mettre à jour le total de la commande en front
function updateOrderTotal(orderId) {
  let newTotalAmount = 0;
  const lineTotalFields = document.querySelectorAll(
    `#editOrderModal-${orderId} input[id^="lineTotal-"]`,
  );

  for (const field of lineTotalFields) {
    const lineTotal = Number.parseFloat(field.value.replace(' €', '')) || 0;
    newTotalAmount += lineTotal;
  }

  const orderTotalField = document.getElementById(
    `orderTotalAmount-${orderId}`,
  );
  orderTotalField.value = newTotalAmount.toFixed(2);
}

async function editOrder(event, orderId) {
  event.preventDefault();

  if (!orderId) {
    console.error("Impossible de récupérer l'identifiant de la commande");
    return;
  }

  // Cibler les éléments de la modale pour récupérer les valeurs
  const status =
    document.querySelector(`#editOrderModal-${orderId} input[name="status"]`)
      .value || 'pending';
  const date = document.querySelector(
    `#editOrderModal-${orderId} input[name="date"]`,
  ).value;
  const totalAmountField = document.querySelector(
    `#editOrderModal-${orderId} input[name="total_amount"]`,
  );

  // Préparer les lignes de commande
  const orderLines = [];
  const lineItems = document.querySelectorAll(
    `#editOrderModal-${orderId} .order-line`,
  );

  for (const lineItem of lineItems) {
    const lineId = lineItem
      .querySelector(`input[name^="orderLines["]`)
      .name.match(/\d+/g)[0];

    if (!lineId) {
      console.error(
        "ID de ligne manquant ou invalide pour l'une des lignes de commande",
      );
      continue;
    }

    const quantity =
      Number.parseInt(
        lineItem.querySelector(`input[name="orderLines[${lineId}][quantity]"]`)
          .value,
        10,
      ) || 0;
    const unitPrice =
      Number.parseFloat(
        lineItem
          .querySelector(`input[readonly][value$="€"]`)
          .value.replace(' €', ''),
      ) || 0;

    orderLines.push({
      id: Number.parseInt(lineId),
      quantity: quantity,
      total_amount: (quantity * unitPrice).toFixed(2),
    });
  }

  // Calcul du montant total de la commande
  const orderTotal = orderLines
    .reduce((total, line) => total + Number.parseFloat(line.total_amount), 0)
    .toFixed(2);

  // Mise à jour du champ total dans le front (si besoin)
  if (totalAmountField) {
    totalAmountField.value = `${orderTotal} €`;
  }

  // Envoi de la requête PATCH avec les données mises à jour
  try {
    const response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_number: orderId,
        status,
        date,
        orderTotal,
        orderLines,
      }),
    });

    if (response.ok) {
      console.log('Commande mise à jour avec succès');
      window.location.reload();
    } else {
      console.error('Erreur lors de la mise à jour de la commande');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la mise à jour de la commande', error);
  }
}
