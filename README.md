# Borrowing Power Calculator CLI application

## Process

1. Meet the minimum requirements using things I know
   - API call
   - Clean-up / Refactoring
2. Adding a feature: I actually got back to thinking about future enhancement - 'she[Gen] could extend it later'
3. Add user input validation and tests for this addition

### API Call

I changed `getTax` & `getHEM` to add API calls. At first, I tried making a string for endpoint url as there was only one parameter for `getTax`. I added a header for PAT (token). It wasn’t working. I remembered I used `URLSearchParams` constructor in my personal project - weather app's api call (numerous parameters so I needed an object), so switched to `URLSearchParams` & `.append`. I updated those functions to use async/await after I added api calls in `getTax` & `getHEM`. The test for standard values was not passing after this change as it was initially expecting to receive hard-coded values for tax and HEM in the original `getTax` & `getHEM`. So, I updated the expected value in the test.

### Clean-up / Refactoring

`getTax` & `getHEM`, Both use the same GET request so I moved the common part[`fetchApiData`](./helper/calc_helper.js) to a helper file at the beginning. I tried to make `calculateBorrowingPower`(currently [`calculateStandardLoan`](./borrowingCalculator.js#L33)) cleaner (orchestrator function) by moving each calculation to `calc_helper.js` file and tried to keep functions to one task per function.

This may not be a necessary adjustment, but I replaced five parameters for `calculateBorrowingPower`(currently `calculateStandardLoan`) with an object (just stored those parameters into an object) for readability. But because of this, I had to change parameters in the test that made the same test file a little longer.

### Adding a feature

I got back to the 'Make it manageable' section in the instructions that says 'she could extend it later'. I now felt that being extendible is more important than I initially thought. My assumption for a new feature is this app can handle multiple loan types (personal loan, home loan or business loan. Or fixed interest rate vs variable rates). I suppose loan term, interest rate and probably calculation method would be different depending on the type of loan. Then, I paid more attention to the factory/closure pattern in the instructions and I began to research these. I found a blog that showed an example of the factory pattern for `Class` that uses a switch statement. I found it useful for this application. So, I decided to follow this style in my function [`calculateBorrowingPower`](./borrowingCalculator.js#L56) so that I can add different loan types in the future.

### User input validation and tests

I added user input checks in [`runConsoleMode`](./borrowingCalculator.js#L65) as it crashed if input was not a number. I also added tests for this change.

## Design Decisions and trade-offs

### Class vs Orchestrator function

[`calculateStandardLoan`](./borrowingCalculator.js#L33) (formerly `calculateBorrowingPower`) does a bunch of calculations. I think turning this function to a class does not have much benefits as this does not share property/state.

### Adding a factory function

As mentioned in 'Process - Adding a feature section', I eventually added a factory function thinking about adding other loan types. It feels to me that adding this factory function adds flexibitly.

### Server or front-end

Should these calculations in front-end stay as they are or be moved to `server.js`?

I think important or confidential data and logics in general should be kept on the server (plus make it accessible only for authorised requests) as it will protect the information being exposed on the web. For this terminal application, there is probably not a big difference if calculation logic lives in 'server' or 'server + front-end', except it may be cleaner and easier to maintain if everything is on one side. I think those calculations in front-end files can stay there so I did not move them. I think things like `incomeTier` in [`calcHem`](./server.js#L47) in `server.js` should be kept on the server.
If this is a web browser based application and it has a slider/sliders for user input, it is probably better when most non-business logic calculations are on the front-end to avoid making too many http requests.

## Installation and Steps

### Install Dependencies

```
npm install
```

### Server

Start:

```
npm run api
```

End: Ctrl + C

### Tests

Run tests with:

```
npm test
```
