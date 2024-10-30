import { Tree, TreeSpecies} from "../models/index.js";


//todo limiter le nombre d'arbres envoyé ?
export async function getAllTrees(req, res) {
  const trees = await Tree.findAll({
    // association: "species"
    include: [{
      model: TreeSpecies,
      as: "species",
      attributes: [
        "species_name", "description", "co2_absorption", "average_lifespan"
      ]
    }]

  

  });
  res.json(trees);
}
