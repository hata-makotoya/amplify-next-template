// Backend.ts
// amplify/backend.ts

import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { firstBucket, secondBucket } from "./storage/resource";
import { aws_dynamodb } from "aws-cdk-lib";

export const backend = defineBackend({
  auth,
  data,
  firstBucket,
  secondBucket,
});

// 外部DynamoDBテーブルを AppSync のデータソースとして登録
const externalStack = backend.createStack("ExternalTableStack");

const externalTable = aws_dynamodb.Table.fromTableName(
  externalStack,
  "MyExternalPostTable",
  "PostTable" // ここが既存の DynamoDB テーブル名（リージョンも一致している必要あり）
);

backend.data.addDynamoDbDataSource(
  "ExternalPostTableDataSource", // この名前を data.ts 側と一致させること！
  externalTable
);
