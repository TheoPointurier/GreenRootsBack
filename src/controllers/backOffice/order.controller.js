import Joi from 'joi';
import { Campaign, Order, OrderLine, Tree, User } from '../../models/index.js';

export async function getAllOrdersBackOffice(req, res) {
  const orders = await Order.findAll({
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
      {
        model: User,
        as: 'user',
        attributes: ['firstname', 'lastname'],
      },
    ],
  });
  console.log(orders);
  res.render('orders', { orders });
}

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
// export async function deleteOrder(req, res) {
//   try {
//     const orderId = Number.parseInt(req.params.id);

//     if (Number.isNaN(orderId)) {
//       res.status(400).send("L'id doit être un nombre");
//       return;
//     }

//     const order = await Order.findByPk(orderId);

//     if (!order) {
//       res.status(404).send('Commande non trouvée');
//       return;
//     }

//     await order.destroy();

//     res.status(204).end();
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Une erreur s'est produite");
//   }
// }

//todo à faire ?
// export async function getOneOrder(req, res) {}

//todo changer message si !userId
// export async function createOrder(req, res) {
//   //Méthode pour valider son panier
//   const userId = req.userId;

//   if (!userId) {
//     return res.status(400).json({ error: 'User ID is missing in the request' });
//   }

//   const createOrderSchema = Joi.object({
//     total_amount: Joi.number().precision(2).required(),
//     status: Joi.string().required(),
//     order_number: Joi.string().required(),
//     orderLines: Joi.array().items(
//       Joi.object({
//         price_ht_at_order: Joi.number().precision(2).required(),
//         quantity: Joi.number().required(),
//         total_amount: Joi.number().precision(2).required(),
//         id_campaign: Joi.number().required(),
//         id_tree: Joi.number().required(),
//       }),
//     ),
//   });

//   const { error } = createOrderSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }

//   const { total_amount, status, order_number, orderLines } = req.body;

//   //On créer l'order avec l'id du token utilisateur
//   const createdOrder = await Order.create({
//     total_amount,
//     status,
//     order_number,
//     id_user: userId,
//   });

//   // gérer le cas ou la commande contient des lignes de commande
//   const createdOrderId = createdOrder.id;
//   // constitution d'un nouveau tableau avec les infos de chaque lignes de commande, auquel on ajoute l'idOrder
//   if (orderLines && orderLines.length > 0) {
//     const orderLinesCreated = orderLines.map((orderLine) => ({
//       ...orderLine,
//       id_order: createdOrderId,
//     }));

//     //bulkcreate permet de créer plusieurs lignes de commande en une seule requête
//     //Il remplace un for of / create
//     const createdOrderLine = await OrderLine.bulkCreate(orderLinesCreated);
//     console.log('ICI', createdOrderLine);
//     res.status(201).json({ createdOrder, createdOrderLine });
//   } else {
//     res.status(201).json({ createdOrder });
//   }
// }
