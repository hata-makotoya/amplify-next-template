// app/page.tsx

"use client";

import { v4 as uuidv4 } from "uuid";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { ImageDownloader } from "@/components/ImageDownloader";

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {

  const { user, signOut } = useAuthenticator();

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);



  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }


  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }



  useEffect(() => {
    listTodos();
    // 投稿作成テスト
    // (async () => {
    //   const { data, errors } = await client.mutations.addPost({
    //     id: uuidv4(),
    //     title: "Test Title",
    //     content: "Test content",
    //     author: user?.signInDetails?.loginId ?? "anonymous",
    //   });

    //   if (errors) {
    //     console.error("GraphQL errors:", errors);
    //   } else {
    //     console.log("投稿成功:", data);
    //   }
    // })();

  }, []);

  async function handleAddPost() {
    const { data, errors } = await client.mutations.addPost({
      id: uuidv4(),
      title: window.prompt("タイトルを入力") ?? "",
      content: window.prompt("内容を入力") ?? "",
      author: user?.signInDetails?.loginId ?? "anonymous",
    });

    if (errors) console.error("投稿エラー:", errors);
    else console.log("投稿成功:", data);
  }

  async function handleGetPost() {
    const id = window.prompt("取得する投稿のID");
    if (!id) return;

    const { data, errors } = await client.queries.getPost({ id });

    if (errors) console.error("取得エラー:", errors);
    else console.log("取得成功:", data);
  }

  async function handleUpdatePost() {
    const id = window.prompt("更新する投稿ID");
    if (!id) return;
    const title = window.prompt("新タイトル");
    const content = window.prompt("新内容");
    const versionStr = window.prompt("現在のバージョン番号");
    if (!versionStr) return;

    const expectedVersion = parseInt(versionStr);
    const { data, errors } = await client.mutations.updatePost({
      id,
      title: title ?? undefined,
      content: content ?? undefined,
      expectedVersion,
    });

    if (errors) console.error("更新エラー:", errors);
    else console.log("更新成功:", data);
  }

  async function handleDeletePost() {
    const id = window.prompt("削除する投稿ID");
    if (!id) return;
    const versionStr = window.prompt("バージョン（省略可）");
    const expectedVersion = versionStr ? parseInt(versionStr) : undefined;

    const { data, errors } = await client.mutations.deletePost({
      id,
      expectedVersion,
    });

    if (errors) console.error("削除エラー:", errors);
    else console.log("削除成功:", data);
  }


  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <h2>S3 ファイルダウンロード</h2>
      <ImageDownloader />
      <h2>S3 ファイルアップロード</h2>
      <FileUploader
        acceptedFileTypes={['image/*']}
        path="protected/"
        maxFileCount={1}
        isResumable
      />
      <div>
        <h2>投稿操作</h2>
        <button onClick={handleAddPost}>投稿を追加</button>
        <button onClick={handleGetPost}>投稿を取得</button>
        <button onClick={handleUpdatePost}>投稿を更新</button>
        <button onClick={handleDeletePost}>投稿を削除</button>
      </div>

      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
