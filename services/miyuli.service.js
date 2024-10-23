import { axiosErrorToRejectValue } from "@/lib/functions";
import axios from "axios";
import { cache } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export const MiyuliService = {
  getAccount: cache(async (id) => {
    try {
      const response = await axios.get(`accounts/ProfileByIdOrLogin/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToRejectValue(error); // Обработка ошибок, если нужно
    }
  }),
  getImage: cache(async (arr) => {
    try {
      const response = await axios.get(`photo/Image/${arr[0]}/${arr[1]}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToRejectValue(error);
    }
  }),
  getVideo: cache(async (id) => {
    try {
      const response = await axios.get(`video/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToRejectValue(error);
    }
  }),
  getAudioPlaylist: cache(async (id) => {
    try {
      const response = await axios.get(`audio/getPlaylistAudio/${id}`);
      return response.data;
    } catch (error) {
      throw axiosErrorToRejectValue(error); // Обработка ошибок, если нужно
    }
  }),
};
