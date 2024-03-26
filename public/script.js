const button = document.querySelector('button');
button.addEventListener('click', async () => {
  try {
    const res = await fetch('/create-checkout-session', {
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
    });

    if (!res) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const { url } = await res.json();
    window.location = url;
  } catch (err) {
    console.error(err);
  }
});
