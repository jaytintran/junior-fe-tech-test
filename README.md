# Introduction
This is a project built for the coding assignment assigned to me (Tin Tran) by Skedulo. The project is a job listing web page with job's data fetched from a JSON file and display them as component in React.js. Also we have the search bar available as our disposal to search and filter through jobs, the search bar only accepts 3 or characters plus, it won't show anything under 3 keywords, according to the requirements of this project.

All the instruction can be founded [here](./src/INSTRUCTIONS.md) and also the original README [here](./originalREADME.md).

**Installation Instruction**
Install:
    ```yarn bootstrap```

This installs everything for the App as well as the Server, so please don't run ```npm install``` (unless you also want to run it from the `server` folder)

## Running the App
Run:
    ```yarn start```

## Testing the App
Run:
    ```yarn test```

## Execution
First I read the README and Instruction files to get the overall idea of the assignment and the problem to solve. After some insights consideration, I named this problem as "List All Jobs Posting with a Search Functionality".

Then I broke the problem into sub problems (or subtasks):
  + Create a search component
    + Build a function to search
    + Each time the search changes do what (useEffect)
      + Re-initialize the Search Term (useState) according to the event.value
      + Base on that Search Term run the search functing
        + If the search term less than 3 words
          + Just get all jobs (this get all jobs function imported from DataService.tsx)
        + If the search term >= 3 words
          + Get the job with that search term (this get all jobs function imported from DataService.tsx)
      + Return the data
      + Then set that data as Job with setJobs to the State
  + Create a card component with its details
    + From the state, we take the <jobs> and map through it, because simple it's job(s)
    + Each map we add the info of each job to the Job Card as props (of properties)
  + Fetch jobs from database -> populate them into the card component
    + Inside the Job Card we retrieve the props and populate them into the UI

## Challenges & Solutions
1. I couldn't run yarn, so I had to installed it via instruction from their website
2. I couldn't figure out how to get the value from the search bar using React.js + TypeScript
    + So I googled and found that we need to add the onChange property to the input, and each onChange we shoud do something related to the search being changed
    + It's better to create a function out of it. So I create handleSearchChange function with its argument goes something like
    ```
    event: React.ChangeEvent<HTMLInputElement>
    ```  
    + This will set the event according to the HTML Input type only as far as I understand (maybe I'm wrong in my explaination)
    + With this <event> thingy, I can target it, and receive its value (again this is from StackOverflow)
    + Finally within this function, we just need to setSearchTerm to that event thingy (event.target.value)
3. I was stuck on the useEffet Hook:
   + "So we have the search function to use whenever we search for something... but put that function into the input isn't enough. it won't update everytime we do it, and we also would need a submit button... well not in the instruction file"
   + But slowly, by keep asking myself questions to dig deeper about the problem I had a idea "Each time the state updates, the UI must change, so to do that in React.js we have ---> Hook: useEffect"
   + With that useEffect Hook I can update the UI when only the searchTerm is affected (the searchTerm from the state)
   + The 3 words or no word logic was kinda easy, when user entered nothing yet, we just need to show all the jobs available, BUT when at least 3 words above we show the jobs match with that keywords.
     + In this if else logic, each search functions I gave them the searchTerm argument (the basic State from the search functionality).
   + Luckily these 2 functions were given already from DataService file. And I also found out that those functions are in fact asynchronous which means they can run parallel without blocking the call stack.
     + So I needed to use the .then keyword. .then return data... But then where to store those data? again with useState. So I create another useState with jobs and setJobs.
     + Ok there we go, the jobs (data) we got it, we'll use it for the Card commponent.
4. I encountered this problem at **line 17**:
   ```
    Argument of type 'Job[]' is not assignable to parameter of type 'SetStateAction<never[]>'.
    Type 'Job[]' is not assignable to type 'never[]'.
    Type 'Job' is not assignable to type 'never'.  TS2345

    15 |         if (searchTerm.length > 3) {
    16 |             DataService.getJobsWithSearchTerm(searchTerm)
    17 |                 .then(data => setJobs(data as Job[]));
       |                                       ^
    18 |         } else {
    19 |             DataService.getJobs().then(data => setJobs(data as Job[]))
    20 |         }
   ```
   + At the beginning I didn't have any idea why, everything was so perfect. So I rechecked every files, after that I found out in the types.ts file in the common folder basically saying that the getJobsWithSearchTerm and getJobs functions are returning an array of Pick<Job, "name" | "start" | "end"> which is a type that only includes the name, start and end properties of the Job interface, while the jobs state variable is expecting an array of Job.
   + Therefore the useState of [jobs, setJobs] can't just be an array, it has to follow the rule in type.ts file
   + So according to my intuition, I experimented by importing the { Job } from types.ts file and set it to the useState of [jobs, setJobs].
   + The reason for the code "data as Job[]" because the data we pulled from the database need to be compliant to the rules of Job[] thingy from the types.ts file
   + And the line useState<Job[]>([]), honestly I used Google and StackOverflow for it. Basically the answer was:
    + To fix this issue, you can change the type of the jobs state variable to match the type of the data returned by the getJobsWithSearchTerm and getJobs functions, like so:
    ```
    const [jobs, setJobs] = useState<Job[]>([]);
    ```
5. First time testing got blow up
The code ran well, but the test was messed up. So I took a look:
```
  ● Skedulo tech test › clears results when input clears                                      
   expected document not to contain element, found <h2>Build a fence</h2> instead              
```
So as far as I can understand when the user clear their input, the job cards need to also be cleared. In order to do this, we have to set the jobs state to an empty array. And we can achieve it within the handleSearchChange function by adding this into the function:
``` js
        if (!event.target.value) setJobs([])
```

6. All the tests passed, but one more thing annoyed me:
```
  console.error
    Warning: An update to Search inside a test was not wrapped in act(...).

    When testing, code that causes React state updates should be wrapped into act(...):
```
Again Google is my friend, and I found out I have to import the **act** function from "react-test-renderer" and wrap the useEffect state update like this:

```js
useEffect(() => {
    act(() => {
      if (searchTerm.length >= 3) {
        DataService.getJobsWithSearchTerm(searchTerm)
          .then(data => setJobs(data as Job[]));
      } else {
        DataService.getJobs().then(data => setJobs(data as Job[]))
      }
    });
  }, [searchTerm]);
```

But again in the requirement didn't say that I can install any additional package, so I let it be there like that.