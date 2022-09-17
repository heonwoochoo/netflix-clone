const API_KEY = "066630962b2eb36591e832ca65639be2";
const BASE_PATH = "https://api.themoviedb.org/3";
interface ITopRatedMovie {
  backdrop_path: string;
  overview: string;
  poster_path: string;
  title: string;
  id: number;
  vote_average: number;
}
interface ITVResult {
  backdrop_path: string;
  overview: string;
  poster_path: string;
  id: number;
  vote_average: number;
  first_air_date: string;
  origin_country: string[];
  original_language: string;
  name: string;
  original_name: string;
}
export interface ITVData {
  results: ITVResult[];
}
export interface IGetMoviesResult {
  results: ITopRatedMovie[];
}

export function getTopRatedMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
export function getUpcomingMovies() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getMovieDetail({ queryKey }: any) {
  const movieId = queryKey[0];
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getSearchResult({ queryKey }: any) {
  const [query, page] = queryKey;
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${query}&page=${page}&include_adult=false`
  ).then((response) => response.json());
}

export function getGenres({ queryKey }: any) {
  const [type] = queryKey;
  return fetch(
    `${BASE_PATH}/genre/${type}/list?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getKeyword({ queryKey }: any) {
  const [query] = queryKey;
  return fetch(
    `${BASE_PATH}/search/keyword?api_key=${API_KEY}&query=${query}&page=1`
  ).then((response) => response.json());
}

export function getTVData({ queryKey }: any) {
  const [type] = queryKey;
  return fetch(`
${BASE_PATH}/tv/${type}?api_key=${API_KEY}&language=ko&page=1
  `).then((response) => response.json());
}

export function getTVDetail({ queryKey }: any) {
  const [tvId] = queryKey;
  return fetch(`
${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko
  `).then((response) => response.json());
}
