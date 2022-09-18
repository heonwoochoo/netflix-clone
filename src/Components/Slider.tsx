import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITVResult } from "../api";
import {
  atIndexState,
  oaIndexState,
  poIndexState,
  trIndexState,
} from "../atom";
import { makeImagePath } from "../utils";

const Container = styled.div`
  margin: 0 auto;
  margin-bottom: 300px;
  top: -100px;
  position: relative;
`;
const Title = styled.h4`
  font-size: 1.3vw;
  padding: 10px;
`;
const Front = styled.div`
  width: 50px;
  height: 170px;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 43px;
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
const BoxContainer = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: flex-end;
  height: 160px;
  width: 220px;
  background-color: transparent;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
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
interface ISlider {
  info: ITVResult[];
  title: string;
  sliderType: string;
  sliderIndex: number;
}
function Slider({ info, title, sliderType, sliderIndex }: ISlider) {
  const navigate = useNavigate();
  const [isFront, setIsFront] = useState(true);
  const setAtIndex = useSetRecoilState(atIndexState);
  const setOaIndex = useSetRecoilState(oaIndexState);
  const setPoIndex = useSetRecoilState(poIndexState);
  const setTrIndex = useSetRecoilState(trIndexState);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const frontButton = () => {
    setIsFront(true);
    if (leaving) return;
    toggleLeaving();
    if (sliderType === "airingToday") {
      setAtIndex((prev) => (prev !== 2 ? prev + 1 : 0));
    } else if (sliderType === "onTheAir") {
      setOaIndex((prev) => (prev !== 2 ? prev + 1 : 0));
    } else if (sliderType === "popular") {
      setPoIndex((prev) => (prev !== 2 ? prev + 1 : 0));
    } else if (sliderType === "topRated") {
      setTrIndex((prev) => (prev !== 2 ? prev + 1 : 0));
    }
  };
  const backButton = () => {
    setIsFront(false);
    if (leaving) return;
    toggleLeaving();
    if (sliderType === "airingToday") {
      setAtIndex((prev) => (prev === 0 ? 2 : prev - 1));
    } else if (sliderType === "onTheAir") {
      setOaIndex((prev) => (prev === 0 ? 2 : prev - 1));
    } else if (sliderType === "popular") {
      setPoIndex((prev) => (prev === 0 ? 2 : prev - 1));
    } else if (sliderType === "topRated") {
      setTrIndex((prev) => (prev === 0 ? 2 : prev - 1));
    }
  };
  const onBoxClicked = (tvId: number, type: string) => {
    navigate(`${tvId}${type}`);
  };
  return (
    <Container>
      <Front onClick={frontButton} id={sliderType}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
          <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
        </svg>
      </Front>
      <Back
        onMouseEnter={() => setIsFront(false)}
        onClick={backButton}
        id={sliderType}
      >
        <svg viewBox="0 0 256 512">
          <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
        </svg>
      </Back>
      <Title>{title}</Title>
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
          {info.map((tv: any) => (
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
                <Info variants={infoVariants} whileHover="hover">
                  <h4>{tv.name}</h4>
                </Info>
              </Box>
            </BoxContainer>
          ))}
        </Row>
      </AnimatePresence>
    </Container>
  );
}

export default Slider;
