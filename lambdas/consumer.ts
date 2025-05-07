import { SQSEvent } from 'aws-lambda';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

export const handler = async (event: SQSEvent) => {
  await client.connect();
  const db = client.db('juizes-db');
  const collection = db.collection('juizes');

  for (const record of event.Records) {
    const juiz = JSON.parse(record.body);
    console.log('Consumido:', juiz);
    await collection.insertOne(juiz);
  }

  await client.close();
};
