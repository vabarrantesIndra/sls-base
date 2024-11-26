import {v4 as uuidv4} from 'uuid';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import { marshall } from '@aws-sdk/util-dynamodb';
import createError from 'http-errors';

const client = new DynamoDBClient({region: 'us-east-1'});
async function createAuction(event, context) {

  const {title} = event.body

  const auction = {
    id: uuidv4(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  }

  try {
    await client.send(new PutItemCommand({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: marshall(auction),
    }));
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }


  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction).use(httpJsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler());


