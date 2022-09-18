import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { getGenres, getKeyword, getSearchResult } from "../api";
import { currentPage } from "../atom";
import { makeImagePath, makeStar, shortText } from "../utils";

interface IKnownFor {
  backdrop_path: string;
  media_type: string;
  original_title: string;
  poster_path: string;
  release_date: number;
  title: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
}
interface IDetail {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  overview: string;
  poster_path: string;
  release_date: number;
  title: string;
  vote_average: number;
  popularity: number;
  original_title: string;
  name?: string;
  known_for?: IKnownFor[];
  known_for_departmet: string;
}
interface ISearch {
  results: IDetail[];
  total_pages: number;
  total_results: number;
}
interface IOverview {
  id: number;
  detail: boolean;
}
interface IGenre {
  id: number;
  name: string;
}
const LoadingMsg = styled.h2`
  font-size: 32px;
  position: fixed;
  top: 50vh;
  left: 40vw;
`;
const SearchContainer = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200vh;
  padding: 20px;
  padding-left: 40px;
`;
const SearchTitle = styled.h1`
  font-size: 3vw;
  padding-bottom: 30px;
`;
const SearchKeywords = styled.ul`
  padding-bottom: 30px;
`;
const KeywordTitle = styled.span`
  margin-right: 10px;
`;
const Keyword = styled.span`
  color: grey;
  margin-right: 20px;
  :hover {
    color: ${(props) => props.theme.white.darker};
    text-decoration: underline;
    cursor: pointer;
  }
`;

const SearchTotal = styled.h4`
  margin-bottom: 20px;
`;
const SearchList = styled.div``;
const Box = styled.div`
  display: flex;
  margin-bottom: 50px;
`;
const BoxImage = styled.div<{ bgImage: string }>`
  width: 200px;
  height: 200px;
  padding-right: 200px;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
`;
const BoxInfo = styled.div`
  padding-left: 20px;
`;
const BoxTitleName = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
`;
const BoxTitleType = styled.h3`
  margin-bottom: 5px;
`;
const BoxGenre = styled.ul`
  display: inline-flex;
  gap: 10px;
`;
const Genre = styled.li`
  background-color: #7f8c8d;
  padding: 2px;
  font-size: 13px;
  border-radius: 4px;
`;
const Release = styled.h3`
  margin-bottom: 5px;
`;
const VoteAver = styled.h3`
  margin-bottom: 5px;
`;
const Overview = styled.p`
  width: 50%;
  line-height: 1.3;
`;

const OverviewMore = styled.span`
  color: grey;
  :hover {
    color: purple;
    cursor: pointer;
  }
`;
const SearchPageBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 10px;
  padding-bottom: 20px;
`;
const PrevPage = styled.button`
  background: none;
  color: ${(props) => props.theme.white.darker};
  :hover {
    color: ${(props) => props.theme.white.lighter};
    cursor: pointer;
  }
`;
const CurPage = styled.h4`
  color: ${(props) => props.theme.white.darker};
  :hover {
    color: ${(props) => props.theme.white.lighter};
    cursor: pointer;
  }
