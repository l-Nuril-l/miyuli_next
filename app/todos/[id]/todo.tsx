"use client";

export default async function Todo({ todo }) {
  console.log(3);
  console.log(todo);
  //   const todo = await TodoService.getById("1");
  console.log(3);
  return <div>todo {todo.id}</div>;
}
