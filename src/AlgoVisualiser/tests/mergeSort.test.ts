import { describe, it, expect, vi, beforeEach } from "vitest";
import useMergeSort from "../algorithm/mergeSort";
import type { DataBar, SortAlgoProps } from "../types";

describe("Merge Sort", () => {
  let mockProps: SortAlgoProps;

  beforeEach(() => {
    mockProps = {
      data: [
        { value: 3, coloured: false },
        { value: 1, coloured: false },
        { value: 2, coloured: false },
      ],
      swap: vi.fn(async (i: number, j: number, arr: any[]) => {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }),
      finalClear: vi.fn().mockResolvedValue(undefined),
      waitWhilePaused: vi.fn().mockResolvedValue(undefined),
      playToLatestStep: vi.fn().mockResolvedValue(undefined),
      checkStop: vi.fn().mockReturnValue(false),
    };
  });

  it("handles empty array", async () => {
    const mergeSort = useMergeSort({
      ...mockProps,
      data: [],
    });

    await mergeSort();

    expect(mockProps.finalClear).toHaveBeenCalledWith([]);
  });

  it("handles one-element array", async () => {
    const mergeSort = useMergeSort({
      ...mockProps,
      data: [{ value: 3, coloured: false }],
    });

    await mergeSort();

    expect(mockProps.finalClear).toHaveBeenCalledWith([
      { value: 3, coloured: false },
    ]);
  });

  it("Should sort the array", async () => {
    const mergeSort = useMergeSort(mockProps);

    await mergeSort();

    expect(mockProps.finalClear).toHaveBeenCalledWith([
      { value: 1, coloured: false },
      { value: 2, coloured: false },
      { value: 3, coloured: false },
    ]);
  });

  it("Should maintain array size through sort", async () => {
    const steps: DataBar[][] = [];
    const mockSwap = vi.fn(async (i, j, arr) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push([...arr]);
    });

    const props = {
      ...mockProps,
      swap: mockSwap,
    };

    const mergeSort = useMergeSort(props);
    await mergeSort();

    steps.forEach((step) => {
      expect(step).toHaveLength(3);
    });
  });

  it("Should respect checkStop signal", async () => {
    mockProps.checkStop = vi.fn().mockReturnValue(true);
    const mergeSort = useMergeSort(mockProps);
    await mergeSort();

    expect(mockProps.swap).not.toHaveBeenCalled();
  });

  it("Should pause execution at waitWhilePaused", async () => {
    let paused = true;

    const waitWhilePaused = vi.fn(() => {
      return new Promise<void>((resolve) => {
        const check = () => {
          if (!paused) {
            resolve();
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
    });

    const mockSwap = vi.fn(async (i: number, j: number, arr: DataBar[]) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    });

    const props: SortAlgoProps = {
      ...mockProps,
      waitWhilePaused,
      swap: mockSwap,
    };

    const mergeSort = useMergeSort(props);
    const sortPromise = mergeSort();

    await new Promise((r) => setTimeout(r, 10));

    expect(mockSwap).not.toHaveBeenCalled();

    paused = false;

    await sortPromise;

    expect(mockSwap).toHaveBeenCalled();
  });
});
