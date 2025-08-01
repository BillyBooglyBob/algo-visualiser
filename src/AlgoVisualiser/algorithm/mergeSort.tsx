import type { DataBar, SortAlgoProps } from "../types";
/**
 * This version of merge sort does not use swap, instead it overwrites
 * section of array at a time.
 *
 * To visualise this, we just overwrite the existing array one bar at a time,
 * instead of swapping.
 */

const useMergeSort = ({
  data,
  swap,
  finalClear,
  waitWhilePaused,
  playToLatestStep,
  checkStop,
}: SortAlgoProps) => {
  const arr = [...data].map((bar) => ({ ...bar }));

  const mergeSort = async (arr: DataBar[], low: number, high: number) => {
    await waitWhilePaused();
    if (checkStop()) {
      return;
    }

    if (low >= high) return;

    const mid = Math.floor((low + high) / 2);
    await mergeSort(arr, low, mid);
    await mergeSort(arr, mid + 1, high);

    const low1 = low;
    const high1 = mid;
    const low2 = mid + 1;
    const high2 = high;
    await merge(arr, low1, high1, low2, high2);
  };

  const merge = async (
    arr: DataBar[],
    low1: number,
    high1: number,
    low2: number,
    high2: number
  ) => {
    await waitWhilePaused();
    if (checkStop()) return;

    const temp: DataBar[] = [];
    let i = low1,
      j = low2;

    while (i <= high1 && j <= high2) {
      if (arr[i].value <= arr[j].value) {
        temp.push({ ...arr[i++] });
      } else {
        temp.push({ ...arr[j++] });
      }
    }

    while (i <= high1) temp.push({ ...arr[i++] });
    while (j <= high2) temp.push({ ...arr[j++] });

    for (let k = 0; k < temp.length; k++) {
      const targetIndex = low1 + k;
      if (arr[targetIndex].value !== temp[k].value) {
        await waitWhilePaused();
        if (checkStop()) return;
        await playToLatestStep();
        await swap(targetIndex, targetIndex, arr);
      }
      arr[targetIndex] = temp[k];
    }
  };
  const handleSort = async () => {
    await mergeSort(arr, 0, arr.length - 1);

    if (checkStop()) {
      return;
    }

    finalClear(arr);
  };

  return { handleSort, merge };
};

export default useMergeSort;
