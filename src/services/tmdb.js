const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_API_BASE;

export async function fetchMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

export async function fetchSeries() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

export async function fetchMovieDetail(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

export async function fetchSeriesDetail(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

export async function fetchMovieVideos(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

export async function fetchSeriesVideos(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}
