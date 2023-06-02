import axios from "axios";
import IVideo from "../interfaces/video.interface";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export const VideoService = {
  async getById(id: string) {
    const { data } = await axios.get<IVideo>("video/" + id);
    return data;
  },
};
