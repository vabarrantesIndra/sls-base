import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import createError from 'http-errors';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({region: 'us-east-1'});
async function getAuction(event, context) {


let auction;
const {id} = event.pathParameters;

try {
    const result = await client.send(new QueryCommand({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: marshall({
            ':id': id,
        }),
    }));
    console.log('result:', result);
    if (result.Items.length === 0) {
        throw new createError.NotFound(`Auction with id ${id} not found`);
    }
    auction = result.Items[0]
} catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
}


  return {
    statusCode: 200,
    body: JSON.stringify(auction ),
  };
}

export const handler = middy(getAuction).use(httpEventNormalizer()).use(httpErrorHandler());



