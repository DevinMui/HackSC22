import { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: process.env.REACT_APP_HOST,
      },
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};

const Sponsor = () => {
  const { id } = useParams();
  const query = useQuery();
  const clientSecret = query.get('clientSecret');

  // passed from the server
  const opt = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={opt}>
      <CheckoutForm />
    </Elements>
  );
};

export default Sponsor;
