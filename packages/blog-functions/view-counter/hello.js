const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const {
  UpdateCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");
const dynamoDB = new DynamoDBClient({
  region: "sa-east-1",
});
function main(args) {
  const { post = "", secret = "" } = args;
  if (post && process.env.SECRET === secret) {
    const docClient = DynamoDBDocumentClient.from(dynamoDB);
    const params = {
      TableName: "blog",
      Key: {
        id: "post",
      },
      UpdateExpression:
        "SET numberOfViews = if_not_exists(numberOfViews, :initial) + :increment",
      ExpressionAttributeValues: {
        ":initial": 0,
        ":increment": 1,
      },
    };
    return docClient
      .send(new UpdateCommand(params))
      .then((res) => {
        console.log({ res });
        return { res };
      })
      .catch((err) => {
        console.log({ err });
        return { err };
      });
  }
}

exports.main = main;
