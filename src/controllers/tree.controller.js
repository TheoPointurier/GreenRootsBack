import { Tree, TreeSpecies} from "../models/index.js";


//todo limiter le nombre d'arbres envoyé ?
export async function getAllTrees(req, res) {

  try {    
    const trees = await Tree.findAll({
      include: [{
        model: TreeSpecies,
        as: "species",
      }]
    });
    res.json(trees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
