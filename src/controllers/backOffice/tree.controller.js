import Joi from 'joi';
import { Tree, TreeSpecies, Campaign } from '../../models/index.js';

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const treeSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[\w\s'À-ÿ-]+$/) // Autorise les lettres, espaces, apostrophes, caractères accentués et traits d'union
    .required(),
  price_ht: Joi.number().precision(2).allow(null),
  quantity: Joi.number().allow(null),
  age: Joi.number().positive().allow(null),
  id_species: Joi.number(),
  species: Joi.object({
    species_name: Joi.string().required(),
    description: Joi.string().allow(null),
    co2_absorption: Joi.number().positive().allow(null),
    average_lifespan: Joi.number().positive().allow(null),
  }),
});

export async function getAllTreesBackOffice(req, res) {
  try {
    const trees = await Tree.findAll({
      include: [
        {
          model: TreeSpecies,
          as: 'species',
        },
        {
          model: Campaign, // modèle associé via la table de liaison
          as: 'campaignTree',
          through: { attributes: [] },
        },
      ],
      order: [['id', 'ASC']],
    });

    res.render('trees', { trees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function createTreeBackOffice(req, res) {
  try {
    const { name, price_ht, quantity, age, species } = req.body;

    const { error } = treeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Rechercher ou créer l'espèce d'arbre
    let treeSpecies = await TreeSpecies.findOne({
      where: { species_name: species.species_name },
    });

    if (!treeSpecies) {
      treeSpecies = await TreeSpecies.create({
        species_name: species.species_name,
        description: species.description,
        co2_absorption: species.co2_absorption,
        average_lifespan: species.average_lifespan,
      });
    }

    // Créer l'arbre avec la référence à l'espèce trouvée ou créée
    await Tree.create({
      name,
      price_ht,
      quantity,
      age,
      id_species: treeSpecies.id,
    });
    res.status(200).json({ message: 'Arbre créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function updateTreeBackOffice(req, res) {
  try {
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }

    // Récupérer l'id de l'arbre à modifier
    const treeId = Number.parseInt(req.params.id);

    // Valider les données
    const { error } = treeSchema.validate(req.body);
    if (error) {
      console.error('Erreur de validation:', error.details);
      return res
        .status(400)
        .json({ error: 'Erreur de validation', details: error.details });
    }

    // Récupérer l'arbre et son espèce à partir de la base de données
    const tree = await Tree.findByPk(treeId, {
      include: [{ model: TreeSpecies, as: 'species' }], // Inclure l'espèce associée
    });

    if (!tree) {
      return res.status(404).json({ error: 'Arbre non trouvé' });
    }

    const { name, price_ht, quantity, age, species } = req.body;

    // Mettre à jour les champs de l'arbre
    if (name !== undefined) tree.name = name;
    if (price_ht !== undefined) tree.price_ht = price_ht;
    if (quantity !== undefined) tree.quantity = quantity;
    if (age !== undefined) tree.age = age;

    // Mettre à jour les champs de l'espèce, si fournis
    if (species) {
      const { species_name, description, co2_absorption, average_lifespan } =
        species;

      if (tree.species) {
        if (species_name !== undefined)
          tree.species.species_name = species_name;
        if (description !== undefined) tree.species.description = description;
        if (co2_absorption !== undefined)
          tree.species.co2_absorption = co2_absorption;
        if (average_lifespan !== undefined)
          tree.species.average_lifespan = average_lifespan;

        // Sauvegarder les modifications de l'espèce
        await tree.species.save();
      }
    }

    // Sauvegarder les modifications de l'arbre
    await tree.save();

    res.status(200).json({ message: 'Arbre mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    res
      .status(500)
      .json({ error: "Une erreur s'est produite", details: error.message });
  }
}

export async function deleteTreeBackOffice(req, res) {
  try {
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }
    const treeId = Number.parseInt(req.params.id);

    const tree = await Tree.findByPk(treeId);

    if (!tree) {
      res.status(404).send('Arbre non trouvé');
      return;
    }

    await tree.destroy();

    res.status(204).redirect('/admin/trees');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
