import { Review, User } from '../../models/index.js';
import Joi from 'joi';

const idSchema = Joi.number().integer().positive().required();

export async function getAllReviewsBackOffice(req, res) {
  try {
    const reviews = await Review.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstname', 'lastname', 'email'], // Sélectionne uniquement les champs nécessaires
        },
      ],
    });

    if (!reviews || reviews.length === 0) {
      res.status(404).send('Aucun avis trouvé');
      return;
    }
    res.render('reviews', { reviews });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function updateReviewBackOffice(req, res) {
  try {
    // Schéma de validation de l'ID
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }
    const reviewId = Number.parseInt(req.params.id);

    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404).send('Avis non trouvé');
      return;
    }

    // Définir le schéma Joi directement dans la fonction
    const reviewSchema = Joi.object({
      content: Joi.string().allow(null, ''), // Autorise null ou une chaîne vide
      rating: Joi.number()
        .integer()
        .min(1)
        .max(5) // Par exemple, pour une note de 1 à 5
        .required(),
      id_user: Joi.number().required(),
    });

    // Validation des données de req.body avec Joi
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .send(`Erreur de validation : ${error.details[0].message}`);
      return;
    }

    // Déstructuration de req.body avec valeurs par défaut
    const { content, rating, id_user } = req.body;
    review.content = content || review.content;
    review.rating = rating || review.rating;
    review.id_user = id_user || review.id_user;

    // Sauvegarder les modifications
    await review.save();

    res.status(200).redirect('/admin/reviews');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function deleteReviewBackOffice(req, res) {
  try {
    // Schéma de validation de l'ID
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }
    const reviewId = Number.parseInt(req.params.id);

    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404).send('Avis non trouvé');
      return;
    }

    await review.destroy();

    res.status(204).redirect('/admin/reviews');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
