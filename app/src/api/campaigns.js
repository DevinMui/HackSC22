async function getCampaigns(type, id) {
  switch (type) {
    case "highlights":
      return []; // List of popular + own
    case "subscribed":
      return []; // List of currently subscribed repos
    default:
      // explore
      return []; // List of popular repos
  }
}

async function getCampaign(id) {}

async function createCampaign(repo, goal) {}

export { getCampaigns, getCampaign, createCampaign };
