function displayEditOrderModal(orderId) {
  document
    .getElementById(`editOrderModal-${orderId}`)
    .classList.remove('hidden');
}

function hideEditOrderModal(orderId) {
  document.getElementById(`editOrderModal-${orderId}`).classList.add('hidden');
}
