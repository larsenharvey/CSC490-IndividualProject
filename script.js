var yearDiv = document.getElementById('year-div');
var drivingCondDiv = document.getElementById('driving-conditions-div');
var oilDiv = document.getElementById('oil-type-div');
var lastOilChangeDiv = document.getElementById('last-oil-change-div');

var backBtn = document.getElementById('back-btn');
var nextBtn = document.getElementById('next-btn');

var yearOptions = document.getElementsByClassName('year-check');
var drivingCondOptions = document.getElementsByClassName('cond-check');
var oilOptions = document.getElementsByClassName('oil-check');

var monthDropdown = document.getElementById('month-dropdown');
var yearDropdown = document.getElementById('year-dropdown');

var currentPage;
var nextDisabled = true;

var oilChangeTable = document.getElementById('vehicle-history-table');


// returns the current page of the form the user is on
function findCurrentPage() {
	if (yearDiv.style.display != "none") {
		return "year";
	} else if (drivingCondDiv.style.display != "none") {
		return "driving conditions";
	} else if (oilDiv.style.display != "none") {
		return "oil type";
	} else if (lastOilChangeDiv.style.display != "none") {
		return "last oil change";
	}
}

// Removes other checks if 'None of the above' is checked, also removes the check 
//from 'None of the above' if another checkbox is checked
function drivingCondCheckHandler(checkbox) {
	var topChecks = document.getElementsByClassName('top-checks');

	if (checkbox.classList.contains('top-checks')) {
		document.getElementById('none-checkbox').checked = false;
	} else {
		if (checkbox.checked == true) {
			for (var i = 0; i < topChecks.length; i++) {
				topChecks[i].checked = false;
			}
		}
	}
}

// Method to handle if next button should be disabled
function nextBtnHandler() {
	// Default: Disable next button if no options are checked
	nextDisabled = true;
	currentPage = findCurrentPage();

	if (currentPage == "year") {
		if (nextBtnHandlerHelper(yearOptions) == true) {
			nextDisabled = false;
		}
	} else if (currentPage == "driving conditions") {
		if (nextBtnHandlerHelper(drivingCondOptions) == true) {
			nextDisabled = false;
		}
	} else if (currentPage == "oil type") {
		if (nextBtnHandlerHelper(oilOptions) == true) {
			nextDisabled = false;
		}
	} else if (currentPage == "last oil change") {
		// only progress if a valid date/year are selected
		if ((monthDropdown.selectedIndex != 0 && yearDropdown.selectedIndex != 0) && (computeMonthsSinceLastOilChange(false) >= 0)) {
			nextDisabled = false;
		}
	}
	// Logic for if next button is disabled
	nextDisabled ? nextBtn.disabled = true : nextBtn.disabled = false;
}

// checks if any button in a class is checked
function nextBtnHandlerHelper(buttonClass) {
	for (var i = 0; i < buttonClass.length; i++) {
		if (buttonClass[i].checked) {
			return true;
		}
	}
}

// This function handles which screens of the form to show at once
function formHandler(formDirection) {
	currentPage = findCurrentPage();

	if (formDirection == "next") {
		if (currentPage == "year") {
			clearPage('drivingcond'); // clear next page of inputs
			hide1(document.getElementById('last-entry-btn'));
			hide1(yearDiv);
			show2(backBtn, drivingCondDiv);
			progressBarHandler(1);
		} else if (currentPage == "driving conditions") {
			clearPage('oiltype'); // clear next page of inputs
			hide1(drivingCondDiv);
			show1(oilDiv);
			progressBarHandler(2);
		} else if (currentPage == "oil type") {
			clearPage('lastOC'); // clear next page of inputs
			hide1(oilDiv);
			show1(lastOilChangeDiv);
			progressBarHandler(3);
			nextBtn.innerHTML = "Submit";
		}

		// Used for last page
		if (currentPage == "last oil change") {
			submitForm(false);
		}

		nextBtnHandler();
	} else if (formDirection == "back") {
		nextBtn.removeAttribute('disabled');

		if (currentPage == "driving conditions") {
			hide2(backBtn, drivingCondDiv);
			show1(yearDiv);
			show1(document.getElementById('last-entry-btn'));
			progressBarHandler(0);
		} else if (currentPage == "oil type")	{
			hide1(oilDiv);
			show1(drivingCondDiv);
			progressBarHandler(1);
		} else if (currentPage == "last oil change") {
			hide1(lastOilChangeDiv);
			show1(oilDiv);
			progressBarHandler(2);
			nextBtn.innerHTML = "Next";
		}
	}
}

