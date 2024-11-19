import {
  Campaign,
  CampaignLocation,
  Country,
  Tree,
  TreeSpecies,
} from '../../models/index.js';
import Joi from 'joi';
import { sequelize } from '../../models/index.js';

const idSchema = Joi.number().integer().positive().required();

const campaignSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  start_campaign: Joi.date().iso().allow(null),
  end_campaign: Joi.date().iso().allow(null),
  treesCampaign: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().required(),
    }),
  ),
  location: Joi.object({
    id: Joi.number().integer(),
    name_location: Joi.string(),
    id_country: Joi.number().integer(),
    country: Joi.object({
      id: Joi.number().integer(),
      name: Joi.string(),
    }),
  }),
});

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
      order: [['id', 'ASC']],
    });
    const trees = await Tree.findAll();
    res.render('campaigns', { campaigns, trees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function createCampaignBackoffice(req, res) {
  try {
    // Validation de la requête avec Joi
    const { error } = campaignSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    // Extraire les données de la requête
    const {
      name,
      description,
      start_campaign,
      end_campaign,
      treesCampaign,
      location,
    } = req.body;

    // Création de la campagne
    const campaign = await Campaign.create({
      name,
      description,
      start_campaign,
      end_campaign,
    });

    // Gérer les associations de localisation et de pays
    let countryRecord;
    // test avec une chaine optionnelle au lieu de if(location && location.country && location.country.name)
    if (location?.country?.name) {
      const countryNameLower = location.country.name.toLowerCase();
      [countryRecord] = await Country.findOrCreate({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('name')),
          countryNameLower,
        ),
        defaults: { name: location.country.name }, // Nom avec la casse originale pour l'insertion
      });
    }

    // Création de la localisation avec l'ID du pays
    const campaignLocation = await CampaignLocation.create({
      name_location: location ? location.name_location : null,
      id_country: countryRecord ? countryRecord.id : null,
    });

    // Associer la localisation à la campagne
    await campaign.setLocation(campaignLocation);

    // Gérer les associations d'arbres
    if (treesCampaign && treesCampaign.length > 0) {
      // Vérifier que tous les arbres existent
      const treeIds = treesCampaign.map((tree) => tree.id);
      const existingTrees = await Tree.findAll({
        where: { id: treeIds },
      });

      if (existingTrees.length !== treeIds.length) {
        return res
          .status(400)
          .send({ message: 'Certains arbres fournis n’existent pas' });
      }

      // Associer les arbres à la campagne
      await campaign.setTreesCampaign(treeIds);
    }

    // Récupérer la campagne créée avec ses associations
    const newCampaign = await Campaign.findByPk(campaign.id, {
      include: [
        {
          model: Tree,
          as: 'treesCampaign',
          through: { attributes: [] }, // Pour exclure les champs de la table pivot
        },
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
      ],
    });

    res.redirect('/admin/campaigns');
  } catch (error) {
    console.error('Erreur lors de la création de la campagne:', error);
    res.status(500).send({
      message: 'Erreur lors de la création de la campagne',
      error: error.message,
    });
  }
}

export async function updateCampaignBackOffice(req, res) {
  try {
    console.log('Données reçues dans req.body :', req.body);

    const { error } = campaignSchema.validate(req.body);
    if (error) {
      console.error('Validation échouée :', error.details);
      return res.status(400).json({ message: error.message });
    }

    const campaignId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(campaignId)) {
      console.error(
        "L'ID de la campagne est invalide ou manquant :",
        req.params.id,
      );
      return res.status(400).json({ message: 'ID de campagne invalide' });
    }
    console.log('Données reçues dans req.body :', req.body);

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({
        message: `La campagne avec l'id ${req.params.id} n'a pas été trouvée`,
      });
    }

    // Mettre à jour la campagne
    const {
      name,
      description,
      start_campaign,
      end_campaign,
      treesCampaign,
      location,
    } = req.body;
    if (name) campaign.name = name;
    if (description) campaign.description = description;
    if (start_campaign) campaign.start_campaign = start_campaign;
    if (end_campaign) campaign.end_campaign = end_campaign;
    await campaign.save();

    console.log('Campagne mise à jour avec succès', campaign);

    res.status(200).json({ message: 'Campagne mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la campagne', error);
    res.status(500).json({ message: 'Erreur interne', error: error.message });
  }
}

export async function deleteCampaignBackOffice(req, res) {
  const transaction = await sequelize.transaction(); // Démarrer une transaction
  try {
    // Schéma de validation de l'ID
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }
    // Vérification de l'ID
    const campaignId = Number.parseInt(req.params.id, 10);

    const campaign = await Campaign.findByPk(campaignId, {
      include: [
        { model: Tree, as: 'treesCampaign' },
        { model: CampaignLocation, as: 'location' },
      ],
      transaction,
    });

    if (!campaign) {
      await transaction.rollback();
      return res.status(404).json({
        message: `La campagne avec l'id ${req.params.id} n'a pas été trouvée`,
      });
    }

    // Supprimer la campagne avec toutes les associations grâce à `CASCADE`
    await campaign.destroy({ transaction });

    await transaction.commit(); // Valider la transaction
    res.status(200).redirect('/admin/campaigns');
  } catch (error) {
    await transaction.rollback(); // Annuler la transaction en cas d'erreur
    console.error('Erreur lors de la suppression de la campagne :', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la campagne',
      error: error.message,
    });
  }
}
