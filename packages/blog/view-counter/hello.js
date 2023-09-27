const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  UpdateCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();
const dynamoDB = new DynamoDBClient({
  region: "sa-east-1",
});
async function main(args) {
  const { post = "", secret = "" } = args;
  if (post && process.env.SECRET === secret) {
    const docClient = DynamoDBDocumentClient.from(dynamoDB);
    const params = {
      TableName: "blog",
      Key: {
        id: post,
      },
      UpdateExpression:
        "SET numberOfViews = if_not_exists(numberOfViews, :initial) + :increment",
      ExpressionAttributeValues: {
        ":initial": 0,
        ":increment": 1,
      },
      ReturnValues: "ALL_NEW",
    };
    try {
      const result = await docClient.send(new UpdateCommand(params));
      return {
        status: result.$metadata.httpStatusCode,
        item: result.Attributes,
      };
    } catch (err) {
      console.log({ err });
      return { err };
    }
  } else {
    return {
      err: "no blog or secret sent",
    };
  }
}
exports.main = main;
