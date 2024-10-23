"use client";
import ITodo from "@/interfaces/todo.interface";
import { useEffect, useState } from "react";

export default function Todo({ todo }: { todo: ITodo }) {
  const [state, setState] = useState(222);
  useEffect(() => {
    setState(333);
  });
  console.log(3);
  console.log(todo);
  //   const todo = await TodoService.getById("1");
  console.log(3);
  return (
    <div>
      todo {todo.id} + {state}
    </div>
  );
}
