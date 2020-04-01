var yearDiv = document.getElementById('year-div');
var drivingCondDiv = document.getElementById('driving-conditions-div');
var oilDiv = document.getElementById('oil-type-div');
var lastOilChangeDiv = document.getElementById('last-oil-change-div');

var backBtn = document.getElementById('back-btn');
var nextBtn = document.getElementById('next-btn');
var checkboxes = document.getElementsByClassName('check-btn');
var monthDropdown = document.getElementById('month-dropdown');
var yearDropdown = document.getElementById('year-dropdown');

var nextDisabled = true;


// Removes other checks if 'None of the above' is checked, also removes the check 
//from 'None of the above' if another checkbox is checked
function cancelCheckboxes(checkbox) {
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

// Method to handle if next button should be disabled, only required for screen with checkboxes
// since radio buttons are always set to have one option checked as a default
function nextBtnHandler(inputType) {
	// Default: Disable next button if no options are checked
	nextDisabled = true;

	if (inputType == "checkbox") {
		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked) {
				nextDisabled = false;
			}
		}
	} else if (inputType == "dropdown") {
		// only progress if a valid date/year are selected
		if (monthDropdown.selectedIndex != 0 && yearDropdown.selectedIndex != 0) {
			nextDisabled = false;
		}
	}
	// Logic for if next button is disabled
	nextDisabled ? nextBtn.disabled = true : nextBtn.disabled = false;
}

function advanceForm(formDirection) {
	if (formDirection == "next") {
		if (drivingCondDiv.style.display == "inline") {   // current form section is driving cond.
			hide1(drivingCondDiv);
			show1(oilDiv);
			handleProgressBar(2);
		} else if (yearDiv.style.display != "none") { 	// current form section is vehicle year
			nextBtnHandler("checkbox");
			hide1(yearDiv);
			show2(backBtn, drivingCondDiv);
			handleProgressBar(1);
		} else if (oilDiv.style.display != "none") {   // current form section is oil type
			nextBtnHandler("dropdown");
			hide1(oilDiv);
			show1(lastOilChangeDiv);
			handleProgressBar(3);
			nextBtn.innerHTML = "Submit";
		}
	} else if (formDirection == "back") {
		nextBtn.removeAttribute('disabled');

		if (drivingCondDiv.style.display != "none") {   // current form section is driving cond.
			hide2(backBtn, drivingCondDiv);
			show1(yearDiv);
			handleProgressBar(0);
		} else if (oilDiv.style.display != "none")	{	// current form section is oil type
			hide1(oilDiv);
			show1(drivingCondDiv);
			handleProgressBar(1);
		} else if (lastOilChangeDiv.display != "none") { // current form section is last oil change
			hide1(lastOilChangeDiv);
			show1(oilDiv);
			handleProgressBar(2);
			nextBtn.innerHTML = "Next";
		}
	}
}

function show1(element) {
	element.style.display = "inline";
}
function show2(el1, el2) {
	el1.style.display = "inline";
	el2.style.display = "inline";
}

function hide1(element) {
	element.style.display = "none";
}
function hide2(el1, el2) {
	el1.style.display = "none";
	el2.style.display = "none";
}

function handleProgressBar(formSection) {
	var progressBar = document.getElementById('progress-bar');
	progressBar.style.marginLeft = formSection * 25 + "%"; // moves the progress bar based on where user is in form
	
	// handles rounded corners of progress bar
	if (progressBar.style.marginLeft == "0%") {
		progressBar.style.borderTopLeftRadius = "15px";
	} else if (progressBar.style.marginLeft == "75%") {
		progressBar.style.borderTopRightRadius = "15px";
	} else {
		progressBar.style.borderTopLeftRadius = "0px";
		progressBar.style.borderTopRightRadius = "0px";
	}
}

function calcLastOilChange() {
	var lastOCText = document.getElementById('months-since-text');
	var numMonths;
	var month = monthDropdown.value;
	var year = yearDropdown.value;
	var todaysDate = new Date();

	// only show text if valid month/year are selected from dropdowns
	if (monthDropdown.selectedIndex != 0 && yearDropdown.selectedIndex != 0) {
		numMonths = todaysDate.getMonth() + 1 - getMonthFromString(month);

		if (year < todaysDate.getYear() + 1900) {
			numMonths += ((todaysDate.getYear() + 1900 - year) * 12);
		}

		lastOCText.style.display = "inline-block";

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

// from https://stackoverflow.com/questions/13566552/easiest-way-to-convert-month-name-to-month-number-in-js-jan-01
function getMonthFromString(month){

   var d = Date.parse(month + "1, 2012");
   if(!isNaN(d)){
      return new Date(d).getMonth() + 1;
   }
   return -1;
 }
