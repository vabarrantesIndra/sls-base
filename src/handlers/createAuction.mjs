import {v4 as uuidv4} from 'uuid';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";


const client = new DynamoDBClient({region: 'us-east-1'});
async function createAuction(event, context) {

  const {title} = JSON.parse(event.body);

  const auction = {
    id: uuidv4(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  }

  const dynamoResponse = await client.send(new PutItemCommand({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: marshall(auction),
  }));

console.log('dynamoResponse:', dynamoResponse);
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;


