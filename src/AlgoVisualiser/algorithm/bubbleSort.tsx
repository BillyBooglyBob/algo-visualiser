import type React from "react";
import type { DataBar } from "../AlgoVisualiser";
import { sleep } from "../util";

interface useBubbleSortProps {
  data: DataBar[];
  currentStepRef: React.RefObject<number>;
  totalStepsRef: React.RefObject<number>;
  speedRef: React.RefObject<number>;
  sortingRef: React.RefObject<{ stop: boolean }>;
  pausedRef: React.RefObject<boolean>;
  setData: React.Dispatch<React.SetStateAction<DataBar[]>>;
  setSteps: React.Dispatch<React.SetStateAction<DataBar[][]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const useBubbleSort = ({
  data,
  currentStepRef,
  totalStepsRef,
  speedRef,
  sortingRef,
  pausedRef,
  setData,
  setSteps,
  setCurrentStep,
}: useBubbleSortProps) => {
  // Deep clone (create separate copy so as to not directly modify data without
  // using useState)
  // - Can make bugs harder to debug (since React doesn't re-render when state
  //  modified without useState, so the state is updated silently)
  // - React can skip render, since it only re-renders when triggered through useState
  const arr = [...data].map((bar) => ({ ...bar }));

  const bubbleSort = async (
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

          // Bring sort up to latest image before proceeding
          while (currentStepRef.current < totalStepsRef.current - 1) {
            // Pause on flag
            while (pausedRef.current) {
              await sleep(50);
            }

            setCurrentStep(currentStepRef.current + 1);
            currentStepRef.current += 1;

            await sleep(100 / speedRef.current);
          }

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          // Colour swapped bars
          const newArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
          newArr[j].coloured = true;
          newArr[j + 1].coloured = true;
          changeArr(newArr);

          setSteps((prev) => [...prev, newArr]);
          totalStepsRef.current += 1;
          setCurrentStep((prev) => prev + 1);
          currentStepRef.current += 1;

          // Delay (for speed)
          await sleep(100 / speedRef.current);
        }
      }
    }

    const finalArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
    changeArr(finalArr);
    setSteps((prev) => [...prev, finalArr]);
    setCurrentStep((prev) => prev + 1);
    currentStepRef.current += 1;
    totalStepsRef.current += 1;
    sortingRef.current.stop = true;
  };

  const handleSort = () => {
    bubbleSort(arr, (newData: DataBar[]) => setData(newData));
  };

  return handleSort;
};

export default useBubbleSort;
