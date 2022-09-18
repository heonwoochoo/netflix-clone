import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  getMovieDetail,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import { bigMovieId } from "../atom";
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
  height: 400px;
  background-position: center center;
  background-size: cover;
`;

const BigTitleBox = styled.div`
  position: relative;
  top: -100px;
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
const ReleaseAndContry = styled.span`
  font-size: 14px;
  color: grey;
`;
const DetailInfo = styled.div`
  position: absolute;
  top: 400px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 5px;
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

const Runtime = styled.h4``;

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
interface IGenre {
  name: string;
}
interface IMovieDetail {
  genres: IGenre[];
  popularity: number;
  release_date: string;
  runtime: number;
  vote_average: number;
  release_data: string;
  original_title: string;
  production_countries: { name: string }[];
}
const offset = 6;

function Home() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [bigMovieId_, setBigMovieId] = useRecoilState(bigMovieId);
  const bigMovieMatch = useMatch(`${process.env.PUBLIC_URL}/movie/:id`);
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const popular = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const upcoming = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );
  const detail = useQuery<IMovieDetail>(
    [bigMovieId_, "detail"],
    getMovieDetail
  );
  const [isFront, setIsFront] = useState(true);
  const [trIndex, setTrIndex] = useState(0);
  const [poIndex, setPoIndex] = useState(0);
  const [upIndex, setUpIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isShowOverview, setIsShowOverview] = useState(false);
  const frontButton = (e: React.MouseEvent<HTMLElement>) => {
    const condition = e.currentTarget.id;
    setIsFront(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      if (condition === "topRated") {
        setTrIndex((prev) => (prev === 0 ? 1 : 0));
      } else if (condition === "popular") {
        setPoIndex((prev) => (prev !== 2 ? prev + 1 : 0));
      } else if (condition === "upcoming") {
        setUpIndex((prev) => (prev !== 2 ? prev + 1 : 0));
      }
    }
  };
  const backButton = (e: React.MouseEvent<HTMLElement>) => {
    const condition = e.currentTarget.id;
    setIsFront(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      if (condition === "topRated") {
        setTrIndex((prev) => (prev === 1 ? 0 : 1));
      } else if (condition === "popular") {
        setPoIndex((prev) => (prev !== 0 ? prev - 1 : 2));
      } else if (condition === "upcoming") {
        setUpIndex((prev) => (prev === 0 ? 2 : prev - 1));
      }
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (movieId: number, type: string) => {
    navigate(`${process.env.PUBLIC_URL}/movie/${movieId}${type}`);
  };
  const onOverlayClick = () => {
    setIsShowOverview(false);
    navigate(`${process.env.PUBLIC_URL}/`);
  };
  const clickedMovie =
    bigMovieMatch?.params.id &&
    (data?.results.find(
      (movie) => movie.id + "topRated" === bigMovieMatch.params.id
    ) ||
      popular.data?.results.find(
        (movie) => movie.id + "popular" === bigMovieMatch.params.id
      ) ||
      upcoming.data?.results.find(
        (movie) => movie.id + "upcoming" === bigMovieMatch.params.id
      ));
  if (bigMovieMatch) {
    const id = bigMovieMatch.params.id?.replace(/[^0-9]/g, "") as string;
    setBigMovieId(id);
  }
  useEffect(() => {}, [window.innerWidth]);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <Front
              style={{ height: "170px", top: "43px" }}
              onClick={frontButton}
              id="topRated"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </svg>
            </Front>
            <Back
              style={{ height: "170px", top: "43px" }}
              onClick={backButton}
              id="topRated"
              onMouseEnter={() => setIsFront(false)}
            >
              <svg viewBox="0 0 256 512">
                <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
              </svg>
            </Back>
            <SliderTitle>평점 높은 영화</SliderTitle>
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
                key={trIndex}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * trIndex, offset * trIndex + offset)
                  .map((movie, i) => (
                    <BoxContainer key={`${movie.id}topRated`}>
                      <Rank>{trIndex * offset + i + 1}</Rank>
                      <Box
                        layoutId={movie.id + "topRated"}
                        onClick={() => {
                          onBoxClicked(movie.id, "topRated");
                        }}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    </BoxContainer>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <Front
              style={{ height: "170px", top: "43px" }}
              onClick={frontButton}
              id="popular"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </svg>
            </Front>
            <Back
              style={{ height: "170px", top: "43px" }}
              onMouseEnter={() => setIsFront(false)}
              onClick={backButton}
              id="popular"
            >
              <svg viewBox="0 0 256 512">
                <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
              </svg>
            </Back>
            <SliderTitle>인기 많은 영화</SliderTitle>
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
                key={poIndex}
              >
                {popular.data?.results
                  .slice(offset * poIndex, offset * poIndex + offset)
                  .map((movie) => (
                    <BoxContainer
                      style={{ width: "220px", height: "130px" }}
                      key={`${movie.id}popular`}
                    >
                      <Box
                        layoutId={movie.id + "popular"}
                        onClick={() => {
                          onBoxClicked(movie.id, "popular");
                        }}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.poster_path, "w400")}
                        style={{ width: "100%" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    </BoxContainer>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <Front
              style={{ height: "170px", top: "43px" }}
              onClick={frontButton}
              id="upcoming"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </svg>
            </Front>
            <Back
              style={{ height: "170px", top: "43px" }}
              onClick={backButton}
              onMouseEnter={() => setIsFront(false)}
              id="upcoming"
            >
              <svg viewBox="0 0 256 512">
                <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
              </svg>
            </Back>
            <SliderTitle>개봉 예정인 영화</SliderTitle>
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
                key={upIndex}
              >
                {upcoming.data?.results
                  .slice(offset * upIndex, offset * upIndex + offset)
                  .map((movie) => (
                    <BoxContainer
                      style={{ width: "220px", height: "130px" }}
                      key={`${movie.id}upcoming`}
                    >
                      <Box
                        layoutId={movie.id + "upcoming"}
                        onClick={() => {
                          onBoxClicked(movie.id, "upcoming");
                        }}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.poster_path, "w400")}
                        style={{ width: "100%" }}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    </BoxContainer>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
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
                  layoutId={bigMovieMatch.params.id}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent) ,url(${makeImagePath(
                            clickedMovie.backdrop_path ||
                              clickedMovie.poster_path,
                            "w500"
                          )})`,
                        }}
                      />

                      <BigTitleBox>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        {clickedMovie.title !== detail.data?.original_title ? (
                          <BigOriginalTitle>
                            {detail.data?.original_title}
                          </BigOriginalTitle>
                        ) : null}
                        <ReleaseAndContry>
                          ({detail.data?.release_date}
                          {", "}
                          {detail.data?.production_countries[0].name})
                        </ReleaseAndContry>
                      </BigTitleBox>
                      <DetailInfo>
                        <BigGenres>
                          {detail.data?.genres.map((genre, index) => (
                            <Genre key={index}>{genre.name}</Genre>
                          ))}
                        </BigGenres>
                        <Runtime>재생 시간: {detail.data?.runtime} 분</Runtime>
                        <VoteAverage>
                          평점:{" "}
                          {makeStar(
                            Number(detail.data?.vote_average.toFixed(1))
                          ) || "없음"}
                        </VoteAverage>
                        <BigOverview>
                          {isShowOverview
                            ? clickedMovie.overview
                            : shortText(clickedMovie.overview, 160)}
                          {shortText(clickedMovie.overview, 160).slice(-3) ===
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

export default Home;
