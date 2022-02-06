import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/auth';
import { Chart, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement);

const Campaign = () => {
  const { owner, repo } = useParams();
  const { getFile, getContributions } = useAuth();
  const [readme, setReadme] = useState('');
  const [contributors, setContributors] = useState([]);
  // const [rank, setRank] = useState(SAMPLE_DATA.rank);
  const [labels, setLabels] = useState([]);
  const [nums, setNums] = useState([]);

  useEffect(() => {
    getContributions(owner, repo).then((x) => console.log(x))
    const path = 'README.md';
    getFile(owner, repo, path).then((res) => {
      console.log(res.data);
      const { content } = res.data;
      // decode b64 to utf8
      setReadme(atob(content));
    });

    // calculations
    const nums = [];
    const labels = [];
    let otherNum = 0;
    // rank.forEach((r, i) => {
    //   if (i > 3) {
    //     otherNum += Number(r.commits);
    //     return;
    //   }

    //   nums.push(Number(r.commits));
    //   labels.push(r.name);
    // });

    if (otherNum) {
      nums.push(otherNum);
      labels.push('Other');
    }

    setNums(nums);
    setLabels(labels);
  }, []);

  return (
    <>
      <ReactMarkdown>{readme}</ReactMarkdown>
      {/* <Doughnut data={data} /> */}
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