// Calls other methods to calculate if you are overdue for an oil change, and
// gives a recommendation for how often to get your oil changed
function submitForm(useLastEntry) {
	document.getElementById('buttons-div').style.display = "none";
	document.getElementById('add-oil-change').style.display = "inline";
	lastOilChangeDiv.style.display = "none";

	var monthsUntilNextOCText = document.getElementById('months-until-next-OC-text');
	var recommendationText = document.getElementById('recommendation-text');

	var monthsSinceLastOC = computeMonthsSinceLastOilChange(useLastEntry);
	var recommendedMonthsBetweenOC = getOilChangeInfoHelper(useLastEntry)[1];

	var monthsLeft = recommendedMonthsBetweenOC - monthsSinceLastOC; // number of months until left an oil change is recommended

	if (monthsLeft > 1) {
		monthsUntilNextOCText.innerHTML = "You should get your oil changed in " + monthsLeft + " months";
		monthsUntilNextOCText.style.color = "#008000";
	} else if (monthsLeft == 1) { // (for grammar!)
		monthsUntilNextOCText.innerHTML = "You should get your oil changed in " + monthsLeft + " month";
		monthsUntilNextOCText.style.color = "#b3b300";
	} else if (monthsLeft == -1) { // (for grammar!)
		monthsUntilNextOCText.innerHTML = "You are " + Math.abs(monthsLeft) + " month overdue for an oil change. You should get your oil changed immediately!";
		monthsUntilNextOCText.style.color = "#cc2900";
	} else if (monthsLeft < 0) {
		monthsUntilNextOCText.innerHTML = "You are " + Math.abs(monthsLeft) + " months overdue for an oil change. You should get your oil changed immediately!";
		monthsUntilNextOCText.style.color = "#cc2900";
	} else if (monthsLeft == 0) {
		monthsUntilNextOCText.innerHTML = "You should get your oil changed within this month";
		monthsUntilNextOCText.style.color = "#ff9900";
	}

	recommendationText.innerHTML = getOilChangeInfo(useLastEntry);
}
//shows one element
function show1(element) {
	element.style.display = "inline";
}
//show two elements
function show2(el1, el2) {
	el1.style.display = "inline";
	el2.style.display = "inline";
}
//hides one element
function hide1(element) {
	element.style.display = "none";
}
//hides two elements
function hide2(el1, el2) {
	el1.style.display = "none";
	el2.style.display = "none";
}

// moves the progress bar across the screen depending on the current form section
function progressBarHandler(formSection) {
	var progressBar = document.getElementById('progress-bar');
	progressBar.style.marginLeft = formSection * 25 + "%"; // moves the progress bar based on where user is in form
	
	// handles rounded corners of progress bar
	if (progressBar.style.marginLeft == "0%") {
		progressBar.style.borderTopLeftRadius = "8px";
	} else if (progressBar.style.marginLeft == "75%") {
		progressBar.style.borderTopRightRadius = "8px";
	} else {
		progressBar.style.borderTopLeftRadius = "0px";
		progressBar.style.borderTopRightRadius = "0px";
	}
}

// This function clears the inputs for a specific form page when called
function clearPage(page) {
	if (page == "year") {
		clearPageHelper(yearOptions);
	} else if (page == "drivingcond") {
		clearPageHelper(drivingCondOptions);
	} else if (page == "oiltype") {
		clearPageHelper(oilOptions);
	} else if (page == "lastOC") {
		monthDropdown.selectedIndex = 0;
		yearDropdown.selectedIndex = 0;
	}
}

// Helps above function, clears all checkboxes on a specified page
function clearPageHelper(checkboxes) {
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
	}
}

