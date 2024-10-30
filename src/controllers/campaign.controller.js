import { Campaign, CampaignLocation } from '../models/index.js';

export async function getAllCampaign(req, res) {
  try {
    const campaigns = await Campaign.findAll({
      
      include: [
        {
          attributes: { exclude: ['created_at', 'updated_at'] },
          model: CampaignLocation,
          as: 'location'
        }
      ]
    });
    
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
}