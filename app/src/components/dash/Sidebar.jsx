import React from 'react';
import styled from 'styled-components';
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/auth';
import { H3, H4 } from '../common/Text';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 32px;
  min-width: 200px;
  margin-right: 32px;
`;

const D = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  width: inherit;
  overflow: hidden;
  * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Pfp = styled.img`
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin-right: 16px;
`;

const AddButton = styled.div`
  border-radius: 50%;
  margin-left: 16px;
  height: 24px;
  width: 24px;
  cursor: pointer;
  background: hsla(332, 83%, 56%, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const RepoLink = styled(Link)`
  span {
    margin-right: 16px;
  }
`;

const Sidebar = () => {
  const auth = useAuth();
  const [name, setName] = React.useState('');
  const [img, setImg] = React.useState('');
  const [repos, setRepos] = React.useState([]);
  
  React.useEffect(() => {
    auth.getRepos().then(setRepos);
  }, []);

  React.useEffect(() => {
    auth.getName().then(setName);
  }, []);
  React.useEffect(() => auth.getUserImage().then(setImg), []);
  return (
    <Container>
      <D>
        <Pfp src={img} /> <H3>{name}</H3>
      </D>
      <D>
        <H3>Repositories</H3>
      </D>
      {repos.slice(0, 10).map((repo, _) => (
        <D key={repo.id}>
          <RepoLink to="/">
            <FolderOpenOutlined />
            {repo.name}
          </RepoLink>
        </D>
      ))}
    </Container>
  );
};

export default Sidebar;
