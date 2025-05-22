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
