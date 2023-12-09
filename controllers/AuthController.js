// Authenticate a user
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const base64Encoded = authHeader.slice('Basic '.length);
  const credentials = Buffer.from(base64Encoded, 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');

  try {
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const user = await dbClient.findUser(email, hashedPassword);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 86400);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDisconnect = async (req, res) => {
  const token = req.header('X-Token');
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await redisClient.del(`auth_${token}`);
  return res.status(204).end();
};

export default {
  getConnect,
  getDisconnect,
};
