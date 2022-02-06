import { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Elements,
  ElementsConsumer,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const CheckoutForm = ({ stripe, elements }) => {
  return (
    <form>
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
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CheckoutForm stripe={stripe} elements={elements} />
        )}
      </ElementsConsumer>
    </Elements>
  );
};

export default Sponsor;
