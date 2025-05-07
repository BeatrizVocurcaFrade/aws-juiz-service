import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';

export class JuizServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'JuizQueue');
    
    const fetchLambda = new lambda.Function(this, 'FetchLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'fetch-juizes.handler',
      code: lambda.Code.fromAsset('lambdas')
    });

    const fetchApi = new apigw.LambdaRestApi(this, 'FetchJuizesApi', {
      handler: fetchLambda,
      proxy: false,
    });

    fetchApi.root.addResource('juizes').addMethod('GET');

    const sendLambda = new lambda.Function(this, 'SendToQueueLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'send-to-queue.handler',
      code: lambda.Code.fromAsset('lambdas'),
      environment: {
        QUEUE_URL: queue.queueUrl,
      },
    });

    queue.grantSendMessages(sendLambda);

    fetchApi.root.addResource('post-juizes').addMethod('POST', new apigw.LambdaIntegration(sendLambda));

    const consumerLambda = new lambda.Function(this, 'ConsumerLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'consumer.handler',
      code: lambda.Code.fromAsset('lambdas'),
    });

    consumerLambda.addEventSource(new eventsources.SqsEventSource(queue));
  }
}
