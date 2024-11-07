import { User, Review } from '../../models/index.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Review,
          as: 'reviews',
        },
      ],
      order: [['id', 'ASC']],
    });

    res.render('users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
