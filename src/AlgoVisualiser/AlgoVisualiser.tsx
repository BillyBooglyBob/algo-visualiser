import { useEffect, useRef, useState } from "react";
import useBubbleSort from "./algorithm/bubbleSort";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
} from "lucide-react";
import useQuickSort from "./algorithm/quickSort";
import { sleep } from "./util";
import type { DataBar } from "./types";
import useMergeSort from "./algorithm/mergeSort";

const AlgoVisualiser = () => {
  const [data, setData] = useState<DataBar[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<DataBar[][]>([]);
  const [size, setSize] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const dataRef = useRef(data);
  const speedRef = useRef(speed);
  const sortingRef = useRef({ stop: false });
  const pausedRef = useRef(paused);
  const currentStepRef = useRef(currentStep);
  const totalStepsRef = useRef(0);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // TODO: Make reset work even when paused

  const randomizeData = () => {
    const newData = Array.from({ length: size }, () => ({
      value: Math.floor(Math.random() * 150) + 1,
      coloured: false,
    }));
    setData(newData);
    dataRef.current = newData;

    setSteps([newData]);
    totalStepsRef.current = 1;
    setPaused(false);
    pausedRef.current = false;
    sortingRef.current.stop = true;

    setCurrentStep(0);
    currentStepRef.current = 0;

    // Possible issue is when paused, it is still inside execution
    // of the particular sort. Even when reset, it still runs with the
    // old array, overriding the new array.
  };

  useEffect(() => {
    randomizeData();
  }, [size]);

  const swap = async (i: number, j: number, arr: DataBar[]) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];

    const newArr = [...arr].map((bar) => ({ ...bar, coloured: false }));
    newArr[j].coloured = true;
    newArr[i].coloured = true;
    setData([...newArr]);

    setSteps((prev) => [...prev, newArr]);
    totalStepsRef.current += 1;
    setCurrentStep((prev) => prev + 1);
    currentStepRef.current += 1;

    console.log("Swapped");
    await sleep(100 / speedRef.current);
  };

  const finalClear = async (arr: DataBar[]) => {
    const finalArr = arr.map((bar) => ({ ...bar, coloured: false }));
    setData([...finalArr]);

    setSteps((prev) => [...prev, finalArr]);
    totalStepsRef.current += 1;

    setCurrentStep((prev) => prev + 1);
    currentStepRef.current += 1;

    sortingRef.current.stop = true;
  };

  const waitWhilePaused = async () => {
    while (pausedRef.current) {
      await sleep(50);
    }
  };

  const playToLatestStep = async () => {
    while (currentStepRef.current < totalStepsRef.current - 1) {
      await waitWhilePaused();

      // Add this in case while paused, current step advanced to latest,
      // which is total steps - 1.
      // If we continue, current step will === total steps, creating off
      // by one error.
      if (currentStepRef.current >= totalStepsRef.current - 1) break;

      setCurrentStep((prev) => prev + 1);
      currentStepRef.current += 1;
      await sleep(100 / speedRef.current);
    }
  };

  const checkStop = () => {
    if (sortingRef.current.stop) return true;
    return false;
  };

  const bubbleSort = useBubbleSort({
    data,
    swap,
    finalClear,
    waitWhilePaused,
    playToLatestStep,
    checkStop,
  });

  const quickSort = useQuickSort({
    data,
    swap,
    finalClear,
    waitWhilePaused,
    playToLatestStep,
    checkStop,
  });

  const mergeSort = useMergeSort({
    data,
    swap,
    finalClear,
    waitWhilePaused,
    playToLatestStep,
    checkStop,
  });

  const handleBubbleSort = () => {
    sortingRef.current.stop = false;
    bubbleSort();
  };

  const handleQuickSort = () => {
    sortingRef.current.stop = false;
    quickSort();
  };

  const handleMergeSort = () => {
    sortingRef.current.stop = false;
    mergeSort();
  };

  const handlePause = () => {
    const currentValue = paused;
    setPaused(!currentValue);
    pausedRef.current = !currentValue;
  };

  const handleStepBackward = () => {
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    currentStepRef.current = newStep;
  };

  const handleStepForward = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    currentStepRef.current = newStep;
  };

  const handleStepToStart = () => {
    setCurrentStep(0);
    currentStepRef.current = 0;
  };

  const handleStepToEnd = () => {
    setCurrentStep(totalStepsRef.current - 1);
    currentStepRef.current = totalStepsRef.current - 1;
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="text-white flex-1 bg-gray-600 flex items-center justify-between p-4">
        <h1>Algo Visualiser</h1>
        <button onClick={randomizeData}>Randomize Data</button>
        <div>
          <button
            disabled={Boolean(currentStepRef.current)}
            className={`${currentStepRef.current && "brightness-50"}`}
            onClick={handleBubbleSort}
          >
            Bubble Sort
          </button>
        </div>
        <div>
          <button
            disabled={Boolean(currentStepRef.current)}
            className={`${currentStepRef.current && "brightness-50"}`}
            onClick={handleQuickSort}
          >
            Quick Sort
          </button>
        </div>
        <div>
          <button
            disabled={Boolean(currentStepRef.current)}
            className={`${currentStepRef.current && "brightness-50"}`}
            onClick={handleMergeSort}
          >
            Merge Sort
          </button>
        </div>
        <div>
          Size:{" "}
          <input
            type="range"
            min={10}
            max={150}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>
        <div>
          Speed:{" "}
          <input
            type="range"
            min={1}
            max={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
        <div>
          <button
            onClick={handleStepToStart}
            disabled={!paused || currentStep === 0}
            className={`${(!paused || currentStep === 0) && "brightness-50"}`}
          >
            <SkipBack />
          </button>
          <button
            onClick={handleStepBackward}
            disabled={!paused || currentStep === 0}
            className={`${(!paused || currentStep === 0) && "brightness-50"}`}
          >
            <StepBack />
          </button>
          <button
            onClick={handlePause}
            disabled={sortingRef.current.stop}
            className={`${
              sortingRef.current.stop ? "brightness-50" : "brightness-100"
            } `}
          >
            {paused ? <Play /> : <Pause />}
          </button>
          <button
            onClick={handleStepForward}
            disabled={!paused || currentStep === steps.length - 1}
            className={`${
              (!paused || currentStep === steps.length - 1) && "brightness-50"
            }`}
          >
            <StepForward />
          </button>
          <button
            onClick={handleStepToEnd}
            disabled={!paused || currentStep === steps.length - 1}
            className={`${
              (!paused || currentStep === steps.length - 1) && "brightness-50"
            }`}
          >
            <SkipForward />
          </button>
          <div>
            Current step: {currentStep + 1} <br />
            Current step ref: {currentStepRef.current + 1} <br />
            Total steps: {steps.length} <br />
            Total steps ref: {totalStepsRef.current} <br />
            Stop ref: {sortingRef.current.stop ? "true" : "false"} <br />
            Mismtach in steps:{" "}
            {currentStep < steps.length - 1 ? "true" : "false"} <br />
            Paused: {paused ? "true" : "false"} <br />
            Paused ref: {pausedRef.current ? "true" : "false"}
          </div>
        </div>
      </header>
      <main className="flex-5 bg-slate-400 flex justify-center w-full">
        <div className="flex gap-1 w-[60%] justify-center">
          {steps[currentStep] &&
            steps[currentStep].map((bar, index) => {
              const coloured = bar.coloured;

              return (
                <div
                  key={index}
                  style={{
                    height: `${bar.value * 3}px`,
                    transform: "scaleY(-1)", // flip to grow from top
                    backgroundColor: `${coloured ? "blue" : "white"}`,
                  }}
                  className={`flex-1`}
                />
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default AlgoVisualiser;
