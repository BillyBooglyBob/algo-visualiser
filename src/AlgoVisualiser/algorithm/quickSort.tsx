import type React from "react";
import type { DataBar } from "../AlgoVisualiser";

interface BubbleSortProps {
  data: DataBar[];
  speedRef: React.RefObject<number>;
  sortingRef: React.RefObject<{ stop: boolean }>;
  setData: React.Dispatch<React.SetStateAction<DataBar[]>>;
}

const bubbleSort = ({
  data,
  speedRef,
  sortingRef,
  setData,
}: BubbleSortProps) => {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSortAlgorithm = async (
    arr: DataBar[],
    changeArr: (newArr: DataBar[]) => void
  ) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (arr[j].value > arr[j + 1].value) {
          if (sortingRef.current.stop) {
            return;
          }

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          // Colour swapped bars
          const newArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
          newArr[j].coloured = true;
          newArr[j + 1].coloured = true;
          changeArr(newArr);

          // Delay (for speed)
          await sleep(100 / speedRef.current);
        }
      }
    }

    const finalArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
    changeArr(finalArr);
  };

  const handleSort = () => {
    bubbleSortAlgorithm(data, (newData: DataBar[]) => setData(newData));
  };

  return handleSort;
};

export default bubbleSort;
