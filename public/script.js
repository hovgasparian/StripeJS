const button = document.querySelector('button');
button.addEventListener('click', () => {
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 239 },
        { id: 2, quantity: 57 },
        { id: 3, quantity: 26 },
      ],
    }),
  })
    .then((res) => {
      if (res) return res.json();
      return res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((err) => {
      console.error(err.error);
    });
});
