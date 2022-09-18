import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { getTVData, ITVData } from "../api";
import {
  atIndexState,
  bigTvId,
  oaIndexState,
  poIndexState,
  trIndexState,
} from "../atom";
import Slider from "../Components/Slider";
import { makeImagePath, makeStar, shortText } from "../utils";
const Wrapper = styled.div`
  background-color: black;
  height: 230vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 1.2vw;
  width: 50%;
  line-height: 1.3;
`;

const Front = styled.div`
  width: 50px;
  height: 130px;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 70px;
  z-index: 120;
  border-radius: 5px;
  svg {
    width: 80%;
    fill: ${(props) => props.theme.white.darker};
    opacity: 0;
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.5);
    svg {
      opacity: 1;
    }
  }
  right: 0;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 11;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 12;
  overflow-y: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 350px;
  background-position: center center;
  background-size: cover;
`;

const BigTitleBox = styled.div`
  position: relative;
  top: -70px;
  padding-left: 20px;
`;
const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 2.5vw;
`;
const BigOriginalTitle = styled.h4`
  color: ${(props) => props.theme.white.darker};
  font-size: 14px;
`;
const BigGenres = styled.ul`
  display: flex;
`;

const Genre = styled.li`
  margin-right: 10px;
  background-color: #7f8c8d;
  padding: 2px;
  font-size: 13px;
  border-radius: 4px;
`;
const DetailInfo = styled.div`
  position: absolute;
  top: 350px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 5px;
`;
const Runtime = styled.h4``;
const FirstAirDate = styled.h4``;
const Networks = styled.ul`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;
const Streaming = styled.li<{ bgImage: string }>`
  background-image: url(${(props) => props.bgImage});
  background-position: center, center;
  background-size: cover;
  background-size: 80%;
  background-repeat: no-repeat;
  color: transparent;
  padding: 20px;
  position: relative;
  top: 30px;
`;
const EpisodeNum = styled.h4``;
const SeasonNum = styled.span`
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 5px;
  margin-left: 10px;
  background-color: #636e72;
`;
const Production = styled.span``;
const Product = styled.span`
  margin-right: 10px;
`;
const VoteAverage = styled.h4``;

const BigOverview = styled.p`
  font-size: 14px;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

const ShowOverView = styled.h4`
  text-decoration: underline;
  color: grey;
  :hover {
    cursor: pointer;
    color: white;
  }
