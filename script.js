// Removes other checks if 'None of the above' is checked, also removes the check from 'None of the above' if another checkbox is checked
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

function advanceForm(formDirection) {
	var yearDiv = document.getElementById('year-div');
	var drivingCondDiv = document.getElementById('driving-conditions-div');
	var oilDiv = document.getElementById('oil-type-div');
	var backBtn = document.getElementById('back-btn')

	if (formDirection == "next") {
		//if the current form section is driving conditions
		if (drivingCondDiv.style.display == "inline") {
			drivingCondDiv.style.display = "none";
			oilDiv.style.display = "inline";
		// if the current form section is vehicle year
		} else if (yearDiv.style.display = "inline") {
			backBtn.style.display = "inline";
			drivingCondDiv.style.display = "inline";
			yearDiv.style.display = "none";
		}
		
	} else if (formDirection == "back") {
		backBtn.style.display = "none";
		drivingCondDiv.style.display = "none";
		yearDiv.style.display = "inline";
	}
}
