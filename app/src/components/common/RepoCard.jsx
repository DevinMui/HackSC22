import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StarOutlined, ForkOutlined } from '@ant-design/icons';
import colors from './language_colors.json';
import { H3, P } from './Text';

const Container = styled.div`
  border: 1px solid #5bc676;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 5px;
  margin-right: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 24px;
  width: 300px;
  height: 100%;
  * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Details = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const LLink = styled(Link)`
  :hover {
    text-decoration: none;
  }
`;

const DuoDiv = styled.div`
  display: flex;
  align-items: center;
  span:first-child {
    margin-right: 6px;
  }
`;

const Color = styled.div`
  border-radius: 50%;
  background: ${(props) => getColor(props.language)};
  height: 12px;
  width: 12px;
  margin-right: 8px;
`;

const Description = styled(P)`
  flex-grow: 1;
  width: 100%;
`;

function getColor(lang) {
  try {
    return colors[lang].color;
  } catch (e) {
    return 'rgba(0, 0, 0, 0)';
  }
}

function formatNum(n) {
  n = +n;
  if (n < 1000) return '' + n;
  return `${Math.floor(n / 1000)}.${n % 1000}k`;
}
const RepoCard = ({
  repoOwner,
  repoName,
  stars,
  forks,
  language,
  description,
  to,
}) => (
  <LLink to={to}>
    <Container>
      <H3>
        {repoOwner}/{repoName}
      </H3>
      <Description>{description}</Description>
      <Details>
        <DuoDiv>
          <Color language={language} />
          <P>{language}</P>
        </DuoDiv>
        <DuoDiv>
          <StarOutlined />
          <P>{formatNum(stars)}</P>
        </DuoDiv>
        <DuoDiv>
          <ForkOutlined />
          <P>{formatNum(forks)}</P>
        </DuoDiv>
      </Details>
    </Container>
  </LLink>
);

export default RepoCard;
