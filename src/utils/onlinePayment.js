import Stripe from "stripe";

export default async function onlinePayment({
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY),
  payment_method_types = ["card"],
  mode = "payment",
  customer_email,
  metadata = {},
  success_url = "http://localhost:3000",
  cancel_url = "http://localhost:3000",
  line_items = [],
  discounts = [],
} = {}) {
  const session = stripe.checkout.sessions.create({
    payment_method_types,
    mode,
    customer_email,
    metadata,
    success_url,
    cancel_url,
    line_items,
    discounts,
  });
  return session;
}

/*
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: "T-shirt",
            images: [image.secure_url],
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
*/
