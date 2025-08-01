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

- Off by one error sometimes in steps when paused, play back then resume.

  - If inside playToLatest step, paused before advancing step. During pause,
    current step advanced to latest, which is total steps - 1.
    If we unpause & continue, current step will === total steps, creating off
    by one error.
  - Important to add extra check in front

  - Logged every single flag & checked the react dev tools on the state

- Order of checking pause flag and stop flag matters. Lets say we are
  paused and decided to reset. If pause flag is after stop flag, it will continue
  executing the current iteration of the sort, overriding the new array with
  the old array.

- Checked by logging the different functions, to check what is continuing to
  run after reset.

- Merge sort difficult to visualise, since the most efficient implementation merges
  two sorted arr by pushing to an empty arr (using extra space).

It overwrites sections of arr at a time, instead of swapping like bubble or quick sort.
To visualise, mimic the behaviour. So overwrite one bar at time.

- Tests each algorithm, verify the intermediate sort works as expected.
  Componentised sort into separate functions, made it more modular and testable.

For quickSort, tested the partition (given section of arr, chooses random pivot &
moves all value <= to pivot value to the left, rest to the right).

Separate from the actual quickSort.

For mergeSort, tested the merge (merge two sorted arr) separately as well.
