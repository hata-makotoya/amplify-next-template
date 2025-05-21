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
    (async () => {
      const { data, errors } = await client.mutations.addPost({
        id: uuidv4(),
        title: "Test Title",
        content: "Test content",
        author: user?.signInDetails?.loginId ?? "anonymous",
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
      } else {
        console.log("投稿成功:", data);
      }
    })();
  }, []);

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
