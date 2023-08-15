import mongoose from 'mongoose';


const Connection = async (username = 'rsainwork', password = 'rsainwork') => {
  const URL = `mongodb://${username}:${password}@ac-2locbwb-shard-00-00.qrkcgwc.mongodb.net:27017,ac-2locbwb-shard-00-01.qrkcgwc.mongodb.net:27017,ac-2locbwb-shard-00-02.qrkcgwc.mongodb.net:27017/?ssl=true&replicaSet=atlas-4i9qr3-shard-0&authSource=admin&retryWrites=true&w=majority`;

  try {
    const connection = await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("Database connected successfully");

    return connection.connection.db; // Return the database instance
  } catch (error) {
    console.log("Error while connecting with the database", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
};

export default Connection;
