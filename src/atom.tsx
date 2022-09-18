import { atom } from "recoil";

export const atIndexState = atom<number>({
  key: "at",
  default: 0,
});
export const oaIndexState = atom<number>({
  key: "oa",
  default: 0,
});
export const poIndexState = atom<number>({
  key: "po",
  default: 0,
});
export const trIndexState = atom<number>({
  key: "tr",
  default: 0,
});
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
