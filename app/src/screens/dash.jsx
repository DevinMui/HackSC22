import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '../components/common/NavBar';
import { H1 } from '../components/common/Text';
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

const Dash = () => {
  const { getName, getRepos } = useAuth();
  const [name, setName] = React.useState('');
  const [repos, setRepos] = React.useState([]);

  useEffect(() => {
    getName().then(setName);
  }, []);

  useEffect(() => {
    getRepos().then(setRepos);
  }, []);

  return (
    <>
      <NavBar />
      <Content>
        <Sidebar />
        <Repos>
          <H1>Your Highlights</H1>
          <RepoList>
            {repos.map((repo) => (
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
            {repos.map((repo) => (
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
            {repos.map((repo) => (
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
