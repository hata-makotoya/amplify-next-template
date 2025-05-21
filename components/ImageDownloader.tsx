'use client';

import React, { useEffect, useState } from 'react';
import { downloadData } from 'aws-amplify/storage';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function ImageDownloader() {
  const { user } = useAuthenticator();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const key = `protected/${user?.userId}/benjamin.png`; // ✅ identityIdに変更！
        const task = downloadData({ path: key });
        const { body } = await task.result;
        const blob = await body.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('画像のダウンロード失敗:', error);
      }
    };

    if (user?.userId) {
      fetchImage();
    }
  }, [user?.userId]);

  if (!imageUrl) return <p>Loading image...</p>;

  return (
    <div>
      <h2>Downloaded Image</h2>
      <img src={imageUrl} alt="From S3" style={{ maxWidth: '100%' }} />
    </div>
  );
}
