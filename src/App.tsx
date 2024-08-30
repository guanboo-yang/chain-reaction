import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Piece from "./piece";
import { Color } from "./color";
import { cn } from "./cn";

type Cell = {
  value: number;
  color: Color;
};

function initBoard(width: number, height: number) {
  return Array.from({ length: width * height }, () => ({
    value: 0,
    color: Color.None,
  }));
}

function critical(width: number, height: number, index: number) {
  return [
    index > width - 1,
    index % width !== 0,
    index < width * (height - 1),
    index % width !== width - 1,
  ].filter(Boolean).length;
}

export default function App() {
  const intervalRef = useRef<number | null>(null);
  const [iter, setIter] = useState(-1);
  const [pending, setPending] = useState(false);
  const [board, setBoard] = useState<Cell[]>(initBoard(5, 5));
  const [isOver, setIsOver] = useState(false);

  const red = board.filter((cell) => cell.color === Color.Red).length;
  const blue = board.filter((cell) => cell.color === Color.Blue).length;

  const current = iter === -1 ? Color.None : iter % 2;

  function handleClick({ value, color }: Cell, index: number) {
    if (iter === -1) return false;
    // can place on empty cell or same color
    if (color !== Color.None && color !== current) return false;
    setPending(true);
    setBoard((prev) => {
      const next = [...prev];
      next[index].value = value + 1;
      next[index].color = current;
      return next;
    });
    return true;
  }

  function handleRestart() {
    setIter(-1);
    setBoard(initBoard(5, 5));
    setIsOver(false);
    setPending(false);
  }

  useEffect(() => {
    if (iter === -1) return;
    if (iter >= 2 && (blue === 0 || red === 0)) setIsOver(true);
    if (board.every((cell, index) => cell.value < critical(5, 5, index))) {
      setPending(false);
      if (!isOver) setIter((prev) => prev + 1);
      return;
    }
    intervalRef.current = setTimeout(() => {
      setBoard((prev) => {
        const indices = prev
          .map((cell, i) => (cell.value < critical(5, 5, i) ? -1 : i))
          .filter((index) => index !== -1);
        const add = Array.from({ length: 25 }, () => 0);
        for (const index of indices) {
          if (index > 4) add[index - 5]++;
          if (index % 5 !== 0) add[index - 1]++;
          if (index < 20) add[index + 5]++;
          if (index % 5 !== 4) add[index + 1]++;
        }
        return prev.map((cell, index) => {
          if (indices.includes(index)) {
            if (cell.value === critical(5, 5, index)) {
              return { value: 0, color: Color.None };
            }
            return {
              value: cell.value - critical(5, 5, index),
              color: cell.color,
            };
          }
          if (add[index]) {
            return {
              value: cell.value + add[index],
              color: current,
            };
          }
          return cell;
        });
      });
    }, 500);
  }, [JSON.stringify(board)]);

  useEffect(() => {
    if (isOver) return;
    setTimeout(() => setIter(0), 500);
  }, [isOver]);

  // useEffect(() => {
  //   if (current !== Color.Red || pending) return;
  //   fetch("http://localhost:8080/api", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(board),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const index = data.index;
  //       handleClick(board[index], index);
  //     });
  // }, [current, pending]);

  return (
    <div
      className={cn(
        "relative text-4xl w-full flex flex-col items-center duration-300 transition-colors justify-center h-screen",
        current === Color.None && "bg-neutral-300",
        current === Color.Blue && "bg-sky-300",
        current === Color.Red && "bg-red-300"
      )}
    >
      <div className="relative z-10 flex items-center justify-center gap-2 my-4 px-4 py-2 rounded-xl bg-white">
        <span className="text-2xl text-sky-500">{blue}</span>
        <span className="text-2xl text-black">·</span>
        <span className="text-2xl text-red-500">{red}</span>
      </div>
      <div
        className={cn(
          "grid grid-cols-5 grid-rows-5 gap-2",
          (pending || iter === -1) && "pointer-events-none"
        )}
      >
        {board.map((piece, index) => (
          <Cell
            key={index}
            color={piece.color}
            isOver={isOver}
            current={current}
            onClick={() => handleClick(piece, index)}
          >
            <Piece value={piece.value} color={piece.color} />
            {/* <Piece value={6} color={Color.Red} /> */}
          </Cell>
        ))}
      </div>
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500 flex flex-col gap-4 items-center justify-center",
          isOver ? "opacity-100 bg-black/80" : "opacity-0 pointer-events-none"
        )}
      >
        {current === Color.Blue && <p className="text-sky-500">Blue Wins!</p>}
        {current === Color.Red && <p className="text-red-500">Red Wins!</p>}
        <button
          onClick={handleRestart}
          className="bg-white py-2 px-4 rounded-xl hover:bg-neutral-200"
        >
          Restart
        </button>
      </div>
      {/* add up all value */}
      <span className="text-2xl py-6">
        {board.reduce((acc, cur) => acc + cur.value, 0)}
        {/* {iter === -1 ? 0 : iter} */}
      </span>
    </div>
  );
}

interface CellProps {
  color: Color;
  isOver: boolean;
  current: Color;
  onClick: () => void;
}

function Cell(props: PropsWithChildren<CellProps>) {
  const isValid =
    !props.isOver &&
    (props.color === Color.None || props.color === props.current);
  return (
    <button
      onClick={props.onClick}
      className={cn(
        "bg-neutral-50/80 transition-[filter,background] rounded-xl size-24 flex shadow-md items-center justify-center",
        props.current === Color.Red && "bg-red-200",
        props.current === Color.Blue && "bg-sky-200",
        props.color === Color.Red && "bg-red-200",
        props.color === Color.Blue && "bg-sky-200",
        isValid ? "hover:brightness-105" : "brightness-90"
      )}
    >
      {props.children}
    </button>
  );
}
