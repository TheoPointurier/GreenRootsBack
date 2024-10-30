import { Tree } from "../models/tree.model.js";

export async function getAllTrees(req, res) {
  const trees = await Tree.findAll();
  res.json(trees);
}
