import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Sidebar from '../components/sponsor/Sidebar';
import { useAuth } from '../context/auth';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons';
import NavBar from '../components/common/NavBar';
import { H1, H3, Subtext } from '../components/common/Text';
import ContributorCard from '../components/sponsor/ContributorCard';

Chart.register(ArcElement, Tooltip, ArcElement);

const Container = styled.div`
  display: flex;
`;
const Readme = styled(ReactMarkdown)``;
const DoughnutContainer = styled.div`
  width: 50%;
  cursor: pointer;
`;

const MainContent = styled.div`
  flex-grow: 1;
  max-width: 800px;
  margin: 0 auto;
  margin-right: 0;
  margin-left: 48px;
`;

const SpecialFolderIcon = styled(FolderOpenOutlined)`
  margin-left: 8px;
`;

const ContribCount = styled.span`
  background: hsla(18, 79%, 45%, 1);
  padding: 4px;
  border-radius: 5px;
  margin-left: 8px;
`;

const SectionTitle = styled(H3)`
  margin-top: 32px;
`;

const DisplayAllButt = styled.div`
  border-radius: 50%;
  cursor: pointer;
  background: hsla(135, 48%, 57%, 1);
  display: inline;
  height: 36px;
  width: 36px;
  padding: 8px;
  margin-top: -16px;
`;

const SponsorImageContainer = styled.div``;

const SponsorImage = styled.img`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  margin: 8px;
`;

const Campaign = () => {
  const { owner, repo } = useParams();
  const { getFile, getContributions } = useAuth();
  const [readme, setReadme] = useState('');
  const [contributors, setContributors] = useState([]);
  const [shownContributors, setShownContributors] = useState(2);
  const [sponsors, setSponsors] = useState([]);
  const [data, setData] = useState({
    datasets: [{ data: [100], hoverOffset: 4 }],
    labels: ['hello world'],
  });

  useEffect(() => {
    getContributions(owner, repo).then((c) => {
      c = c.sort((a, b) => b.total - a.total);
      setContributors(c);
      const nums = c.map((x) => x.total).slice(0, 6);
      const labels = c.map((x) => x.author.login).slice(0, 6);
      setData({ datasets: [{ data: nums }], labels });
    });
    getFile(owner, repo, 'README')
      .then((res) => {
        setReadme(atob(res.data.content));
      })
      .catch(() => {});
    getFile(owner, repo, 'README.md')
      .then((res) => {
        setReadme(atob(res.data.content));
      })
      .catch(() => {});
    const u = encodeURIComponent(owner + '/' + repo);
    fetch('/campaigns/' + u + '/sponsors')
      .then((r) => r.json())
      .then(setSponsors);
  }, []);

  return (
    <>
      <NavBar />
      <Container>
        <MainContent>
          <H1>
            Sponsor <SpecialFolderIcon /> {owner}/{repo}
          </H1>
          <Subtext>
            Your sponsorship will support the team behind <b>{repo}</b>.
          </Subtext>
          <Readme>{readme}</Readme>
          <SectionTitle>
            {sponsors.length} sponsor{sponsors.length > 1? 's are':' is'} funding{' '}
            {repo}.
          </SectionTitle>
          <SponsorImageContainer>
            {sponsors.map((s) => (
              <a href={`https://www.github.com/` + s.userId} alt={s.userId}>
                <SponsorImage src={s.avatarUrl} />
              </a>
            ))}
          </SponsorImageContainer>
          <SectionTitle>Contribution Chart</SectionTitle>
          <DoughnutContainer>
            <Doughnut data={data} />
          </DoughnutContainer>
          <SectionTitle>
            Contributors
            <ContribCount>
              {contributors.length > 99 ? '99+' : contributors.length}
            </ContribCount>
          </SectionTitle>
          {contributors.slice(0, shownContributors).map((contributor) => (
            <ContributorCard key={contributor.author.id} item={contributor} />
          ))}
          {contributors.length > shownContributors && (
            <DisplayAllButt onClick={() => setShownContributors(200)}>
              <EllipsisOutlined />
            </DisplayAllButt>
          )}
        </MainContent>
        <Sidebar />
      </Container>
    </>
  );
};
export default Campaign;