`;
const NextPage = styled(PrevPage)``;
function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keyword");
  const [page, setPage] = useRecoilState(currentPage);
  const [showOverview, setShowOverview] = useState<IOverview[]>([]);
  const searchResult = useQuery<ISearch>([search, page], getSearchResult);
  const genresMovie = useQuery<{ genres: IGenre[] }>(["movie"], getGenres);
  const genresTV = useQuery<{ genres: IGenre[] }>(["tv"], getGenres);
  const keyword = useQuery<{
    results: { name: string }[] | [];
  }>([search], getKeyword);
  const findGenre = (type: string, id: number): string | undefined => {
    if (type === "movie" && genresMovie.data) {
      return genresMovie.data.genres.find((v) => v.id === id)?.name;
    } else if (type === "tv" && genresTV.data) {
      return genresTV.data.genres.find((v) => v.id === id)?.name;
    } else return "";
  };
  return (
    <>
      {searchResult.isLoading ? (
        <LoadingMsg>검색결과 기다리는 중...</LoadingMsg>
      ) : (
        <SearchContainer>
          <SearchTitle>"{search}"로 검색한 결과</SearchTitle>
          <SearchKeywords>
            <KeywordTitle>연관 검색어</KeywordTitle>
            {keyword.data?.results.map((v, i) =>
              v.name !== search && i < 12 ? (
                <Keyword
                  key={i}
                  onClick={() => {
                    navigate(
                      `${process.env.PUBLIC_URL}/search/?keyword=${v.name}`
                    );
                  }}
                >
                  {v.name ? v.name : "없음"}
                </Keyword>
              ) : null
            )}
          </SearchKeywords>
          <SearchTotal>
            검색결과 약 {searchResult.data?.total_results}개 ({page}/
            {searchResult.data?.total_pages}페이지)
          </SearchTotal>
          <SearchList>
            {searchResult.data?.results.map((data, i) => (
              <Box key={i}>
                <BoxImage
                  bgImage={makeImagePath(
                    data.poster_path ||
                      data.backdrop_path ||
                      data.known_for?.find((v) => v.backdrop_path !== undefined)
                        ?.backdrop_path ||
                      data.known_for?.find((v) => v.poster_path !== undefined)
                        ?.poster_path
                  )}
                ></BoxImage>
                <BoxInfo>
                  <BoxTitleName>
                    {data.title ||
                      data.known_for?.find((v) => v.title !== undefined)
                        ?.title ||
                      data.name}
                    {data.original_title && data.original_title !== data.title
                      ? "(" + data.original_title + ")"
                      : null}
                  </BoxTitleName>
                  <BoxTitleType>
                    {data.media_type === "movie" ? "🎬" : "📺"}장르:{" "}
                    <BoxGenre>
                      {data.genre_ids
                        ? data.genre_ids.map((genreId, index) => (
                            <Genre key={index}>
                              {findGenre(data.media_type, genreId)}
                            </Genre>
                          ))
                        : data.known_for
                            ?.find((v) => v.genre_ids)
                            ?.genre_ids.map((genreId, index) => (
                              <Genre key={index}>
                                {findGenre(data.media_type, genreId)}
                              </Genre>
                            ))}
                    </BoxGenre>
                  </BoxTitleType>
                  <Release>
                    개봉일:{" "}
                    {data.release_date ||
                      data.known_for?.find((v) => v.release_date !== undefined)
                        ?.release_date}
                  </Release>
                  <VoteAver>
                    평점:{" "}
                    {data.vote_average
                      ? makeStar(Number(data.vote_average.toFixed(1)))
                      : "없음"}
                  </VoteAver>
                  <Overview>
                    {(data.overview &&
                      !showOverview.find((info) => info.id === data.id)
                        ?.detail &&
                      shortText(data.overview, 200)) ||
                      data.overview}
                    <OverviewMore
                      onClick={(e) => {
                        setShowOverview((arr) => {
                          return [...arr, { id: data.id, detail: true }];
                        });
                        e.currentTarget.hidden = true;
                      }}
                    >
                      {data.overview &&
                        shortText(data.overview, 200).length > 200 &&
                        "  더보기"}
                    </OverviewMore>
                  </Overview>
                </BoxInfo>
              </Box>
            ))}
          </SearchList>
          {searchResult.data!.total_pages >= 2 ? (
            <SearchPageBox>
              {page > 1 && (
                <PrevPage
                  onClick={() => {
                    page > 1 && setPage((prev) => prev - 1);
                  }}
                >
                  이전 페이지
                </PrevPage>
              )}
              {Array.from(
                { length: searchResult.data!.total_pages },
                (v, i) => i + 1
              ).map(
                (v: number, i) =>
                  v <= 10 && (
                    <CurPage
                      key={i}
                      style={{ fontSize: v === page ? "18px" : "14px" }}
                      onClick={() => {
                        setPage(v);
                      }}
                    >
                      {v}
                    </CurPage>
                  )
              )}
              {page !== searchResult.data?.total_pages ? (
                <NextPage
                  onClick={() => {
                    page < searchResult.data!.total_pages &&
                      setPage((prev) => prev + 1);
                  }}
                >
                  다음 페이지
                </NextPage>
              ) : null}
            </SearchPageBox>
          ) : null}
        </SearchContainer>
      )}
    </>
  );
}

export default Search;
