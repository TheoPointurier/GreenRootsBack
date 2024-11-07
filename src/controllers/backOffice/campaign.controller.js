import {
  Campaign,
  CampaignLocation,
  Country,
  Tree,
  TreeSpecies,
} from '../../models/index.js';
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaign,
  getCampaign,
} from '../campaign.controller.js';

export async function getAllCampaignBackofice(req, res) {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        {
          model: CampaignLocation,
          as: 'location',
          include: [
            {
              model: Country,
              as: 'country',
            },
          ],
        },
        {
          model: Tree,
          as: 'treesCampaign',
          include: [
            {
              model: TreeSpecies,
              as: 'species',
            },
          ],
        },
      ],
    });
    console.log(campaigns);
    res.render('campaigns', { campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export function createCampaignBackofice(req, res) {
  console.log('coucou');
  createCampaign(req, res);

  res.redirect('/');
}

export function updateCampaignBackofice(req, res) {
  updateCampaign(req, res);

  res.redirect('/');
}
