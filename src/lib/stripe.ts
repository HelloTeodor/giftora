import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const formatAmountForStripe = (amount: number, currency: string = 'eur'): number => {
  // Stripe uses smallest currency unit (cents)
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number, currency: string = 'eur'): number => {
  return amount / 100;
};
