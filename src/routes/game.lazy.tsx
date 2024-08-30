import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { cn } from "../lib/cn";
import { Color } from "../lib/color";
import Piece from "../components/piece";
import Cell from "../components/cell";

export const Route = createLazyFileRoute("/game")({
  component: GamePage,
});

type Cell = {
  value: number;
  color: Color;
};

enum Status {
  Init = "init",
  Idle = "idle",
  Pending = "pending",
  Over = "over",
}

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

function GamePage() {
  const [iter, setIter] = useState(-1);
  const [board, setBoard] = useState<Cell[]>(initBoard(5, 5));
  const [status, setStatus] = useState<Status>(Status.Init);

  const red = board.filter((cell) => cell.color === Color.Red).length;
  const blue = board.filter((cell) => cell.color === Color.Blue).length;
  const isOver = iter >= 2 && (blue === 0 || red === 0);
  const current = iter === -1 ? Color.None : iter % 2;

  function handleClick({ value, color }: Cell, index: number) {
    if (iter === -1) return false;
    // can place on empty cell or same color
    if (color !== Color.None && color !== current) return false;
    setStatus(Status.Pending);
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
    setStatus(Status.Init);
  }

  useEffect(() => {
    if (iter === -1) return;
    if (isOver) setStatus(Status.Over);
    if (board.every((cell, index) => cell.value < critical(5, 5, index))) {
      if (!isOver) {
        setStatus(Status.Idle);
        setIter((prev) => prev + 1);
      }
      return;
    }
    setTimeout(() => {
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
    if (status === Status.Init) setIter(0);
  }, [status]);

  // useEffect(() => {
  //   if (current !== Color.Red || isPending) return;
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
  // }, [current, isPending]);

  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center text-4xl transition-colors duration-300",
        current === Color.None && "bg-neutral-300",
        current === Color.Blue && "bg-sky-300",
        current === Color.Red && "bg-red-300"
      )}
    >
      <span className="mx-4 text-pretty py-2 text-center text-2xl">
        Chain Reaction - Normal Mode
      </span>
      <div
        className={cn(
          "grid w-[560px] max-w-full grid-cols-5 grid-rows-5 p-2",
          (status === "pending" || iter === -1) && "pointer-events-none"
        )}
      >
        {board.map((piece, index) => (
          <Cell
            key={index}
            color={piece.color}
            isOver={status === Status.Over}
            current={current}
            onClick={() => handleClick(piece, index)}
          >
            <Piece value={piece.value} color={piece.color} />
          </Cell>
        ))}
      </div>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-4 transition-colors duration-500",
          status === Status.Over
            ? "bg-black/80 opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {current === Color.Blue && <p className="text-sky-500">Blue Wins!</p>}
        {current === Color.Red && <p className="text-red-500">Red Wins!</p>}
        <button
          onClick={handleRestart}
          className="rounded-xl bg-white px-4 py-2 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
        >
          Restart
        </button>
      </div>
      {/* add up all value */}
      <span className="mx-4 py-2 text-2xl">
        {board.reduce((acc, cur) => acc + cur.value, 0)}
      </span>
    </div>
  );
}
