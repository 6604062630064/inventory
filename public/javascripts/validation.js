const desc_bar = document.getElementById("desc");
const charCounter = document.getElementById("counter");

charCounter.innerHTML = String(desc_bar.value.length).padStart(3, "0") + " ";
desc_bar.addEventListener("input", (e) => {
	e.preventDefault();
	const no_of_character = e.currentTarget.value.length;
	charCounter.innerHTML = String(no_of_character).padStart(3, "0") + " ";
});
function isNumberKey(evt) {
	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
	return true;
}
