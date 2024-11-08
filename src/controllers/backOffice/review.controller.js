import { Review, User } from '../../models/index.js';

export async function getAllReviewsBackOffice(req, res) {
  try {
    const reviews = await Review.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: User,
          as: 'user', // Assurez-vous que l'alias correspond à votre association Sequelize
          attributes: ['firstname', 'lastname', 'email'], // Sélectionne uniquement les champs nécessaires
        },
      ],
    });

    if (!reviews || reviews.length === 0) {
      res.status(404).send('Aucun avis trouvé');
      return;
    }
    console.log(reviews);
    res.render('reviews', { reviews });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
