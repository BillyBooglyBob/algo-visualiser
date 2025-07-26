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
