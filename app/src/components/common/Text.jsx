import styled from 'styled-components';

const H1 = styled.h1`
  font-family: Helvetica Neue;
  font-style: normal;
  margin: 0;
  margin-top: 16px;
  margin-bottom: 16px;
  font-weight: bold;
  line-height: 29px;
`;

const H2 = styled.h2`
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: bold;
  margin: 0;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 21px;
`;

const H3 = styled.h3`
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: bold;
  margin: 0;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 17px;
`;

const H4 = styled.h4`
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: normal;
  margin: 0;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 17px;
`;

const P = styled.p`
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: normal;
`;

const Subtext = styled(P)`
  color: #c5c4dc;
`;

const ErrorText = styled(P)`
  color: hsla(332, 83%, 56%, 1);
`;

export { H1, H2, H3, H4, P, Subtext, ErrorText };
