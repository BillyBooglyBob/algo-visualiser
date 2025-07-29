import type { DataBar, SortAlgoProps } from "../types";
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
  swap,
  finalClear,
  waitWhilePaused,
  playToLatestStep,
  checkStop,
}: SortAlgoProps) => {
  const arr = [...data].map((bar) => ({ ...bar }));

  const quickSort = async (arr: DataBar[], low: number, high: number) => {
    if (checkStop()) {
      return;
    }
    await waitWhilePaused();

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
    if (checkStop()) {
      return -1;
    }

    await waitWhilePaused();

    // Find the pivot and move it to the front
    const pivot = low + Math.floor(Math.random() * (high - low + 1));
    await swap(low, pivot, arr);

    const pivotValue = arr[low].value;

    // Swap everything <= than pivot to the left
    let i = low + 1;

    for (let j = low + 1; j <= high; j++) {
      if (arr[j].value <= pivotValue) {
        if (checkStop()) {
          return -1;
        }

        await waitWhilePaused();
        await playToLatestStep();

        // This only coloured at most 2 bars at once, since they create a deep
        // copy of arr at each iteration. This copy is then coloured, but colour
        // does not accumulate since the original arr is not modified, only
        // the copy.
        await swap(i, j, arr);

        i++;
      }
    }

    // i - 1 points to the last value that is <= pivot,
    // so swap this with pivot to bring latter to correct position.
    // Note low is where pivot is placed, since it is swapped there
    // at the start for convenience of swapping
    if (checkStop()) {
      return -1;
    }
    await waitWhilePaused();
    await swap(low, i - 1, arr);

    return i - 1;
  };

  const handleSort = async () => {
    await quickSort(arr, 0, arr.length - 1);

    if (checkStop()) {
      return;
    }

    finalClear(arr);
  };

  return handleSort;
};

export default useQuickSort;
