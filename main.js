$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyChC6txkQdW_ICBo6753Po1EWO99bRQzMQ",
        authDomain: "trains-trains-trianbs.firebaseapp.com",
        databaseURL: "https://trains-trains-trianbs.firebaseio.com",
        projectId: "trains-trains-trianbs",
        storageBucket: "trains-trains-trianbs.appspot.com",
        messagingSenderId: "880706898737"
    };

    var elementIds = [];
    var timesArray = [];
    var frequencyArray = [];
    var idAssigner = 0;

    firebase.initializeApp(config);

    var database = firebase.database();

    var calTimes = function (startTime, trainFrequency) {

        var trainTimes = [];

        var frequency = trainFrequency;

        var splitTime = startTime.split(":");

        var inMins = ((Number(splitTime[0]) * 60) + Number(splitTime[1]));

        var time = inMins;

        while (time < 1440) {
            var newTime = time + frequency;

            if (newTime >= 1440) {
                time = newTime;
            } else {
                var hour = Math.floor(newTime / 60);

                var mins = newTime - (hour * 60);

                if (mins < 10) {
                    updateMins = mins + "0";
                    mins = updateMins;
                }

                var addNewTime = `${hour}:${mins}`;

                trainTimes.push(addNewTime);

                time = newTime;
            }
        }

        return trainTimes;

    }

    $(".addTrain").on("click", function (response) {

        response.preventDefault();

        var name = $("#nameInput").val();
        var trainDestination = $("#destinationInput").val();
        var startingTime = $("#timeInput").val();
        var trainFrequency = $("#frequencyInput").val();

        database.ref().push({
            trainName: name,
            destination: trainDestination,
            firstTime: startingTime,
            frequency: trainFrequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    })



    database.ref().on("child_added", function (snapshot) {


        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var firstTime = snapshot.val().firstTime;
        var frequency = snapshot.val().frequency;
        var nextArrival = "-";
        var minutesAway = "-";
        var id = idAssigner;
        console.log(id);

        var addedTrain = `
            <tr>
                <td>${trainName}</td>
                <td>${destination}</td>
                <td>${frequency}</td>
                <td id="${id}">${nextArrival}</td>
                <td>${minutesAway}</td>
            </tr>
        `;

        elementIds.push(id);
        timesArray.push(firstTime);
        frequencyArray.push(frequency);
        idAssigner = idAssigner + 1;

        $("#trainsGoHere").append(addedTrain);
    })

    console.log(elementIds);
    console.log(timesArray);
    console.log(frequencyArray);
})