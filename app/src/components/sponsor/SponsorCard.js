import React from 'react';
import styled from 'styled-components';
import { P, H4 } from '../common/Text';

const Container = styled.div`
  background: #001638;
  border-radius: 5px;
  padding: 12px;
  padding-left: 48px;
  padding-right: 48px;
  margin: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.div`
  cursor: pointer;
  background: hsla(135, 48%, 57%, 1);
  padding: 5px 20px 5px 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  margin-left: 32px;
`;

const SponsorCard = ({ amount, description, onClick }) => {
  return (
    <Container>
      <div>
        <H4>${amount} a month</H4>
        <P>{description}</P>
      </div>
      <Button onClick={onClick}>
        <H4>Select</H4>
      </Button>
    </Container>
  );
};

export default SponsorCard;
