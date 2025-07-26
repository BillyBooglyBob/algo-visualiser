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
