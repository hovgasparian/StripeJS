require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const stripe = require('stripe')(
  'sk_test_51OwKEk02OpqEY43W2Xyq75BgX8g8IwOvkk8ISvNdXjRj9wO0vGAZCjPATcGuPqU0u6abqL9kICjCYvXn6YuPC3BD001uZoaLzR'
);

// const storeItems = new Map([
//   [1, { priceInCents: 1530, name: 'Product_1' }],
//   [2, { priceInCents: 2410, name: 'Product_2' }],
// ]);
const storeItems = [
  { id: 1, priceInCents: 1530, name: 'Product_1' },
  { id: 2, priceInCents: 2410, name: 'Product_2' },
];

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map((item) => {
        //const storeItem = storeItems.get(item.id);
        const storeItem = storeItems.find((elem) => elem.id === item.id);

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `http://localhost:9000/success.html`,
      cancel_url: `http://localhost:9000/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.SECRET_PORT;
app.listen(PORT, () =>
  console.log(`Server running on port: ${process.env.SECRET_PORT}`)
);
