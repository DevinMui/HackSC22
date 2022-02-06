async function sponsor(owner, repo, userId, contribution) {
  // Attempts to create monthly sponsorship with amount to repo
  const res = await fetch(
    `/campaigns/${encodeURIComponent(owner + '/' + repo)}/sponsor`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contribution,
        repoId: encodeURIComponent(owner + '/' + repo),
        userId,
      }),
    }
  );
  console.log(owner, repo, contribution);
  return (await res.json()).clientSecret;
}

export { sponsor };
