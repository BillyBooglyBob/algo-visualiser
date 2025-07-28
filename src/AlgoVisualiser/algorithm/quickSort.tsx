import type React from "react";
import type { DataBar } from "../AlgoVisualiser";
import { sleep } from "../util";

interface useQuickSortProps {
  data: DataBar[];
  // dataRef: React.RefObject<DataBar[]>;
  currentStepRef: React.RefObject<number>;
  totalStepsRef: React.RefObject<number>;
  speedRef: React.RefObject<number>;
  sortingRef: React.RefObject<{ stop: boolean }>;
  pausedRef: React.RefObject<boolean>;
  setData: React.Dispatch<React.SetStateAction<DataBar[]>>;
  setSteps: React.Dispatch<React.SetStateAction<DataBar[][]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Sort into left & right partitions
 *
 * Go through each partition.
 * Go through each element of left partition, compare each index
 * with the element of the current array. If different, perform swap & colour.
 *
 * Rmb to skip over parititoned element (note the index)
 *
 * Same for right partition, but with offset to account for left partition &
 * partitioned element.
 */

const useQuickSort = ({
  data,
  currentStepRef,
  totalStepsRef,
  speedRef,
  sortingRef,
  pausedRef,
  setData,
  setSteps,
  setCurrentStep,
}: useQuickSortProps) => {
  const arr = [...data].map((bar) => ({ ...bar }));

  const quickSort = async (arr: DataBar[], low: number, high: number) => {
    if (sortingRef.current.stop) {
      return;
    }

    if (low > high) return;

    const pivot = await partition(arr, low, high);
    await quickSort(arr, low, pivot - 1);
    await quickSort(arr, pivot + 1, high);
  };

  const partition = async (
    arr: DataBar[],
    low: number,
    high: number
  ): Promise<number> => {
    // Find the pivot and move it to the front
    const pivot = low + Math.floor(Math.random() * (high - low + 1));
    [arr[pivot], arr[low]] = [arr[low], arr[pivot]];

    let newArr = [...arr].map((bar) => ({ ...bar }));
    newArr[low].coloured = true;
    newArr[pivot].coloured = true;
    setData([...newArr]);
    setSteps((prev) => [...prev, newArr]);
    totalStepsRef.current += 1;
    setCurrentStep((prev) => prev + 1);
    currentStepRef.current += 1;

    const pivotValue = arr[low].value;

    // Swap everything <= than pivot to the left
    let i = low + 1;

    for (let j = low + 1; j <= high; j++) {
      if (arr[j].value <= pivotValue) {
        if (sortingRef.current.stop) {
          return -1;
        }

        while (pausedRef.current) {
          await sleep(50);
        }

        [arr[i], arr[j]] = [arr[j], arr[i]];

        // TODO: turn below into a single callable

        // This only coloured at most 2 bars at once, since they create a deep
        // copy of arr at each iteration. This copy is then coloured, but colour
        // does not accumulate since the original arr is not modified, only
        // the copy.
        const newArr = [...arr].map((bar) => ({ ...bar }));
        newArr[j].coloured = true;
        newArr[i].coloured = true;

        setData([...newArr]);
        setSteps((prev) => [...prev, newArr]);
        totalStepsRef.current += 1;
        setCurrentStep((prev) => prev + 1);
        currentStepRef.current += 1;
        await sleep(100 / speedRef.current);

        i++;
      }
    }

    // i - 1 points to the last value that is <= pivot,
    // so swap this with pivot to bring latter to correct position.
    // Note low is where pivot is placed, since it is swapped there
    // at the start for convenience of swapping

    [arr[low], arr[i - 1]] = [arr[i - 1], arr[low]];

    newArr = [...arr].map((bar) => ({ ...bar }));
    newArr[low].coloured = true;
    newArr[i - 1].coloured = true;
    setData([...newArr]);
    setSteps((prev) => [...prev, newArr]);
    totalStepsRef.current += 1;
    setCurrentStep((prev) => prev + 1);
    currentStepRef.current += 1;

    await sleep(100 / speedRef.current);

    return i - 1;
  };

  const handleSort = async () => {
    await quickSort(arr, 0, arr.length - 1);

    if (sortingRef.current.stop) {
      return -1;
    }

    const finalArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
    setData([...finalArr]);
    setSteps((prev) => [...prev, finalArr]);
    setCurrentStep((prev) => prev + 1);
    currentStepRef.current += 1;
    totalStepsRef.current += 1;
    sortingRef.current.stop = true;
  };

  return handleSort;
};

export default useQuickSort;
