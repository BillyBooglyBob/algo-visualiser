export interface DataBar {
  value: number;
  coloured: boolean;
}

export interface SortAlgoProps {
  data: DataBar[];
  swap: (i: number, j: number, arr: DataBar[]) => Promise<void>;
  finalClear: (arr: DataBar[]) => Promise<void>;
  waitWhilePaused: () => Promise<void>;
  playToLatestStep: () => Promise<void>;
  checkStop: () => boolean;
}
