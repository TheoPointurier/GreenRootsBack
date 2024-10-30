import { Campaign, CampaignLocation, Tree } from '../models/index.js';

export async function getAllCampaign(req, res) {
  try {
    const campaigns = await Campaign.findAll({
      
      include: [
        {
          model: CampaignLocation,
          as: 'location'
        },
        {
          model: Tree,
          as: 'treesCampaign',
        }
      ]
    });
    
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCampaign(req, res) {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: CampaignLocation,
          as: 'location'
        },
        {
          model: Tree,
          as: 'treesCampaign',
        }
      ]
    });
    
    if (campaign === null) {
      res.status(404).json({ message: `Campaign with id ${req.params.id} not found` });
    } else {
      res.json(campaign);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}