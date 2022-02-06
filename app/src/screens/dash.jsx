import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '../components/common/NavBar';
import { H1, Subtext } from '../components/common/Text';
import RepoCard from '../components/common/RepoCard';
import RepoList from '../components/dash/RepoList';
import Sidebar from '../components/dash/Sidebar';
import { useAuth } from '../context/auth';

const Content = styled.div`
  display: flex;
`;

const Repos = styled.div`
  padding-left: 24px;
  overflow: auto;
`;

function getRepos(names) {
  return Promise.all(
    names.map((name) =>
      fetch(`https://api.github.com/repos/${name}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }).then((r) => r.json())
    )
  );
}

const Dash = () => {
  const { getName } = useAuth();
  const [name, setName] = React.useState('');
  const [highlights, setHighlights] = React.useState([]);
  const [explore, setExplore] = React.useState([]);
  const [funded, setFunded] = React.useState([]);

  React.useEffect(() => {
    getName().then(setName);
  }, []);

  React.useEffect(() => {
    if (!name) return;
    fetch(`/campaigns?userId=${name}&type=MINE`)
      .then((r) => r.json())
      .then((j) => j.map((i) => decodeURIComponent(i.repoId)))
      .then((x) => getRepos(x))
      .then((z) => setHighlights(z));
    fetch(`/campaigns?userId=${name}&type=EXPLORE`)
      .then((r) => r.json())
      .then((j) => j.map((i) => decodeURIComponent(i.repoId)))
      .then((x) => getRepos(x))
      .then((z) => setExplore(z));
    fetch(`/campaigns?userId=${name}&type=SUBSCRIBED`)
      .then((r) => r.json())
      .then((j) => j.map((i) => decodeURIComponent(i.repoId)))
      .then((x) => getRepos(x))
      .then((z) => setFunded(z));
  }, [name]);

  return (
    <>
      <NavBar />
      <Content>
        <Sidebar />
        <Repos>
          <H1>Your Highlights</H1>
          <RepoList>
            {!highlights.length && <Subtext>Nothing here...yet!</Subtext>}
            {highlights.map((repo) => (
              <RepoCard
                key={repo.id}
                to={`/campaigns/${repo.full_name}`}
                repoName={repo.name}
                repoOwner={repo.owner.login}
                description={repo.description}
                stars={repo.stargazers_count}
                language={repo.language}
                forks={repo.forks_count}
              />
            ))}
          </RepoList>
          <H1>Explore New Projects</H1>
          <RepoList>
            {!explore.length && <Subtext>Nothing here...yet!</Subtext>}
            {explore.map((repo) => (
              <RepoCard
                key={repo.id}
                to={`/campaigns/${repo.full_name}`}
                repoName={repo.name}
                repoOwner={repo.owner.login}
                description={repo.description}
                stars={repo.stargazers_count}
                language={repo.language}
                forks={repo.forks_count}
              />
            ))}
          </RepoList>
          <H1>Projects You Funded</H1>
          <RepoList>
            {!funded.length && <Subtext>Nothing here...yet!</Subtext>}
            {funded.map((repo) => (
              <RepoCard
                key={repo.id}
                to={`/campaigns/${repo.full_name}`}
                repoName={repo.name}
                repoOwner={repo.owner.login}
                description={repo.description}
                stars={repo.stargazers_count}
                language={repo.language}
                forks={repo.forks_count}
              />
            ))}
          </RepoList>
        </Repos>
      </Content>
    </>
  );
};
export default Dash;
