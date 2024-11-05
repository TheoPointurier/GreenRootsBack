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
getUserAndHashPassword();
