require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const stripe = require('stripe')(
  `sk_test_51OwKEk02OpqEY43W2Xyq75BgX8g8IwOvkk8ISvNdXjRj9wO0vGAZCjPATcGuPqU0u6abqL9kICjCYvXn6YuPC3BD001uZoaLzR`
);

const storeItems = [
  {
    id: 1,
    priceInCents: 1530,
    name: 'Product_1',
    description: 'Description for product_1',
  },
  {
    id: 2,
    priceInCents: 2410,
    name: 'Product_2',
    description: 'Description for product_2',
  },
  {
    id: 3,
    priceInCents: 1279,
    name: 'Product_3',
    description: 'Description for product_3',
  },
];

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.find((elem) => elem.id === item.id);
        return {
          price_data: {
            currency: 'usd',
            unit_amount: storeItem.priceInCents,
            product_data: {
              name: storeItem.name,
              description: storeItem.description,
            },
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.SECRET_PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
