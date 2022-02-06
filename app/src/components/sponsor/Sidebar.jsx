import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { sponsor } from '../../api/sponsors';
import { H3 } from '../common/Text';
import SponsorCard from './SponsorCard';

const Container = styled.div`
  margin-right: 24px;
  > * {
    margin-bottom: 24px;
  }
`;

const TierList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: right;
`;

const tiers = [
  { amount: 1, description: 'Every little bit counts.' },
  { amount: 5, description: 'Buy us a coffee...' },
  { amount: 10, description: '...and a sandwich...' },
  { amount: 25, description: '...make that two?' },
  { amount: 50, description: '...for our whole team!' },
];

const Sidebar = () => {
  const {owner, repo} = useParams();
  const navigate = useNavigate();
  const [hasClick, setHasClick] = React.useState(false)

  const onClick = amt => {
    if(hasClick) return
    setHasClick(true)
    sponsor(owner, repo, amt).then(clientSecret => {
        console.log(clientSecret)
        navigate(`/campaign/${owner}/${repo}/sponsor?clientSecret=${clientSecret}&amnt=${amt}`)
        setHasClick(false)
    }).catch((e) => {
        console.log(e)
        setHasClick(false)
    })
    
  }

  return (
    <Container>
      <H3>XX% towards $XXX per month goal</H3>
      <H3>Select a tier</H3>
      <TierList>
        {tiers.map((tier) => (
          <SponsorCard
            amount={tier.amount}
            description={tier.description}
            key={tier.amount}
            onClick={() => onClick(tier.amount*100)}
          />
        ))}
      </TierList>
    </Container>
  );
};

export default Sidebar;
