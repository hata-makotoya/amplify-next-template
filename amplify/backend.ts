import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource'; // 👈 追加
import { firstBucket, secondBucket } from './storage/resource';

defineBackend({
  auth,
  data, // 👈 忘れずに追加
  firstBucket,
  secondBucket
});
