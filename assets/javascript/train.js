var config = {
  apiKey: "AIzaSyAfSnzbNEw_B50M0ysXY24_Ihv60535TB8",
  authDomain: "train-a4624.firebaseapp.com",
  databaseURL: "https://train-a4624.firebaseio.com",
  projectId: "train-a4624",
  storageBucket: "",
  messagingSenderId: "370596916398",
  appId: "1:370596916398:web:eedc3129129dd752"
  };

  
   firebase.initializeApp(config);
   let database = firebase.database();
  
  //Fill the Firebase with initial data when button is clicked
  //The button is for adding trains
  $("#addTrain").on("click", function(event){
    event.preventDefault();
    //Get the user input from the fields and assign them to variables
    let trainName = $("#name")
    .val().trim();
    let destination = $("#destination")
    .val().trim();
    let firstTrain = $("#firstTrain")
    .val().trim();
    let frequency = $("#frequency")
    .val().trim();
    
    // Now, to make a local, temporary object for holding train data
    let tempTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
    // Now to upload the train data to the database
    database.ref().push(tempTrain);
    // And test the values in the console
    console.log("The following values were pushed to the firebase")
    console.log(tempTrain.name);
    console.log(tempTrain.destination);
    console.log(tempTrain.firstTrain);
    console.log(tempTrain.frequency);
    alert("Train Successfully Added");
    $("#name").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");
  });
  // Now make a firebase event that pulls the data back down onto the html and formats it correctly
  database.ref().on("child_added", function(snapshot, prevChildKey){
    console.log(snapshot.val());
  //Store Everything into a variable
  let snapName = snapshot.val().name;
  let snapDestination = snapshot.val().destination;
  let snapFirstTrain = snapshot.val().firstTrain;
  let snapFrequency = snapshot.val().frequency;
  let timeArr = snapFirstTrain.split(":");
  let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  let maxMoment = moment.max(moment(), trainTime);
  let tMinutes;
  let tArrival;
  // If the first train is later than the current time, sent arrival to the first train time
  if(maxMoment === trainTime){
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    
    // Here we need to calculate the minutes until arrival
    let differenceTimes = moment().diff(trainTime, "minutes");
    let tRemainder = differenceTimes % snapFrequency;
    tMinutes = snapFrequency - tRemainder;
    // To calculate the arrival time of the train, add the tMinutes to the current time
    tArrival = moment()
    .add(tMinutes, "m")
    .format("hh:mm A");
  }
  console.log("tMinutes: ", tMinutes);
  console.log("tArrival: ", tArrival);
  // Add each trains data into the table using JQueryyyyyy
  $("#train-list").append(`
      <tr>
        <th scope="row">${snapName}</th>
        <td>${snapDestination}</td>
        <td>${snapFrequency}</td>
        <td>${tArrival}</td>
        <td>${tMinutes}</td>
        </tr>
        `)
});
 
