import { useCallback, useEffect, useRef, useState } from "react";
import useBubbleSort from "./algorithm/bubbleSort";
import { Pause, Play, StepBack, StepForward } from "lucide-react";

export interface DataBar {
  value: number;
  coloured: boolean;
}

const AlgoVisualiser = () => {
  const [data, setData] = useState<DataBar[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<DataBar[][]>([]);
  const [size, setSize] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  const speedRef = useRef(speed);
  const sortingRef = useRef({ stop: false });
  const pausedRef = useRef(paused);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const randomizeData = () => {
    sortingRef.current.stop = true;
    pausedRef.current = false;

    const newData = Array.from({ length: size }, () => ({
      value: Math.floor(Math.random() * 150) + 1,
      coloured: false,
    }));
    setData(newData);
    setSteps([newData]);
    setCurrentStep(0);
  };

  useEffect(() => {
    randomizeData();
  }, [size]);

  // Memoise to prevent recalculating function on every load
  // - minor performance issue
  // const handleBubbleSort = useCallback(() => {
  //   useBubbleSort({
  //     data,
  //     speedRef,
  //     sortingRef,
  //     pausedRef,
  //     setData,
  //     setSteps,
  //   });
  // }, [data, speedRef, sortingRef, pausedRef, setData, setSteps]);
  const handleBubbleSort = useBubbleSort({
    data,
    speedRef,
    sortingRef,
    pausedRef,
    setData,
    setSteps,
    setCurrentStep,
  });

  const handleSort = () => {
    sortingRef.current.stop = false;
    handleBubbleSort();
  };

  const handlePause = () => {
    const currentValue = paused;
    setPaused(!currentValue);
    pausedRef.current = !currentValue;
  };

  const handleStepBackward = () => setCurrentStep((prev) => prev - 1);
  const handleStepForward = () => setCurrentStep((prev) => prev + 1);

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="text-white flex-1 bg-gray-600 flex items-center justify-between p-4">
        <h1>Algo Visualiser</h1>
        <button onClick={randomizeData}>Randomize Data</button>
        <div>
          <button onClick={handleSort}>Bubble Sort</button>
        </div>
        <div>
          Size:{" "}
          <input
            type="range"
            min={0}
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
          <div>
            Current step: {currentStep} <br />
            Total steps: {steps.length}
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
