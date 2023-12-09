// Create a new user

import crypto from 'crypto';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  // Hash the password using SHA-1
  const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

  if (await dbClient.findUser(email)) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const user = {
    email,
    password: hashedPassword,
  };

  try {
    const result = await dbClient.saveUser(user);
    return res.status(201).json({ id: result.insertedId, email: user.email });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  postNew,
}
