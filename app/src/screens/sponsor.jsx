import { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { H2 } from '../components/common/Text';
import NavBar from '../components/common/NavBar';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

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
  const { owner, repo } = useParams();
  const query = useQuery();
  const clientSecret = query.get('clientSecret');
  const amt = query.get('amt');
  // passed from the server
  const opt = {
    clientSecret,
  };

  return (
    <>
      <NavBar />
      <Container>
        <H2>
          Support {owner}/{repo} for{' '}
          {(amt / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}{' '}
          a month.
        </H2>
        <Elements stripe={stripePromise} options={opt}>
          <CheckoutForm />
        </Elements>
      </Container>
    </>
  );
};

export default Sponsor;
