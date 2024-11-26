import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import createError from 'http-errors';

const client = new DynamoDBClient({region: 'us-east-1'});
async function getAuctions(event, context) {


let auctions;

try {
    const result = await client.send(new ScanCommand({
        TableName: process.env.AUCTIONS_TABLE_NAME,
    }));
    auctions = result.Items;
} catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
}


  return {
    statusCode: 200,
    body: JSON.stringify(auctions ),
  };
}

export const handler = middy(getAuctions).use(httpEventNormalizer()).use(httpErrorHandler());


