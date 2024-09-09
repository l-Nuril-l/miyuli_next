import ITodo from "@/interfaces/todo.interface";
import axiosDefault from "axios";
import { cache } from "react";

export const placeholderAxios = axiosDefault.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
});

export const TodoService = {
  getById: cache(async (id: string) => {
    console.log("NEW REQUEST");
    const { data } = await placeholderAxios.get<ITodo>("todos/" + id);
    return data;
  }),
  getAll: cache(async () => {
    const { data } = await placeholderAxios.get<ITodo[]>("todos");
    return data;
  }),
};
