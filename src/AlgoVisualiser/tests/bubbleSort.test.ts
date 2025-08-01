import { describe, it, expect, vi, beforeEach } from "vitest";
import useBubbleSort from "../algorithm/bubbleSort";
import type { DataBar, SortAlgoProps } from "../types";

describe("Bubble Sort", () => {
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

  it("Should sort the array", async () => {
    const bubbleSort = useBubbleSort(mockProps);

    await bubbleSort();

    // Check swap was called (should be 2 swaps for this case)
    expect(mockProps.swap).toHaveBeenCalledTimes(2);
    expect(mockProps.swap).toHaveBeenNthCalledWith(1, 0, 1, expect.any(Array));
    expect(mockProps.swap).toHaveBeenNthCalledWith(2, 1, 2, expect.any(Array));

    // Check finalClear was called with sorted array
    expect(mockProps.finalClear).toHaveBeenCalledWith([
      { value: 1, coloured: false },
      { value: 2, coloured: false },
      { value: 3, coloured: false },
    ]);
  });

  it("Should call swap with correct indices for bubble sort", async () => {
    const bubbleSort = useBubbleSort(mockProps);
    await bubbleSort();

    // Verify the sequence of swaps
    expect(mockProps.swap).toHaveBeenCalledWith(1, 2, expect.any(Array)); // 1,2 -> 1,2
    expect(mockProps.swap).toHaveBeenCalledWith(0, 1, expect.any(Array)); // 3,1 -> 1,3
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

    const bubbleSort = useBubbleSort(props);
    await bubbleSort();

    steps.forEach((step) => {
      expect(step).toHaveLength(3);
    });
  });

  it("Should only swap adjacent elements", async () => {
    const steps: { i: number; j: number }[] = [];
    const mockSwap = vi.fn(async (i, j, arr) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push({ i, j });
    });

    const props = {
      ...mockProps,
      swap: mockSwap,
    };

    const bubbleSort = useBubbleSort(props);
    await bubbleSort();

    steps.forEach(({ i, j }) => {
      expect(Math.abs(i - j)).toBe(1);
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

    const bubbleSort = useBubbleSort(props);
    await bubbleSort();

    steps.forEach((step) => {
      expect(step.sort()).toEqual(originalValues.sort());
    });
  });

  it("Should respect checkStop signal", async () => {
    mockProps.checkStop = vi.fn().mockReturnValue(true);
    const bubbleSort = useBubbleSort(mockProps);
    await bubbleSort();

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

    const bubbleSort = useBubbleSort(props);
    const sortPromise = bubbleSort();

    // Wait a bit for sorting to reach waitWhilePaused
    await new Promise((r) => setTimeout(r, 10));

    expect(mockSwap).not.toHaveBeenCalled(); // Should be paused

    // Resume sorting
    paused = false;

    await sortPromise;

    expect(mockSwap).toHaveBeenCalled(); // Should now be called after resume
  });
});