// handles logic for label text that computes months since the last oil change in the form
function setLastOilChangeText() {
	var lastOCText = document.getElementById('months-since-text');
	
	// only show text if valid month/year are selected from dropdowns
	if (monthDropdown.selectedIndex != 0 && yearDropdown.selectedIndex != 0) {

		lastOCText.style.display = "inline-block";

		var numMonths = computeMonthsSinceLastOilChange(false);

		if (numMonths < 0) {
			lastOCText.innerHTML = "Please select a valid date in the past";
		} else if (numMonths == 1) {
			lastOCText.innerHTML = "1 month since last oil change"; //grammar
		} else if (numMonths >= 0) {
			lastOCText.innerHTML = numMonths + " months since last oil change";
		}
		
	} else {
		hide1(lastOCText); // don't show text if invalid date is selected
	}
}

// returns a string of a recommendation for how often to change oil based on the data the users enters
function getOilChangeInfo(useLastEntry) {
	if (useLastEntry) {
		recommendation = getOilChangeInfoHelper(true);
	} else {
		recommendation = getOilChangeInfoHelper(false);
	}

	recNumMiles = recommendation[0]; // numMiles rec
	recNumMonths = recommendation[1]; // numMonths rec
	return "For your vehicle, your oil should be changed every " + recNumMiles + " miles or every " + recNumMonths + " months (whichever comes first)";
}

// helper function, returns a recommendation of miles & months between oil changes based
// on the info entered by the user
function getOilChangeInfoHelper(useLastEntry) {
 	var oldVehicle;    // true = 2007 or earlier, false = 2008 or later
 	var typicalDriver; // true = typical driving (none of the above), false = any other option
 	var convOil; 	   // true = conventional oil or 'I'm not sure', false = synthetic oil
 	var monthsSinceLastOC = computeMonthsSinceLastOilChange(useLastEntry);

 	// array that will be returned, result[0] = recommended number of miles, result[1] = recommended number of months
 	var recommendation;

 	if (useLastEntry) {
 		firebase.database().ref('oilChangeEntries/entry' + (getTableLength() - 1)).on("value", function(snapshot) {
			var entry = snapshot.val();
			oldVehicle = entry.oldVehicle;
			typicalDriver = entry.typicalDriver;
			convOil = entry.conventionalOil;
		});
 	} else {
 		 // initialize variables using helper methods
 		oldVehicle = getVehicleYear();
 		typicalDriver = getDrivingConditions();
 		convOil = getOilType();
 	}


 	if (oldVehicle) {
 		if (convOil) {
 			if (typicalDriver) {
 				recommendation = ["5,000", 6];
	 		} else if (!typicalDriver) {
	 			recommendation = ["3,000", 3];
	 		}
 		} else if (!convOil) { // synthetic oil
 			if (typicalDriver) {
 				recommendation = ["7,500", 7];
	 		} else if (!typicalDriver) {
	 			recommendation = ["5,000", 4]
	 		}
 		}
 	} else if (!oldVehicle) {
 		if (convOil) {
	  		if (typicalDriver) {
	  			recommendation = ["7,500", 6];
	 		} else if (!typicalDriver) {
	 			recommendation = ["5,000", 6];
	 		}
 		} else if (!convOil) { // synthetic oil
 			if (typicalDriver) {
 				recommendation = ["10,000", 10];
	 		} else if (!typicalDriver) {
	 			recommendation = ["7,500", 8];
	 		}	
 		}
 	}

 	return recommendation;
}

// returns the number of months since the last oil change, based on users' entry
function computeMonthsSinceLastOilChange(useLastEntry) {
	var month;
	var year;
	if (useLastEntry) {
		firebase.database().ref('oilChangeEntries/entry' + (getTableLength() - 1)).on("value", function(snapshot) {
			var entry = snapshot.val();
			month = entry.month;
			year = entry.year;
		});
	} else {
		month = monthDropdown.value;
		year = yearDropdown.value;
	}
	var todaysDate = new Date();

	var numMonths = todaysDate.getMonth() + 1 - getMonthFromString(month);

	if (year < todaysDate.getYear() + 1900) {
			numMonths += ((todaysDate.getYear() + 1900 - year) * 12);
	}
	return numMonths;
}

// returns true if '2007 or older' is checked and returns false if '2008 and newer' is checked
function getVehicleYear() {
	if (document.getElementById('older-car').checked) {
 		return true;
 	} else if (document.getElementById('newer-car').checked) {
 		return false;
 	}
}

