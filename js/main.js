console.log("working");

// Set the configuration for your app
// TODO: Replace with your project's config object
var firebaseConfig = {
	apiKey: "AIzaSyB5isOPmbCbK8fbHdgGgIqY3flPoL4lNb0",
	authDomain: "arcade-62521.firebaseapp.com",
	databaseURL: "https://arcade-62521-default-rtdb.firebaseio.com",
	projectId: "arcade-62521",
	storageBucket: "arcade-62521.appspot.com",
	messagingSenderId: "830044357819",
	appId: "1:830044357819:web:31bf3e830f8f9d03a7159e",
	measurementId: "G-ECN7Y37MKK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

function writeUserData(score, datetime) {
  firebase.database().ref('scores/' + datetime).set({
    score: score,
    datetime: datetime
  });
}

// improvement would be to order by score
var highscores = document.getElementById("highscores");
var scores = [];

database.ref('scores/').once('value').then(function(snapshot) {
	snapshot.forEach(function(snapshot1) {
		console.log("snapshot.key: " + snapshot1.key); 

		var highestScores = database.ref('scores/' + snapshot1.key + "/score");

		highestScores.on('value', (snapshot) => {
		  	const data = snapshot.val();
		 	// console.log(data);
		 	scores.push(data);
			console.log(scores);

			var newStr = scores.toString().replace(/,/g, '<br>');
			highscores.innerHTML = newStr;
		});

	});
});


function saveScore() {
	// Get name
	var name = document.getElementById("nameText").value;

	if (name.trim() == "") {
		alert("Please enter your name");
	} else {
		writeUserData(name + " - " + document.getElementById('killCount').innerHTML, Date.now());
		window.location.reload();
	}
}



