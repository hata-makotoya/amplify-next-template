// storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
  name: "firstBucket",
  access: (allow) => ({
    'public/*': [allow.guest.to(['read'])],
    'protected/*': [allow.authenticated.to(['read', 'write'])],
    'private/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
  isDefault: true,
});

export const secondBucket = defineStorage({
  name: "secondBucket",
  access: (allow) => ({
    'public/*': [allow.guest.to(['read'])],
    'protected/*': [allow.authenticated.to(['read', 'write'])],
    'private/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
});
