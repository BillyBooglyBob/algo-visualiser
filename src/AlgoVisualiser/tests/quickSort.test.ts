import { describe, it, expect, vi, beforeEach } from "vitest";
import useQuickSort from "../algorithm/quickSort";
import type { DataBar, SortAlgoProps } from "../types";

describe("Quick Sort", () => {
  let mockProps: SortAlgoProps;

  beforeEach(() => {
    mockProps = {
      data: [
        { value: 3, coloured: false },
        { value: 1, coloured: false },
        { value: 10, coloured: false },
        { value: -6, coloured: false },
        { value: 2, coloured: false },
      ],
      swap: vi.fn(async (i, j, arr) => {
        if (i < 0 || j < 0 || i >= arr.length || j >= arr.length)
          throw new Error("Swap indices out of bounds");
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }),
      finalClear: vi.fn().mockResolvedValue(undefined),
      waitWhilePaused: vi.fn().mockResolvedValue(undefined),
      playToLatestStep: vi.fn().mockResolvedValue(undefined),
      checkStop: vi.fn().mockReturnValue(false),
    };
  });

  it("handles empty array", async () => {
    const { handleSort: quickSort } = useQuickSort({
      ...mockProps,
      data: [],
    });

    await quickSort();

    expect(mockProps.finalClear).toHaveBeenCalledWith([]);
  });

  it("handles one-element array", async () => {
    const { handleSort: quickSort } = useQuickSort({
      ...mockProps,
      data: [{ value: 3, coloured: false }],
    });

    await quickSort();

    expect(mockProps.finalClear).toHaveBeenCalledWith([
      { value: 3, coloured: false },
    ]);
  });

  it("Should sort the array", async () => {
    const { handleSort: quickSort } = useQuickSort(mockProps);

    await quickSort();

    expect(mockProps.finalClear).toHaveBeenCalledWith([
      { value: -6, coloured: false },
      { value: 1, coloured: false },
      { value: 2, coloured: false },
      { value: 3, coloured: false },
      { value: 10, coloured: false },
    ]);
  });

  it("Always choose pivot between [low, high]", async () => {
    const pivotIndices: number[] = [];
    const originalSwap = mockProps.swap;
    mockProps.swap = vi.fn(async (i, j, arr) => {
      // The first swap in partition swaps low and pivot
      if (i === 0) {
        pivotIndices.push(j);
      }
      await originalSwap(i, j, arr);
    });

    const { handleSort: quickSort } = useQuickSort(mockProps);

    await quickSort();

    pivotIndices.forEach((pivot) => {
      expect(pivot).toBeGreaterThanOrEqual(0);
      expect(pivot).toBeLessThan(mockProps.data.length);
    });
  });

  it("Partition should work", async () => {
    const data: DataBar[] = [
      { value: 2, coloured: false },
      { value: 5, coloured: false },
      { value: 1, coloured: false },
      { value: 4, coloured: false },
      { value: 30, coloured: false },
    ];

    const { partition } = useQuickSort(mockProps);

    const partitionIndex = await partition(data, 0, data.length - 1);
    const partitionValue = data[partitionIndex].value;

    for (let i = 0; i <= partitionIndex; i++) {
      expect(data[i].value).toBeLessThanOrEqual(partitionValue);
    }

    for (let j = partitionIndex + 1; j < data.length; j++) {
      expect(data[j].value).toBeGreaterThan(partitionValue);
    }
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

    const { handleSort: quickSort } = useQuickSort(props);
    await quickSort();

    steps.forEach((step) => {
      expect(step).toHaveLength(5);
    });
  });

  it("Should preserve all original values", async () => {
    const originalBars: DataBar[] = [
      { value: 8, coloured: false },
      { value: 1, coloured: false },
      { value: 4, coloured: false },
      { value: 2, coloured: false },
    ];
    const originalValues = originalBars.map((bar) => bar.value);

    const steps: number[][] = [];

    const mockSwap = vi.fn(async (i, j, arr: DataBar[]) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push(arr.map((bar) => bar.value));
    });

    const props = {
      ...mockProps,
      data: originalBars,
      swap: mockSwap,
    };

    const { handleSort: quickSort } = useQuickSort(props);
    await quickSort();

    steps.forEach((step) => {
      expect(step.sort()).toEqual(originalValues.sort());
    });
  });

  it("Should respect checkStop signal", async () => {
    mockProps.checkStop = vi.fn().mockReturnValue(true);
    const { handleSort: quickSort } = useQuickSort(mockProps);
    await quickSort();

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

    const { handleSort: quickSort } = useQuickSort(props);
    const sortPromise = quickSort();

    await new Promise((r) => setTimeout(r, 10));

    expect(mockSwap).not.toHaveBeenCalled();

    paused = false;

    await sortPromise;

    expect(mockSwap).toHaveBeenCalled();
  });
});
