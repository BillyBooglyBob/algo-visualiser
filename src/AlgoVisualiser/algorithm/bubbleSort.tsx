import type React from "react";
import type { DataBar } from "../AlgoVisualiser";
import { sleep } from "../util";

interface BubbleSortProps {
  data: DataBar[];
  speedRef: React.RefObject<number>;
  sortingRef: React.RefObject<{ stop: boolean }>;
  pausedRef: React.RefObject<boolean>;
  setData: React.Dispatch<React.SetStateAction<DataBar[]>>;
  setSteps: React.Dispatch<React.SetStateAction<DataBar[][]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const useBubbleSort = ({
  data,
  speedRef,
  sortingRef,
  pausedRef,
  setData,
  setSteps,
  setCurrentStep,
}: BubbleSortProps) => {
  // Deep clone (create separate copy so as to not directly modify data without
  // using useState)
  // - Can make bugs harder to debug (since React doesn't re-render when state
  //  modified without useState, so the state is updated silently)
  // - React can skip render, since it only re-renders when triggered through useState
  const arr = [...data].map((bar) => ({ ...bar }));

  const bubbleSortAlgorithm = async (
    arr: DataBar[],
    changeArr: (newArr: DataBar[]) => void
  ) => {
    // Bubbles one big value at a time from the front
    // to the end
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (arr[j].value > arr[j + 1].value) {
          // Stop sort on flag
          if (sortingRef.current.stop) {
            return;
          }

          // Pause on flag
          while (pausedRef.current) {
            await sleep(50);
          }

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          // Colour swapped bars
          const newArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
          newArr[j].coloured = true;
          newArr[j + 1].coloured = true;
          changeArr(newArr);

          setSteps((prev) => [...prev, newArr]);
          setCurrentStep((prev) => prev + 1);

          // Delay (for speed)
          await sleep(100 / speedRef.current);
        }
      }
    }

    const finalArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
    changeArr(finalArr);
    sortingRef.current.stop = true;
  };

  const handleSort = () => {
    bubbleSortAlgorithm(arr, (newData: DataBar[]) => setData(newData));
  };

  return handleSort;
};

export default useBubbleSort;
