// components/ImageDownloader.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { downloadData } from 'aws-amplify/storage';

export function ImageDownloader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const task = downloadData({
          path: 'protected/benjamin.png',
        });

        const { body } = await task.result;
        const blob = await body.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('画像のダウンロード失敗:', error);
      }
    };

    fetchImage();
  }, []);

  if (!imageUrl) return <p>Loading image...</p>;

  return (
    <div>
      <h2>Downloaded Image</h2>
      <img src={imageUrl} alt="From S3" style={{ maxWidth: '100%' }} />
    </div>
  );
}
