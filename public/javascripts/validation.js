const price_input = document.getElementById("price");

const reg_second = /^\d+.\d{2}$/gm;
let prev = "";
price_input.addEventListener("input", (e) => {
	e.preventDefault();
	const isValid = price_input.checkValidity();
	const val = String(price_input.value);
	if (!isValid) {
		price_input.setCustomValidity("Must be in a form of xx.xx");
	}
});

function isNumberKey(evt) {
	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
	return true;
}
