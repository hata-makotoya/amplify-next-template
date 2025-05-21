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
      <img src={imageUrl} alt="From S3"
        style={{
          maxWidth: '100%',
          maxHeight: '300px',  // ★ 高さ制限を追加
          objectFit: 'contain', // ★ はみ出し対策に中身を収める
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }} />
    </div>
  );
}
