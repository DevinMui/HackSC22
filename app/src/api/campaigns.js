async function getCampaignsDummy(type, name) {
  switch (type) {
  }
  return [];
}

async function getCampaignDummy(repoId) {
  return {};
}

async function getCampaigns(type, name) {
  if (process.env.REACT_APP_USE_DUMMY_DATA) {
    return getCampaignsDummy(type, name);
  }
  const res = await fetch(`/campaigns?type=${type}&id=${name}`);
  return await res.json();
}

async function getCampaign(repoId) {
  if (process.env.REACT_APP_USE_DUMMY_DATA) {
    return getCampaignDummy(repoId);
  }
  const res = await fetch(`/campaigns/` + repoId);
  return await res.json();
}

async function createCampaign(name, url, goal) {
  const res = await fetch(`/campaigns`, {
    method: 'POST',
    body: JSON.stringify({
      name, url, goal
    })
  })
  return await res.json()
}

export { getCampaigns, getCampaign, createCampaign };
