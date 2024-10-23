"use client";
import ITodo from "@/interfaces/todo.interface";
import { useState } from "react";

export default function Todo({ todo }: { todo: ITodo }) {
  const [state, setState] = useState(222);

  return (
    <div onClick={() => setState(state + 1)}>
      todo {todo.id} + {state}
    </div>
  );
}
