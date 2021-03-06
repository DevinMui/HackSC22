import { createContext, useContext, useState } from 'react';
import { Octokit } from 'octokit';
import {
  _getContributions,
  _getName,
  _getRepos,
  _getUserImage,
} from '../api/github';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  // client not persisted thru localStorage but user token is
  const [client, setClient] = useState(
    JSON.parse(localStorage.getItem('user')) &&
      new Octokit({ auth: JSON.parse(localStorage.getItem('user')).token })
  );

  function login(token) {
    const _user = { token };
    localStorage.setItem('user', JSON.stringify(_user));
    setUser(_user);
    setClient(new Octokit({ auth: token }));
  }

  function logout() {
    localStorage.removeItem('user');
    setClient(null);
    setUser(null);
  }

  async function getName() {
    try {
      return await _getName(client);
    } catch (e) {
      logout();
      throw e;
    }
  }

  async function getUserImage() {
    try {
      return await _getUserImage(client);
    } catch (e) {
      logout();
      throw e;
    }
  }

  async function getRepos() {
    try {
      return await _getRepos(client);
    } catch (e) {
      logout();
      throw e;
    }
  }

  async function getContributions(owner, repo) {
    try {
      return await _getContributions(null, owner, repo);
    } catch (e) {
      logout();
      throw e;
    }
  }

  async function getFile(owner, repo, path) {
    try {
      return await client.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
      });
    } catch (e) {
      throw e;
    }
  }

  async function getContributors(owner, repo) {
    try {
      return await client.request('GET /repos/{owner}/{repo}/contributors', {
        owner,
        repo,
      });
    } catch (e) {
      throw e;
    }
  }

  async function getImage() {
    try {
      return (await client.request('GET /user')).data.avatar_url;
    } catch (e) {
      throw e;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,

        // GitHub auth'd methods
        // TODO: cache results instead of spamming GH
        getName,
        getUserImage,
        getRepos,
        getContributions,
        getContributors,
        getFile,
        getImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
