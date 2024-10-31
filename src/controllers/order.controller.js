import Joi from 'joi';
import { Campaign, Order, OrderLine, Tree, User } from '../models/index.js';

export async function getAllOrders(req, res) {}

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

export async function deleteOrder(req, res) {}
