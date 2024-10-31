import Joi from "joi";
import { Tree, TreeSpecies } from "../models/index.js";

//todo limiter le nombre d'arbres envoyé ?
export async function getAllTrees(req, res) {
  try {
    const trees = await Tree.findAll({
      include: [
        {
          model: TreeSpecies,
          as: "species",
        },
      ],
    });
    res.json(trees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function getOneTree(req, res) {
  try {
    const treeId = Number.parseInt(req.params.id);
    console.log(treeId);

    if (Number.isNaN(treeId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }
    const tree = await Tree.findByPk(treeId, {
      include: [
        {
          model: TreeSpecies,
          as: "species",
        },
      ],
    });
    if (!tree) {
      res.status(404).send("Arbre non trouvé");
      return;
    }
    res.json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function createTree(req, res) {
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
    console.log(createTree);

    res.status(201).json(createdTree);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function updateTree(req, res) {
  try {
    //récupérer l'id de l'arbre à modifier
    const treeId = Number.parseInt(req.params.id);

    if (Number.isNaN(treeId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }
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

    const tree = await Tree.findByPk(treeId);

    if (!tree) {
      res.status(404).send("Arbre non trouvé");
      return;
    }


    const { name, price_ht, quantity, age, id_species } = req.body;

    //on update les champs modifiés
    tree.name = name || tree.name;
    tree.price_ht = price_ht || tree.price_ht;
    tree.quantity = quantity || tree.quantity;
    tree.age = age || tree.age;
    tree.id_species = id_species || tree.id_species;

    await tree.save();

    res.json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function deleteTree(req, res) {
  try {
    const treeId = Number.parseInt(req.params.id);

    if (Number.isNaN(treeId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }

    const tree = await Tree.findByPk(treeId);

    if (!tree) {
      res.status(404).send("Arbre non trouvé");
      return;
    }

    await tree.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
