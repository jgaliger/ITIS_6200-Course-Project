README


Attack Stimulation:
1. In order to examine the local application, run (npm install -l) on vscode in order to install Node.js and MongoDB.
2. One installed, run (node attackStimulator.js) in order to start the file
    a. Status: Displays the current ratchet values associated with Alice and Bob
    b. Snapshot: Saves the current state of Alice's ratchet in order to perform attack
    c. Step: Performs an imaginary file transfer to advance ratchet steps.
    d. Rollback: perform session rollback attack on Alice's ratchet to reset values.
3. To perform the attack, follow these steps:
   1. Status: Examine Alice's ratchet values and take note
   2. Snapshot to save values
   3. Step X amount of times to reset ratchet values
      a. (Take note of values after first step for alice. These values should repeat after performing a step after the rollback.)
   5. Rollback
   6. Status
      a. Verify values captured in step 1 with Alice's current state
   7. Step
   8. Status
      a. Verify values captured in 3a with Alice's current state.

  Success Stimulation:
  1. Status
  2. Step
  3. Status
  4. Step...

  5. Perform these actions until satisfied with the results.

Working Application: 
1. In order to examine the local application, run (npm install -l) on vscode in order to install Node.js and MongoDB.
     a. I apologize if this causes any issues, but you may need to establish a connection to AtlasDB and MongoDB, with the relevant applications.
     b. In order to do this, you must create a localhost cluster on Mongo DB Compass, using the url (mongodb://localhost:27017/demos).
     c. This will effectively create a demo cluster so that you can stiimulate the web application. In order to test the application, creating an account is required.
3. Once the application is up and running, explore freely.
