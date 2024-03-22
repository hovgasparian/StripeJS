require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const endpointSecret =
  'whsec_54b2d977be728a37c169fdb2c069d98ee4a35bfe3595e9e3dfb4a03ef033888b';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

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

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  let event = req.body;

  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
  res.send();
});

const PORT = process.env.SECRET_PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
