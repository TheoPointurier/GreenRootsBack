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
        order: [['id', 'ASC']],
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

export async function updateOrderBackOffice(req, res) {
  const orderId = Number.parseInt(req.params.id);

  if (Number.isNaN(orderId)) {
    console.log(
      "Échec de la mise à jour : L'ID de la commande n'est pas un nombre",
    );
    res.status(400).send("L'id doit être un nombre");
    return;
  }

  // Schéma Joi pour la validation
  const updateOrderSchema = Joi.object({
    status: Joi.string()
      .valid('pending', 'completed', 'canceled')
      .required()
      .messages({
        'string.base': 'Le statut doit être une chaîne de caractères.',
        'any.only': 'Le statut doit être "pending", "completed" ou "canceled".',
      }),
    order_number: Joi.string().required().messages({
      'string.base':
        'Le numéro de commande doit être une chaîne de caractères.',
      'any.required': 'Le numéro de commande est requis.',
    }),
    orderLines: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().required(),
          quantity: Joi.number().positive().required(),
        }),
      )
      .required()
      .messages({
        'array.base': 'Les lignes de commande doivent être un tableau.',
      }),
  });

  const { status, order_number, orderLines } = req.body;

  // Validation Joi
  const { error } = updateOrderSchema.validate({
    status,
    order_number,
    orderLines,
  });

  if (error) {
    console.log(
      'Erreur de validation :',
      error.details.map((err) => err.message),
    );
    res.status(400).send(error.details.map((err) => err.message).join(', '));
    return;
  }

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
    console.log("Échec de la mise à jour : La commande n'a pas été trouvée");
    res.status(404).send('Commande non trouvée');
    return;
  }

  if (!order.user) {
    console.log(
      "Échec de la mise à jour : L'utilisateur associé à la commande n'a pas été trouvé",
    );
    res.status(404).send('Utilisateur non trouvé');
    return;
  }

  let totalAmount = 0;

  // Mise à jour des quantités pour chaque ligne de commande
  for (const lineUpdate of orderLines) {
    const orderLine = order.orderLines.find(
      (line) => line.id === lineUpdate.id,
    );

    if (orderLine) {
      // Mettre à jour la quantité et le montant total de la ligne de commande
      orderLine.quantity = lineUpdate.quantity;
      orderLine.total_amount =
        orderLine.price_ht_at_order * lineUpdate.quantity;
      await orderLine.save();
      console.log(
        `Ligne de commande mise à jour : id ${orderLine.id}, nouvelle quantité: ${orderLine.quantity}, nouveau montant total: ${orderLine.total_amount} €`,
      );

      // Ajouter au montant total de la commande
      totalAmount += orderLine.total_amount;
    } else {
      console.log(`Ligne de commande non trouvée : id ${lineUpdate.id}`);
    }
  }

  // Mise à jour des autres champs de la commande
  try {
    order.total_amount = totalAmount; // Montant recalculé
    order.status = status || order.status;
    order.order_number = order_number || order.order_number;

    await order.save();

    console.log('Commande mise à jour avec succès :', {
      id: orderId,
      total_amount: order.total_amount,
      status: order.status,
      order_number: order.order_number,
    });

    res.status(200).redirect('/admin/orders');
  } catch (updateError) {
    console.log('Erreur lors de la mise à jour de la commande:', updateError);
    res.status(500).send('Erreur lors de la mise à jour de la commande');
  }
}

// todo gérer erreur :  original: error: UPDATE ou DELETE sur la table « orders » viole la contrainte de clé étrangère « order_line_id_order_fkey » de la table « order_line »
// todo voir pour modif association on delete cascade
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

// todo à faire ?
export async function getOneOrder(req, res) {}

// todo changer message si !userId
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
