import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/auth';
import { Chart, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import SAMPLE_DATA from './sample_data';

Chart.register(ArcElement);

const Campaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFile, getContributors } = useAuth();
  const [readme, setReadme] = useState('');
  const [contributors, setContributors] = useState([]);
  const [rank, setRank] = useState(SAMPLE_DATA.rank);
  const [labels, setLabels] = useState([]);
  const [nums, setNums] = useState([]);

  useEffect(() => {
    const owner = 'DevinMui';
    const repo = 'HackSC22';
    const path = 'README.md';
    getFile(owner, repo, path).then((res) => {
      console.log(res.data);
      const { content } = res.data;
      // decode b64 to utf8
      setReadme(atob(content));
    });
    getContributors(owner, repo).then((res) => {
      setContributors(res.data);
    });

    // calculations
    const nums = [];
    const labels = [];
    let otherNum = 0;
    rank.forEach((r, i) => {
      if (i > 3) {
        otherNum += Number(r.commits);
        return;
      }

      nums.push(Number(r.commits));
      labels.push(r.name);
    });

    if (otherNum) {
      nums.push(otherNum);
      labels.push('Other');
    }

    setNums(nums);
    setLabels(labels);
  }, [getFile, getContributors, rank]);

  const data = {
    labels,
    datasets: [
      {
        label: 'My First Dataset',
        data: nums,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const onSponsor = async () => {
    const contribution = 1000;
    const res = await fetch(`/campaigns/${id}/sponsor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contribution,
        repoId: '',
        userId: '',
        subscriptionId: '',
        paymentAccepted: false,
      }),
    });
    const body = await res.json();
    console.log(body);
    const secret = body.clientSecret;
    navigate(`sponsors?clientSecret=${secret}`);
  };

  return (
    <>
      <ReactMarkdown>{readme}</ReactMarkdown>
      <button onClick={onSponsor}>Sponsor</button>
      <Doughnut data={data} />
      <h3>Contributors</h3>
      {contributors.map((contributor) => (
        <>
          <img src={contributor.avatar_url} alt={contributor.login} />
          <p>
            <a target="_blank" rel="noreferrer" href={contributor.html_url}>
              {contributor.login}
            </a>
          </p>
        </>
      ))}
    </>
  );
};
export default Campaign;
