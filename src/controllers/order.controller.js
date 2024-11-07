import Joi from 'joi';
import { Campaign, Order, OrderLine, Tree, User } from '../models/index.js';
import { or } from 'sequelize';

//todo changer message si !userId
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

//todo changer message si !userId
export async function createOrder(req, res) {
  //Méthode pour valider son panier
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing in the request' });
  }

  const createOrderSchema = Joi.object({
    total_amount: Joi.number().precision(2).required(),
    status: Joi.string().required(),
    order_number: Joi.string().required(),
    orderLines: Joi.array().items(
      Joi.object({
        price_ht_at_order: Joi.number().precision(2).required(),
        quantity: Joi.number().required(),
        total_amount: Joi.number().precision(2).required(),
        id_campaign: Joi.number().required(),
        id_tree: Joi.number().required(),
      }),
    ),
  });

  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { total_amount, status, order_number, orderLines } = req.body;

  //On créer l'order avec l'id du token utilisateur
  const createdOrder = await Order.create({
    total_amount,
    status,
    order_number,
    id_user: userId,
  });

  // gérer le cas ou la commande contient des lignes de commande
  const createdOrderId = createdOrder.id;
  // constitution d'un nouveau tableau avec les infos de chaque lignes de commande, auquel on ajoute l'idOrder
  if (orderLines && orderLines.length > 0) {
    const orderLinesCreated = orderLines.map((orderLine) => ({
      ...orderLine,
      id_order: createdOrderId,
    }));

    //bulkcreate permet de créer plusieurs lignes de commande en une seule requête
    //Il remplace un for of / create
    const createdOrderLine = await OrderLine.bulkCreate(orderLinesCreated);
    console.log('ICI', createdOrderLine);
    res.status(201).json({ createdOrder, createdOrderLine });
  } else {
    res.status(201).json({ createdOrder });
  }
}
