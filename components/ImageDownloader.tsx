'use client';
import React, { useEffect, useState } from 'react';
import { downloadData } from 'aws-amplify/storage';

export function ImageDownloader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { body } = await downloadData({
          path: 'album/2024/1.jpg',
          options: {
            bucket: 'secondBucket', // Amplify defineStorage によって登録したバケット名
          },
        }).result;

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
