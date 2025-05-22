import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // ✅ Todo 
  Todo: a.model({
    content: a.string(),
  }).authorization(allow => [allow.owner(),allow.authenticated()]),

  // Post は外部テーブル
  Post: a.customType({
    id: a.id().required(),
    author: a.string().required(),
    title: a.string(),
    content: a.string(),
    url: a.string(),
    ups: a.integer(),
    downs: a.integer(),
    version: a.integer(),
  }),

  // addPost(投稿追加)用のカスタムミューテーション

  addPost: a.mutation()
    .arguments({
      id: a.id().required(),
      author: a.string().required(),
      title: a.string(),
      content: a.string(),
      url: a.string(),
    })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.custom({
      dataSource: "ExternalPostTableDataSource",
      entry: "./functions/addPost.js",
    })),


  // getPost(投稿取得)用のカスタムミューテーション
  getPost: a
    .query()
    .arguments({ id: a.id().required() })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalPostTableDataSource",
        entry: "./functions/getPost.js",
      })
    ),

  // updatePost(投稿更新)用のカスタムミューテーション
  updatePost: a
    .mutation()
    .arguments({
      id: a.id().required(),
      author: a.string(),
      title: a.string(),
      content: a.string(),
      url: a.string(),
      expectedVersion: a.integer().required(),
    })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalPostTableDataSource",
        entry: "./functions/updatePost.js",
      })
    ),

  // deletePost(投稿削除)用のカスタムミューテーション
  deletePost: a
    .mutation()
    .arguments({ id: a.id().required(), expectedVersion: a.integer() })
    .returns(a.ref("Post"))
    .authorization(allow => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "ExternalPostTableDataSource",
        entry: "./functions/deletePost.js",
      })
    ),

// VisitRecord 型（POSTのデータ構造）
  VisitRecord: a.customType({
    visitRecordId: a.string().required(),
    visitDate: a.string().required(),
    officeId: a.string().required(),
    childId: a.string().required(),
    plannedArrivalTime: a.string(),
    contractedDuration: a.integer(),
    actualArrivalTime: a.string(),
    actualLeaveTime: a.string(),
    actualDuration: a.integer(),
    lateReasonCode: a.string(),
    earlyLeaveReasonCode: a.string(),
    isManuallyEntered: a.boolean().required(),
    isDeleted: a.boolean(),
    createdAt: a.string(),
    createdBy: a.string(),
    updatedAt: a.string(),
    updatedBy: a.string().required(),
    version: a.integer(),
  }),

  // ミューテーションの定義（データ登録用）
  addVisitRecord: a.mutation()
    .arguments({
      visitRecordId: a.string().required(),
      visitDate: a.string().required(),
      officeId: a.string().required(),
      childId: a.string().required(),
      plannedArrivalTime: a.string(),
      contractedDuration: a.integer(),
      actualArrivalTime: a.string(),
      actualLeaveTime: a.string(),
      actualDuration: a.integer(),
      lateReasonCode: a.string(),
      earlyLeaveReasonCode: a.string(),
      isManuallyEntered: a.boolean().required(),
      isDeleted: a.boolean(),
      createdAt: a.string(),
      createdBy: a.string(),
      updatedAt: a.string(),
      updatedBy: a.string().required(),
      version: a.integer(),
    })
    .returns(a.ref("VisitRecord"))
    .handler(a.handler.custom({
      dataSource: "VisitRecordTableDataSource",
      entry: "./functions/addVisitRecord.js",
    })),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
