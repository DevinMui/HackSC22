import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/auth';

const Campaign = () => {
  const { getFile, getContributors } = useAuth();
  const { id } = useParams();
  const [readme, setReadme] = useState('');
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const owner = 'DevinMui';
    const repo = 'HackSC22';
    const path = 'README.md';
    getFile(owner, repo, path).then((res) => {
      const { content } = res.data;
      setReadme(atob(content));
    });
    getContributors(owner, repo).then((res) => {
      setContributors(res.data);
    });
  }, [getFile, getContributors]);

  return (
    <>
      <ReactMarkdown>{readme}</ReactMarkdown>
      <h3>Contributors</h3>
      {contributors.map((contributor) => (
        <>
          <img src={contributor.avatar_url} />
          <p>
            <a target="_blank" href={contributor.html_url}>
              {contributor.login}
            </a>
          </p>
        </>
      ))}
    </>
  );
};
export default Campaign;
