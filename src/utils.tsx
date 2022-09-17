import { BsStarFill } from "react-icons/bs";
import { BsStarHalf } from "react-icons/bs";
import { BsStar } from "react-icons/bs";
export function makeImagePath(id: string | undefined, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function shortText(str: string, num: number) {
  if (str.length >= num) {
    return str.slice(0, num) + "...";
  } else return str;
}
export function makeStar(num: number | undefined) {
  if (num === undefined) return <>없음</>;
  if (num > 0 && num <= 1) {
    return (
      <>
        <BsStarHalf />
        <BsStar />
        <BsStar />
        <BsStar />
        <BsStar />
      </>
    );
  } else if (num > 1 && num <= 2) {
    return (
      <>
        <BsStarFill />
        <BsStar />
        <BsStar />
        <BsStar />
        <BsStar />
      </>
    );
  } else if (num > 2 && num <= 3) {
    return (
      <>
        <BsStarFill />
        <BsStarHalf />
        <BsStar />
        <BsStar />
        <BsStar />
      </>
    );
  } else if (num > 3 && num <= 4) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStar />
        <BsStar />
        <BsStar />
      </>
    );
  } else if (num > 5 && num <= 6) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStarHalf />
        <BsStar />
        <BsStar />
      </>
    );
  } else if (num > 6 && num <= 7) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStar />
        <BsStar />
      </>
    );
  } else if (num > 7 && num <= 8) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarHalf />
        <BsStar />
      </>
    );
  } else if (num > 8 && num <= 9) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStar />
      </>
    );
  } else if (num > 9 && num <= 9.5) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarHalf />
      </>
    );
  } else if (num > 9 && num <= 10) {
    return (
      <>
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
      </>
    );
  } else {
    return <>없음</>;
  }
}
