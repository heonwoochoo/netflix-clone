import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { getTVData, ITVData } from "../api";
import { bigTvId } from "../atom";
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
const Back = styled(Front)`
  right: auto;
  left: 0;
`;

const Slider = styled.div`
  margin: 0 auto;
  margin-bottom: 300px;
  top: -100px;
  position: relative;
`;

const SliderTitle = styled.h4`
  font-size: 1.3vw;
  padding: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const BoxContainer = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: flex-end;
  height: 160px;
  width: 220px;
  background-color: transparent;
`;

const Rank = styled.h1`
  font-size: 200px;
  font-weight: 900;
  letter-spacing: -30px;
  position: absolute;
  -webkit-text-stroke: 5px grey;
  color: black;
  left: -20px;
  top: -50px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-position: center, center;
  background-size: cover;
  height: 160px;
  width: 110px;
  font-size: 66px;
  z-index: 10;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
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

const rowVariants = {
  hidden: (isFront: boolean) => ({
    x: isFront ? window.outerWidth : -window.outerWidth,
  }),
  visible: {
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: (isFront: boolean) => ({
    x: isFront ? -window.outerWidth : window.outerWidth,
    transition: {
      duration: 0.5,
    },
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.5,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.5,
    },
  },
};
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
  const bigTvMatch = useMatch("/tv/:id");
  const airingToday = useQuery<ITVData>(["airing_today"], getTVData);
  const onTheAir = useQuery<ITVData>(["on_the_air"], getTVData);
  const popular = useQuery<ITVData>(["popular"], getTVData);
  const topRated = useQuery<ITVData>(["top_rated"], getTVData);
  const detail = useQuery<ITVDetail>([bigTvId_], getTVData);
  const [isFront, setIsFront] = useState(true);
  const [atIndex, setAtIndex] = useState(0);
  const [oaIndex, setOaIndex] = useState(0);
  const [poIndex, setPoIndex] = useState(0);
  const [trIndex, setTrIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isShowOverview, setIsShowOverview] = useState(false);
  const frontButton = (e: React.MouseEvent<HTMLElement>) => {
    const condition = e.currentTarget.id;
    setIsFront(true);
    if (airingToday.data) {
      if (leaving) return;
      toggleLeaving();
      if (condition === "airingToday") {
        setAtIndex((prev) => (prev !== 2 ? prev + 1 : 0));
      } else if (condition === "onTheAir") {
        setOaIndex((prev) => (prev !== 2 ? prev + 1 : 0));
      } else if (condition === "popular") {
        setPoIndex((prev) => (prev !== 2 ? prev + 1 : 0));
      } else if (condition === "topRated") {
        setTrIndex((prev) => (prev !== 2 ? prev + 1 : 0));
      }
    }
  };
  const backButton = (e: React.MouseEvent<HTMLElement>) => {
    const condition = e.currentTarget.id;
    setIsFront(false);
    if (airingToday.data) {
      if (leaving) return;
      toggleLeaving();
      if (condition === "airingToday") {
        setAtIndex((prev) => (prev === 0 ? 2 : prev - 1));
      } else if (condition === "onTheAir") {
        setOaIndex((prev) => (prev === 0 ? 2 : prev - 1));
      } else if (condition === "popular") {
        setPoIndex((prev) => (prev === 0 ? 2 : prev - 1));
      } else if (condition === "topRated") {
        setTrIndex((prev) => (prev === 0 ? 2 : prev - 1));
      }
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (tvId: number, type: string) => {
    navigate(`${tvId}${type}`);
  };
  const onOverlayClick = () => {
    setIsShowOverview(false);
    navigate(`/tv`);
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
  function paintSlider(
    slider: UseQueryResult<ITVData>,
    Title: string,
    sliderType: string,
    sliderIndex: number
  ) {
    return (
      <Slider>
        <Front
          style={{ height: "170px", top: "43px" }}
          onClick={frontButton}
          id={sliderType}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
            <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
          </svg>
        </Front>
        <Back
          style={{ height: "170px", top: "43px" }}
          onMouseEnter={() => setIsFront(false)}
          onClick={backButton}
          id={sliderType}
        >
          <svg viewBox="0 0 256 512">
            <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
          </svg>
        </Back>
        <SliderTitle>{Title}</SliderTitle>
        <AnimatePresence
          custom={isFront}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row
            custom={isFront}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween" }}
            key={sliderIndex}
          >
            {slider
              .data!.results.slice(
                offset * sliderIndex,
                offset * sliderIndex + offset
              )
              .map((tv) => (
                <BoxContainer
                  style={{ width: "220px", height: "130px" }}
                  key={String(tv.id) + sliderType}
                >
                  <Box
                    layoutId={String(tv.id) + sliderType}
                    onClick={() => {
                      onBoxClicked(tv.id, sliderType);
                    }}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(tv.poster_path, "w400")}
                    style={{ width: "100%" }}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                </BoxContainer>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
    );
  }
  return (
    <Wrapper>
      {airingToday.isLoading ||
      onTheAir.isLoading ||
      popular.isLoading ||
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
          <Slider>
            <Front
              style={{ height: "170px", top: "43px" }}
              onClick={frontButton}
              id="airingToday"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </svg>
            </Front>
            <Back
              style={{ height: "170px", top: "43px" }}
              onClick={backButton}
              id="airingToday"
              onMouseEnter={() => setIsFront(false)}
            >
              <svg viewBox="0 0 256 512">
                <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
              </svg>
            </Back>
            <SliderTitle>오늘의 TV 프로그램</SliderTitle>
            <AnimatePresence
              custom={isFront}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={isFront}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={atIndex}
              >
                {airingToday.data?.results
                  .slice(1)
                  .slice(offset * atIndex, offset * atIndex + offset)
                  .map((tv, i) => (
                    <BoxContainer key={`${tv.id}airingToday`}>
                      <Rank>{atIndex * offset + i + 1}</Rank>
                      <Box
                        layoutId={String(tv.id) + "airingToday"}
                        onClick={() => {
                          onBoxClicked(tv.id, "airingToday");
                        }}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    </BoxContainer>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {paintSlider(onTheAir, "On Air", "onTheAir", oaIndex)}
          {paintSlider(popular, "인기 프로그램", "popular", poIndex)}
          {paintSlider(topRated, "가장 많이 본 프로그램", "topRated", trIndex)}
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
