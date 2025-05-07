import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQS } from 'aws-sdk';

const sqs = new SQS();
const QUEUE_URL = process.env.QUEUE_URL!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || '[]');
  const entries = body.map((item: any, index: number) => ({
    Id: index.toString(),
    MessageBody: JSON.stringify(item)
  }));

  await sqs.sendMessageBatch({
    QueueUrl: QUEUE_URL,
    Entries: entries
  }).promise();

  return { statusCode: 200, body: 'Mensagens enviadas à fila!' };
};
