import React, { useEffect } from 'react';
import NavBar from '../components/common/NavBar';
import { useAuth } from '../context/auth';

const Dash = () => {
  const { getName, getRepos, getContributions } = useAuth();
  const [name, setName] = React.useState('');
  const [repos, setRepos] = React.useState([]);

  useEffect(() => {
    getName().then(setName);
  }, []);
  useEffect(() => {
    getRepos().then(setRepos);
  }, []);

  useEffect(() => {
    getContributions('aaronkh', 'artemis').then((x) =>
      console.log('contrib', x)
    );
  }, []);

  return (
    <>
      <NavBar />
      <div>hello {name}</div>
      <div>{'-'.repeat(20)}</div>
      {repos.map((repo) => (
        <div key={repo.id}>
          {repo.name} | ✏️{repo.language} | ✂️{repo.forks_count} | ⭐{' '}
          {repo.stargazers_count} |
        </div>
      ))}
    </>
  );
};

export default Dash;
