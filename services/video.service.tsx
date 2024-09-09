import axios from "axios";
import { cache } from "react";
import IVideo from "../interfaces/video.interface";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export const VideoService = {
  getById: cache(async (id: string) => {
    const { data } = await axios.get<IVideo>("video/" + id);
    return data;
  }),
};