`;
interface INetwork {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}
interface ISeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  poster_path: null;
  season_number: number;
}
interface ITVDetail {
  backdrop_path: string;
  episode_run_time: number[];
  first_air_date: string;
  genres: { name: string }[];
  id: number;
  last_air_date: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    vote_average: number;
    vote_count: number;
  };
  name: string;
  next_episode_to_air: string | null;
  networks: INetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: [string];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: null;
  production_companies: {
    name: string;
  }[];
  seasons: ISeason[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
}
const offset = 6;
function Tv() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [bigTvId_, setBigTvId] = useRecoilState(bigTvId);
  const bigTvMatch = useMatch(`${process.env.PUBLIC_URL}/tv/:id`);
  const airingToday = useQuery<ITVData>(["airing_today"], getTVData);
  const onTheAir = useQuery<ITVData>(["on_the_air"], getTVData);
  const popular = useQuery<ITVData>(["popular"], getTVData);
  const topRated = useQuery<ITVData>(["top_rated"], getTVData);
  const detail = useQuery<ITVDetail>([bigTvId_], getTVData);
  const atIndex = useRecoilValue(atIndexState);
  const oaIndex = useRecoilValue(oaIndexState);
  const poIndex = useRecoilValue(poIndexState);
  const trIndex = useRecoilValue(trIndexState);
  const [isShowOverview, setIsShowOverview] = useState(false);
  const onOverlayClick = () => {
    setIsShowOverview(false);
    navigate(`${process.env.PUBLIC_URL}/tv`);
  };
  const clickedTv =
    bigTvMatch?.params.id &&
    (airingToday.data?.results.find(
      (tv) => tv.id + "airingToday" === bigTvMatch.params.id
    ) ||
      onTheAir.data?.results.find(
        (tv) => tv.id + "onTheAir" === bigTvMatch.params.id
      ) ||
      popular.data?.results.find(
        (tv) => tv.id + "popular" === bigTvMatch.params.id
      ) ||
      topRated.data?.results.find(
        (tv) => tv.id + "topRated" === bigTvMatch.params.id
      ));
  if (bigTvMatch) {
    const id = bigTvMatch.params.id?.replace(/[^0-9]/g, "") as string;
    setBigTvId(id);
  }
  const atInfo = airingToday.data?.results.slice(
    atIndex * offset,
    atIndex * offset + offset
  );
  const oaInfo = onTheAir.data?.results.slice(
    oaIndex * offset,
    oaIndex * offset + offset
  );
  const poInfo = popular.data?.results.slice(
    poIndex * offset,
    poIndex * offset + offset
  );
  const trInfo = topRated.data?.results.slice(
    trIndex * offset,
    trIndex * offset + offset
  );

  return (
    <Wrapper>
      {airingToday.isLoading &&
      onTheAir.isLoading &&
      popular.isLoading &&
      topRated.isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              airingToday.data?.results[0].backdrop_path || ""
            )}
          >
            <Title>{airingToday.data?.results[0].name}</Title>
            <Overview>{airingToday.data?.results[0].overview}</Overview>
          </Banner>

          {atInfo && (
            <Slider
              info={atInfo}
              title="오늘의 TV 프로그램"
              sliderType="airingToday"
              sliderIndex={atIndex}
              showRank={true}
            />
          )}
          {oaInfo && (
            <Slider
              info={oaInfo}
              title="On Air"
              sliderType="onTheAir"
              sliderIndex={oaIndex}
              showRank={false}
            />
          )}
          {poInfo && (
            <Slider
              info={poInfo}
              title="인기 프로그램"
              sliderType="popular"
              sliderIndex={poIndex}
              showRank={false}
            />
          )}
          {trInfo && (
            <Slider
              info={trInfo}
              title="가장 많이 본 프로그램"
              sliderType="topRated"
              sliderIndex={trIndex}
              showRank={false}
            />
          )}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                    overflowY: isShowOverview ? "scroll" : "hidden",
                  }}
                  layoutId={bigTvMatch.params.id}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent) ,url(${makeImagePath(
                            clickedTv.backdrop_path || clickedTv.poster_path,
                            "w500"
                          )})`,
                        }}
                      />

                      <BigTitleBox>
                        <BigTitle>
                          {clickedTv.name}
                          <SeasonNum>
                            시즌 {detail.data?.number_of_seasons}
                          </SeasonNum>
                        </BigTitle>
                        {clickedTv.name !== detail.data?.original_name ? (
                          <BigOriginalTitle>
                            {detail.data?.original_name}
                          </BigOriginalTitle>
                        ) : null}
                        <Networks>
                          {detail.data?.networks.map((v, i) => (
                            <Streaming
                              key={i}
                              bgImage={makeImagePath(v.logo_path, "w200")}
                            >
                              {v.name}
                            </Streaming>
                          ))}
                        </Networks>
                      </BigTitleBox>
                      <DetailInfo>
                        <BigGenres>
                          {detail.data?.genres.map((v, i) => (
                            <Genre key={i}>{v.name}</Genre>
                          ))}
                        </BigGenres>
                        <Runtime>
                          재생 시간: {detail.data?.episode_run_time[0]} 분
                        </Runtime>
                        <FirstAirDate>
                          방영 시작 일: {detail.data?.first_air_date}
                        </FirstAirDate>
                        <EpisodeNum>
                          전체 에피소드: {detail.data?.number_of_episodes}
                        </EpisodeNum>
                        <Production>
                          제작{" "}
                          {detail.data?.production_companies.map((v, i) => (
                            <Product key={i}>▪{v.name}</Product>
                          ))}
                        </Production>
                        <VoteAverage>
                          평점:{" "}
                          {makeStar(
                            Number(detail.data?.vote_average.toFixed(1))
                          ) || "없음"}
                        </VoteAverage>
                        <BigOverview>
                          {isShowOverview
                            ? clickedTv.overview
                            : shortText(clickedTv.overview, 110)}
                          {shortText(clickedTv.overview, 110).slice(-3) ===
                          "..." ? (
                            <ShowOverView
                              onClick={() => setIsShowOverview(true)}
                            >
                              {isShowOverview ? null : "더보기"}
                            </ShowOverView>
                          ) : null}
                        </BigOverview>
                      </DetailInfo>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
