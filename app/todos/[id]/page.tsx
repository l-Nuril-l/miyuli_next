import { TodoService } from "@/services/todo.service";
import { Metadata } from "next";
import Todo from "./todo";

interface TodoPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: TodoPageProps): Promise<Metadata> {
  console.log(1);
  const todo = await TodoService.getById(params.id);

  console.log(1);

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
  console.log(2);

  const todo = await TodoService.getById(params.id);
  console.log(2);
  return (
    <div>
      <div>Todo</div>
      <div>{todo.title}</div>
      <Todo todo={todo} />
    </div>
  );
}
