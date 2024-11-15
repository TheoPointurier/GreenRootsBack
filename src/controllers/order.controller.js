import Joi from 'joi';
import {
  Campaign,
  Order,
  OrderLine,
  Tree,
  CampaignLocation,
  Country,
} from '../models/index.js';

export async function getAllOrdersByUser(req, res) {
  //récupérer l'id de l'utilisateur connecté
  const userId = req.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
  }

  try {
    const orders = await Order.findAll({
      where: { id_user: userId },
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
              ],
            },
          ],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la récupération des commandes.',
    });
  }
}

export async function createOrder(req, res) {
  //Méthode pour valider son panier
  const userId = req.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
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
