import { atom } from "recoil";

export const bigMovieId = atom<string>({
  key: "movieId",
  default: "129",
});
export const bigTvId = atom<string>({
  key: "tvId",
  default: "129",
});
export const currentPage = atom<number>({
  key: "page",
  default: 1,
});
