import Joi from 'joi';
import { Tree, TreeSpecies } from '../../models/index.js';

export async function getAllTreesBackOffice(req, res) {
  try {
    const trees = await Tree.findAll({
      include: [
        {
          model: TreeSpecies,
          as: 'species',
        },
      ],
    });
    res.render('trees', { trees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function createTreeBackOffice(req, res) {
  try {
    const { name, price_ht, quantity, age, id_species } = req.body;

    //todo gérer le cas ou le champ name comprends ("toto11")

    const createTreeSchema = Joi.object({
      name: Joi.string().required(),
      price_ht: Joi.number().precision(2).positive(),
      quantity: Joi.number(),
      age: Joi.number().required().positive(),
      id_species: Joi.number(),
    });
    const { error } = createTreeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const createdTree = await Tree.create({
      name,
      price_ht,
      quantity,
      age,
      id_species,
    });
    console.log(createdTree);

    res.status(201).redirect('/admin/trees');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function updateTreeBackOffice(req, res) {
  try {
    // Récupérer l'id de l'arbre à modifier
    const treeId = Number.parseInt(req.params.id);

    if (Number.isNaN(treeId)) {
      return res.status(400).json({ error: "L'id doit être un nombre" });
    }

    // Schéma de validation pour la mise à jour
    const updateTreeSchema = Joi.object({
      name: Joi.string().required(),
      price_ht: Joi.number().precision(2).positive().optional(),
      quantity: Joi.number().optional(),
      age: Joi.number().positive().optional(),
      id_species: Joi.number().optional(),
      species: Joi.object({
        species_name: Joi.string().required(),
        description: Joi.string().optional(),
        co2_absorption: Joi.number().positive().optional(),
        average_lifespan: Joi.number().positive().optional(),
      }).optional(),
    });

    // Afficher les données reçues
    console.log('Données reçues pour la mise à jour:', req.body);

    // Valider les données
    const { error } = updateTreeSchema.validate(req.body);
    if (error) {
      console.error('Erreur de validation:', error.details);
      return res
        .status(400)
        .json({ error: 'Erreur de validation', details: error.details });
    }

    // Récupérer l'arbre à partir de la base de données
    const tree = await Tree.findByPk(treeId);

    if (!tree) {
      return res.status(404).json({ error: 'Arbre non trouvé' });
    }

    const { name, price_ht, quantity, age, id_species } = req.body;

    // Mettre à jour les champs modifiés
    if (name !== undefined) tree.name = name;
    if (price_ht !== undefined) tree.price_ht = price_ht;
    if (quantity !== undefined) tree.quantity = quantity;
    if (age !== undefined) tree.age = age;
    if (id_species !== undefined) tree.id_species = id_species;

    // Sauvegarder les modifications
    try {
      await tree.save();
      res.status(200).json({ message: 'Arbre mis à jour avec succès' });
    } catch (saveError) {
      console.error("Erreur lors de la sauvegarde de l'arbre:", saveError);
      res.status(500).json({
        error: "Erreur lors de la sauvegarde de l'arbre",
        details: saveError.message,
      });
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
    res
      .status(500)
      .json({ error: "Une erreur s'est produite", details: error.message });
  }
}

export async function deleteTreeBackOffice(req, res) {
  try {
    const treeId = Number.parseInt(req.params.id);

    if (Number.isNaN(treeId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }

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
