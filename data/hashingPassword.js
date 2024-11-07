import { User } from '../src/models/index.js';
import bcrypt from 'bcrypt';

// méthode de hachage du mot de passe au moment du seeding
async function getUserAndHashPassword() {
  const users = await User.findAll();

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await user.save();
  }
}
// Appel de la fonction principale et terminaison correcte du processus
getUserAndHashPassword()
  .then(() => {
    console.log('Hachage des mots de passe terminé');
    process.exit(0); // Sortie avec succès
  })
  .catch(error => {
    console.error('Erreur lors du hachage des mots de passe:', error);
    process.exit(1); // Sortie avec erreur
  });