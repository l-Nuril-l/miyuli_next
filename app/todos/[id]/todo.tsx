"use client";

import ITodo from "@/interfaces/todo.interface";

export default async function Todo({ todo }: { todo: ITodo }) {
  console.log(3);
  console.log(todo);
  //   const todo = await TodoService.getById("1");
  console.log(3);
  return <div>todo {todo.id}</div>;
}
