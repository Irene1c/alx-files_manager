// MongoDB utils

import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  // saving a new user in the collection `users`
  async saveUser(user) {
    return this.client.db().collection('users').insertOne(user);
  }

  // find if a `user` exists in `users` collection
  async findUser(email, hashedPassword = null) {
    if (hashedPassword) {
      return this.client.db().collection('users').findOne({ email, password: hashedPassword });
    }
    return this.client.db().collection('users').findOne({ email });
  }

  // get use by 'id'
  async getUser(userId) {
    const user = this.client.db().collection('users').findOne({ _id: new ObjectId(userId) });
    return user;
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
