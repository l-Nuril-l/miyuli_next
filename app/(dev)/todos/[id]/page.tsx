import { TodoService } from "@/services/todo.service";
import { Metadata } from "next";
import Link from "next/link";
import Todo from "./todo";

interface TodoPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: TodoPageProps): Promise<Metadata> {
  const todo = await TodoService.getById(params.id);

  return {
    title: todo.title,
    description: todo.title,
    openGraph: {
      title: todo.title,
      type: "article",
      url: "/todo/" + todo.id,
    },
  };
}

export default async function TodoPage({ params }: TodoPageProps) {
  console.log(params);
  const todo = await TodoService.getById(params.id);
  return (
    <div>
      <div>Todo</div>
      <div>{todo.title}</div>
      <Todo todo={todo} />
      <Link href="/todos/1">1</Link>
      <Link href="/todos/2">1</Link>
    </div>
  );
}
