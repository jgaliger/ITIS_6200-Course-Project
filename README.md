README


Attack Stimulation:
1. From the project root:
    a. npm install

   i. If dependencies are missing, install manually with the line below:
   
   b. npm install express ejs morgan method-override mongoose express-session connect-mongo connect-flash bcrypt
   
3. One installed, run (node attackStimulator.js) in order to start the file
   
    a. Status: Displays the current ratchet values associated with Alice and Bob
   
    b. Snapshot: Saves the current state of Alice's ratchet in order to perform attack
   
    c. Step: Performs an imaginary file transfer to advance ratchet steps.
   
    d. Rollback: perform session rollback attack on Alice's ratchet to reset values.
   
5. To perform the attack, follow these steps:
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

  5. Perform these actions until satisfied with the results. This showcases fresh ratchers for every file sent.

Working Application: 

1. From the project root:
   
    a. npm install
       i. If dependencies are missing, install manually with the line below:
   
    b. npm install express ejs morgan method-override mongoose express-session connect-mongo connect-flash bcrypt
       i. This should connect you to a local databse. If there is an error, MongoDB Compass may be required.
       ii. This will effectively create a demo cluster so that you can stiimulate the web application. In order to test the application, creating an account is required.
   
3. Once the application is up and running, explore freely.
