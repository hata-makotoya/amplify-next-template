'use client';

import React from 'react';
import { uploadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

export default function FileUploaderWithProgress() {
    const [file, setFile] = React.useState<File | null>(null);
    const [progress, setProgress] = React.useState<number>(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };

    const handleUpload = async () => {
        if (!file) return alert('ファイルを選択してください');

        try {
            const task = uploadData({
                path: `protected/${file.name}`,
                data: file,
                options: {
                    contentType: file.type,
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            const percent = Math.round((transferredBytes / totalBytes) * 100);
                            setProgress(percent);
                        }
                    },
                },
            });

            const result = await task.result;
            console.log('Upload success:', result.path);
            alert('アップロード完了！');
            setProgress(0); // 終了後リセット
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('アップロードに失敗しました: ${error?.message ?? error}');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>アップロード</button>
            {progress > 0 && (
                <p>アップロード進行中: {progress}%</p>
            )}
        </div>
    );
}
