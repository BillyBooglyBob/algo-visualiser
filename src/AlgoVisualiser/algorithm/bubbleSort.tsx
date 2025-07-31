import type { DataBar, SortAlgoProps } from "../types";

const useBubbleSort = ({
  data,
  swap,
  finalClear,
  waitWhilePaused,
  playToLatestStep,
  checkStop,
}: SortAlgoProps) => {
  // Deep clone (create separate copy so as to not directly modify data without
  // using useState)
  // - Can make bugs harder to debug (since React doesn't re-render when state
  //  modified without useState, so the state is updated silently)
  // - React can skip render, since it only re-renders when triggered through useState
  const arr = [...data].map((bar) => ({ ...bar }));

  const bubbleSort = async (arr: DataBar[]) => {
    // Bubbles one big value at a time from the front
    // to the end
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (arr[j].value > arr[j + 1].value) {
          await waitWhilePaused();
          if (checkStop()) {
            return;
          }

          await playToLatestStep();
          await swap(j, j + 1, arr);
        }
      }
    }

    await finalClear(arr);
  };

  return () => bubbleSort(arr);
};

export default useBubbleSort;
