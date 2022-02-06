import React from 'react';
import styled from 'styled-components';
import { H3, P } from '../common/Text';

const Container = styled.div`
  background: hsla(217, 100%, 11%, 1);
  padding: 24px;
  margin: 16px;
  width: 280px;
  display: inline-block;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dels = styled.span`
  color: hsla(332, 83%, 56%, 1);
`;
const Adds = styled.span`
  color: hsla(135, 48%, 57%, 1);
  margin-right: 8px;
`;

const Title = styled.div`
  display: flex;
`;

const Pfp = styled.img`
  border-radius: 50%;
  margin-right: 8px;
  height: 24px;
  width: 24px;
`;

const ContributorCard = ({ item }) => {
  const [adds, setAdds] = React.useState(0);
  const [dels, setDels] = React.useState(0);
  React.useEffect(() => {
    let sumA = 0;
    let sumD = 0;
    for (const week of item.weeks) {
      sumA += week.a;
      sumD += week.d;
    }
    setAdds(sumA);
    setDels(sumD);
  }, []);
  return (
    <Container>
      <a href={`https://www.github.com/${item.author.login}`}>
        <Title>
          <Pfp src={item.author.avatar} />
          <H3>{item.author.login}</H3>
        </Title>
      </a>
      <Details>
        <P>{item.total} commits</P>
        <P>
          <Adds> {adds}++</Adds>
          <Dels>{dels}--</Dels>
        </P>
      </Details>
    </Container>
  );
};

export default ContributorCard;
