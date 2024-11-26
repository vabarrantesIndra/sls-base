import { DynamoDBClient, QueryCommand, UpdateCommand    } from "@aws-sdk/client-dynamodb";
import createError from 'http-errors';
import { marshall } from '@aws-sdk/util-dynamodb';
import commonMiddleware from '../lib/commonMiddleware.mjs';
const client = new DynamoDBClient({region: 'us-east-1'});

async function placeBid(event, context) {


let updatedAuction;
const {id} = event.pathParameters;
const {amount} = event.body;

const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: marshall({id}),
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: marshall({':amount': amount}),
    ReturnValues: 'ALL_NEW',
}

try {
    const result = await client.send(new UpdateCommand(params));
    updatedAuction = result.Attributes;
} catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
}

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction ),
  };
}

export const handler = commonMiddleware(placeBid);


