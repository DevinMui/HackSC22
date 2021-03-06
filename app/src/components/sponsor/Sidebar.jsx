import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { sponsor } from '../../api/sponsors';
import { useAuth } from '../../context/auth';
import { H3, Subtext } from '../common/Text';
import SponsorCard from './SponsorCard';

const epsilon = 0.000000001;

const Container = styled.div`
  margin-right: 24px;
  > * {
    margin-bottom: 24px;
  }
`;

const Inner = styled(Container)`
  background: #001638;
  padding: 24px;
  height: auto;
  display: flex;
  flex-direction: column;
`;

const TierList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: right;
`;

const Input = styled.input`
  background: #ffffff;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 8px;
  padding-left: 16px;
  padding-right: 16px;
  ::placeholder {
    opacity: 0.8;
  }
`;

const Button = styled.div`
  cursor: pointer;
  background: hsla(135, 48%, 57%, 1);
  padding: 5px 20px 5px 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  text-align: center;
`;

const tiers = [
  { amount: 1, description: 'Every little bit counts.' },
  { amount: 5, description: 'Buy us a coffee...' },
  { amount: 10, description: '...and a sandwich...' },
  { amount: 25, description: '...make that two?' },
  { amount: 50, description: '...for our whole team!' },
];

const Sidebar = () => {
  const { owner, repo } = useParams();
  const auth = useAuth();
  const [name, setName] = React.useState('');
  const [contribAmt, setContribAmt] = React.useState(0);
  const navigate = useNavigate();
  const [campaign, setCampaign] = React.useState(null);
  const [hasClick, setHasClick] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState('');

  const onClick = (amt) => {
    if (hasClick) return;
    setHasClick(true);
    sponsor(owner, repo, name, amt, avatarUrl)
      .then((clientSecret) => {
        console.log(clientSecret);
        navigate(
          `/campaign/${owner}/${repo}/sponsor?clientSecret=${clientSecret}&amnt=${amt}`
        );
        setHasClick(false);
      })
      .catch((e) => {
        console.log(e);
        setHasClick(false);
      });
  };
  React.useEffect(() => {
    auth.getName().then(setName);
    auth.getImage().then(setAvatarUrl);
    fetch('/api/campaigns/' + encodeURIComponent(owner + '/' + repo))
      .then((r) => r.json())
      .then((j) => {
        console.log({ j });
        j.error ? setCampaign(null) : setCampaign(j);
      });
  }, [owner, repo]);
  if (campaign)
    return (
      <Container>
        <H3>
          {Math.round(100 * (campaign.sum / (campaign._doc.goal + epsilon)))}%
          towards ${Math.round(campaign._doc.goal / 100)} per month goal
        </H3>
        <H3>{name === owner ? 'Sponsor Tiers' : 'Select a tier'}</H3>
        <TierList>
          {tiers.map((tier) => (
            <SponsorCard
              amount={tier.amount}
              description={tier.description}
              key={tier.amount}
              disabled={name === owner}
              onClick={() => onClick(tier.amount * 100)}
            />
          ))}
        </TierList>
      </Container>
    );
  //if (name == owner)
  else
    return (
      <Container>
        <Inner>
          <H3>Start raising money for {repo}</H3>
          <Subtext>Set your monthly contribution goal (USD)</Subtext>
          <Input
            placeholder="$0.00"
            type="number"
            onChange={(e) => setContribAmt(e.target.value)}
          ></Input>
          <Button
            onClick={() => {
              if (!contribAmt || contribAmt <= 0)
                return alert('Please start your campaign with a monthly goal!');
              if (hasClick) return;
              setHasClick(true);
              fetch('/api/campaigns', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                body: JSON.stringify({
                  repoId: encodeURIComponent(owner + '/' + repo),
                  goal: 100 * Math.floor(contribAmt),
                  url: `git@github.com:${owner}/${repo}.git`,
                  name: repo,
                }),
              })
                .then(() => {
                  window.location.reload();
                  setHasClick(false);
                })
                .catch(() => {
                  alert('Error starting your campaign.');
                  setHasClick(false);
                });
            }}
          >
            Start
          </Button>
        </Inner>
      </Container>
    );
};

export default Sidebar;