// returns true if typical driver ('none of the above' is checked) and false if not typical driver
function getDrivingConditions() {
	if (document.getElementById('none-checkbox').checked) {
 		return true;
 	} else if (!(document.getElementById('none-checkbox').checked)) {
 		return false;
 	}
}

// returns true if conventional oil is checked (or 'I'm not sure') and false if synthetic is checked
function getOilType() {
	if (!(document.getElementById('synthetic-btn').checked)) {
 		return true;
 	} else if (document.getElementById('synthetic-btn').checked) {
 		return false;
 	}
}

// from https://stackoverflow.com/questions/13566552/easiest-way-to-convert-month-name-to-month-number-in-js-jan-01
function getMonthFromString(month){

   var d = Date.parse(month + "1, 2012");
   if(!isNaN(d)){
      return new Date(d).getMonth() + 1;
   }
   return -1;
}


// this function is a work in progress, currently does not act as intended!
function sortTable() {   
	firebase.database().ref('oilChangeEntries').orderByChild('month');
	// console.log(firebase.database().ref('oilChangeEntries').orderByChild('month'));
}

// fills oil change history table with values from firebase
function initializeTable() {
	firebase.database().ref('oilChangeEntries/').once('value').then(function(snapshot) {
		var entries = snapshot.val();

		for (var key in entries) {
		    console.log(key);
		    addToTable(key);
		}
	});
}

// uses the last entry to predict an oil change
function useLastEntry() {
	submitForm(true);
	hide2(yearDiv, document.getElementById('add-oil-change'));
}

// returns the length of the oil change history table
function getTableLength() {
	return oilChangeTable.rows.length;
}

// from https://www.w3resource.com/javascript-exercises/javascript-dom-exercise-5.php
function insertRow(month, year, oilType) {
	var table=document.getElementById('vehicle-history-table').insertRow(1);
	table.insertCell(0); // placeholder for left col
	var x = table.insertCell(1);
	var y = table.insertCell(2);
	var z = table.insertCell(3);
	x.innerHTML = month;
	y.innerHTML = year;
	z.innerHTML = oilType;
}

// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
	apiKey: "AIzaSyASNODffe-dM0bghv3o261qZunlEc-rc8Y",
	authDomain: "vehicle-maintenance-trac-78e68.firebaseapp.com",
	databaseURL: "https://vehicle-maintenance-trac-78e68.firebaseio.com",
	storageBucket: "vehicle-maintenance-trac-78e68.appspot.com"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
// Get a reference to the database service
var rootRef = firebase.database().ref().child('infos');


// saves a form entry to the firebase database
function writeToFirebase(entryNum, month, year, oilType, typicalDriver, oldVehicle) {
	var nextEntryId = getTableLength();

	firebase.database().ref('oilChangeEntries/' + "entry" + nextEntryId).set({
		month: monthDropdown.value,
		year: yearDropdown.value,
		conventionalOil: getOilType(),
		typicalDriver: getDrivingConditions(),
		oldVehicle: getVehicleYear()
		});
	console.log("Saving as entry" + nextEntryId);

	addToTable("entry" + nextEntryId);
	document.getElementById('add-oil-change').style.display = "none";
	document.getElementById('rec-padding').style.display = "inline";
}

// adds a row to the table from a specificed entry in firebase
function addToTable(entryNum) {
	firebase.database().ref('oilChangeEntries/' + entryNum).on('value', function(snapshot) {
		var oilType = snapshot.val().conventionalOil;
		if (oilType == true) {
			oilType = "Conventional";
		} else if (oilType == false) {
			oilType = "Synthetic";
		}
		insertRow(snapshot.val().month, snapshot.val().year, oilType);
	});
}

// clears all entries in the table and 'clears' all entires in firebase
function clearTable() {
	if (confirm("Are you sure you want to clear the table? This action cannot be reversed.")) {
		// Remove node from firebase
		firebase.database().ref('oilChangeEntries/').remove();

		// Delete entries from table - from https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
		var tableHeaderRowCount = 1;
		var rowCount = oilChangeTable.rows.length;
		for (var i = tableHeaderRowCount; i < rowCount; i++) {
	    	oilChangeTable.deleteRow(tableHeaderRowCount);
		}
	}

	hide1(document.getElementById('last-entry-btn'));
}

