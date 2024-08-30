import { cn } from "../lib/cn";
import { Color } from "../lib/color";

interface PieceProps {
  value: number;
  color: Color;
}

const rotations: {
  [key: number]: number[];
} = {
  2: [90, 270],
  3: [180, 420, 300],
  4: [270, 540, 450, 360],
  5: [324, 612, 540, 468, 396],
  6: [360, 660, 600, 540, 480, 420],
};

function getRotate(value: number, index: number) {
  const rotation = rotations[value];
  if (!rotation) return 0;
  if (index >= rotation.length) return rotation[0];
  return rotation[index];
}

export default function Piece(props: PieceProps) {
  return (
    <div
      className={cn(
        "relative size-4/5 scale-100 rounded-full transition-[all] duration-500",
        props.color === Color.None && "scale-75 opacity-0",
        props.color === Color.Red && "bg-red-500",
        props.color === Color.Blue && "bg-sky-500"
      )}
    >
      {/* debug */}
      {/* <div className="absolute left-0 -top-2 text-2xl">{props.value}</div> */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="absolute inset-0 h-full w-full transition-[rotate] duration-500"
          style={{ rotate: `${getRotate(props.value, index)}deg` }}
        >
          <div
            className={cn(
              "absolute inset-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[top] duration-500",
              props.value <= 1 && "top-1/2",
              props.value === 2 && "top-[25%]",
              props.value === 3 && "top-[76%]",
              props.value === 4 && "top-[23%]",
              props.value === 5 && "top-[78%]",
              props.value === 6 && "top-[21%]"
            )}
          />
        </div>
      ))}
    </div>
  );
}
