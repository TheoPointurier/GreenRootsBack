import {
  Campaign,
  CampaignLocation,
  Country,
  Tree,
  TreeSpecies,
} from '../models/index.js';
import Joi from 'joi';

export async function getAllCampaign(req, res) {
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

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCampaign(req, res) {
  try {
    // Schéma de validation pour l'ID de la campagne
    const schema = Joi.object({
      id: Joi.number().integer().required(),
    });

    // Validation de l'ID avec Joi
    const { error } = schema.validate({ id: req.params.id });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const campaignID = Number.parseInt(req.params.id);

    const campaign = await Campaign.findByPk(campaignID, {
      // inclure l'association avec la table CampaignLocation
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
        // inclure l'association avec la table Tree
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

    if (campaign === null) {
      res.status(404).json({
        message: `La Campagne avec l'id ${req.params.id} n'a pas été trouvé`,
      });
    } else {
      res.json(campaign);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
