import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Admin = () => {
  const { owner, repo } = useParams();
  const [infos, setInfos] = useState([]);

  const pay = async () => {
    console.log('pay');
    const res = await fetch(
      `/campaigns/${encodeURIComponent(`${owner}/${repo}`)}/payout`
    );
    const { info } = await res.json();
    setInfos(info);
  };

  return (
    <>
      <h1>
        {owner}/{repo}
      </h1>
      <button onClick={pay}>hi</button>
      <button onClick={pay}>Payout</button>
      {infos.length > 0 && <h3>Emails Sent</h3>}
      {infos.map((info) => (
        <p>
          Email:{' '}
          <a target="_blank" rel="noreferrer" href={`{info.url}`}>
            {info.url}
          </a>
        </p>
      ))}
    </>
  );
};

export default Admin;
