import { PropsWithChildren } from "react";
import { cn } from "../lib/cn";
import { Color } from "../lib/color";

interface CellProps {
  color: Color;
  isOver: boolean;
  current: Color;
  onClick: () => void;
}

export default function Cell(props: PropsWithChildren<CellProps>) {
  const isValid =
    !props.isOver &&
    (props.color === Color.None || props.color === props.current);
  return (
    <button
      onClick={props.onClick}
      className={cn(
        "m-[5%] flex aspect-square items-center justify-center rounded-[16%] bg-neutral-50/80 shadow-md transition-[filter,background]",
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
