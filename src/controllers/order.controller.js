import Joi from 'joi';
import { Campaign, Order, OrderLine, Tree, User } from '../models/index.js';

export async function getAllOrdersByUser(req, res) {
  //récupérer l'id de l'utilisateur connecté
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing in the request' });
  }

  const orders = await Order.findAll({
    where: {
      id_user: userId,
    },
    include: [
      {
        model: User,
        as: 'user',
      },
      {
        model: OrderLine,
        as: 'orderLines',
        include: [
          {
            model: Tree,
            as: 'tree',
          },
          {
            model: Campaign,
            as: 'campaign',
          },
        ],
      },
    ],
  });

  res.json(orders);
}

export async function getOneOrder(req, res) {}

export async function createOrder(req, res) {}

export async function updateOrder(req, res) {
  const orderId = Number.parseInt(req.params.id);

  if (Number.isNaN(orderId)) {
    res.status(400).send("L'id doit être un nombre");
    return;
  }
  console.log(orderId);

  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: User,
        as: 'user',
      },
      {
        model: OrderLine,
        as: 'orderLines',
        include: [
          {
            model: Tree,
            as: 'tree',
          },
          {
            model: Campaign,
            as: 'campaign',
          },
        ],
      },
    ],
  });

  if (!order) {
    res.status(404).send('Commande non trouvée');
    return;
  }

  // On veux pouvoir éditer: les infos user, les infos orderLines
  //todo le total_amout censé être number accepte les string, à corriger

  //todo prévoir schéma Joi
  const { total_amount, status, order_number } = req.body;

  //on update les champs modifiés
  order.total_amount = total_amount || order.total_amount;
  order.status = status || order.status;
  order.order_number = order_number || order.order_number;

  await order.save();

  res.json(order);
}

//todo gérer erreur :  original: error: UPDATE ou DELETE sur la table « orders » viole la contrainte de clé étrangère « order_line_id_order_fkey » de la table « order_line »
//todo voir pour modif association on delete cascade
export async function deleteOrder(req, res) {
  try {
    const orderId = Number.parseInt(req.params.id);

    if (Number.isNaN(orderId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      res.status(404).send('Commande non trouvée');
      return;
    }

    await order.destroy();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
