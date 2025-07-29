### Project scope

#### UI

- Header (Controls)

  - Control # bars
  - Select algorithm to visualise
  - Speed control
  - Pause

- Body: Visualiser
  - Display the bars and visualise the sorting
  - Bars hang from the top

#### Logic

- Bars of differing height (randomly generated within a range)
  - Bar height: 1 <= height <= 200
  - Bar count: 10 <= count <= 500
- Sorting algorithm needs to output incremental change gradually.
  - Maybe sort in place so outside can react to the change?
- How to show incremental change? Maybe compare prev with curr arr, and
  highlight the bar that's changed? How fast would this be?

- User can click on a algorithm, which selects a corresponding algorithm to call.
- The algorithm updates the stored array at each step
- Compare original array with new array, colour those that have changed

- Speed
  - Manually set timeout between each render
    - Can be middleware between the UI and algo, which enforces configurable
      timeout.
    - Add optional flag to stop render completely
      - Need something to tell the sorting algo to stop going

#### Sorting algo (how to update incrementally)

- Algo sorts in place, modifies the array directly
- Whenever a swap happens, colour it for one iteration
-

#### Folder structure

UI

- In AlgoVisualiser.tsx

Logic

- In /algorithms

#### How i did it

- Started with generating array of bars of random height

- Next, started with a basic sort like bubble sort

- Identified when the array is changing, marked it, then directly
  updated the array at this instance

- Wanted to add colour to signify where the swap happened

  - Added a coloured attribute to the bars
  - Deep copy the bars and colour the swapped bars, so the colouring
    only stays for one iteration

- Colouring too flicery, added sleep with adjustable speed parameter

  - Need to pass speed with ref to manually update

- Add pause by passing in flag, and triggering indefinite loop while true

- Added time travel by capturing snapshot of the sort at every step and
  the current step. The sort shown is dependent on the current step

- After finishing two sorts, compared and extracted out common components.
  Created a common type specifying things like:
  - dedicated swap
  - final sweep
  - wait indefinitely while paused
  - increment step to latest one at a time until
    at latest step
