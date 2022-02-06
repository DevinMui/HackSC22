import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Admin = () => {
  const { owner, repo } = useParams();
  const [infos, setInfos] = useState([]);

  const pay = async () => {
    try {
      const res = await fetch(
        `/api/campaigns/${encodeURIComponent(`${owner}/${repo}`)}/payout`,
        { method: 'POST' }
      );
      const { info } = await res.json();
      console.log(info);
      setInfos(info);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>
        {owner}/{repo}
      </h1>
      <button onClick={pay}>Payout</button>
      {infos.length > 0 && <h3>Emails Sent</h3>}
      {infos.map((info) => (
        <p>
          Email:{' '}
          <a target="_blank" rel="noreferrer" href={info.url}>
            {info.url}
          </a>
        </p>
      ))}
    </>
  );
};

export default Admin;
