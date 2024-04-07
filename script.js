// Declare variables at a broader scope
let charLength;
let checkedBoxes;
let includeUppercase;
let includeLowercase;

// Function to copy the generated password to the clipboard
function copyPassword() {
  const passwordInput = document.getElementById("password");
  passwordInput.select();
  document.execCommand("copy");
  alert("Password copied to clipboard!");
}

// Function to determine the password strength based on length and checked checkboxes
function getPasswordStrength(length, checkBoxes) {
  if (checkBoxes.length === 0 || length === "0") {
    return "None";
  } else if (length >= 12 && checkBoxes.length >= 3) {
    return "Strong";
  } else if (length >= 8 && checkBoxes.length >= 2) {
    return "Medium";
  } else {
    return "Weak";
  }
}

// Function to generate the password
function generatePassword() {
  charLength = document.getElementById("char-length").value;
  includeUppercase = document.getElementById("include-uppercase").checked;
  includeLowercase = document.getElementById("include-lowercase").checked;
  const includeNumbers = document.getElementById("include-numbers").checked;
  const includeSymbols = document.getElementById("include-symbols").checked;
  checkedBoxes = [
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ].filter((isChecked) => isChecked);

  let characters = "";
  let generatedPassword = "";

  if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) characters += "0123456789";
  if (includeSymbols) characters += "!@#$%^&*()";

  if (checkedBoxes.length === 0 || charLength === "0") {
    const passwordInput = document.getElementById("password");
    passwordInput.value = "Check at least one checkbox!";
    updatePasswordStrength("0", checkedBoxes);
    updateTimeToCrack("0", checkedBoxes);
    return;
  }

  for (let i = 0; i < charLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    generatedPassword += characters[randomIndex];
  }

  const passwordInput = document.getElementById("password");
  passwordInput.value = generatedPassword;

  updatePasswordStrength(charLength, checkedBoxes);
  updateTimeToCrack(charLength, checkedBoxes);
}

// Function to update the password strength and bars
function updatePasswordStrength(charLength, checkedBoxes) {
  const strengthBars = document.querySelectorAll(
    ".strength-bar-fill-1, .strength-bar-fill-2, .strength-bar-fill-3, .strength-bar-fill-4"
  );

  if (checkedBoxes.length === 0 || charLength === "0") {
    const strengthLabel = document.querySelector(".strength-meter label");
    strengthLabel.textContent = "Strength: None";
    strengthBars.forEach((bar) => {
      bar.style.backgroundColor = "transparent";
    });
    return;
  }

  const strengthColors = ["red", "#FFA257", "#4ABEA0"];

  const strength = getPasswordStrength(charLength, checkedBoxes);

  strengthBars.forEach((bar, index) => {
    if (strength === "Weak") {
      bar.style.backgroundColor = index === 0 ? strengthColors[0] : "transparent";
    } else if (strength === "Medium") {
      bar.style.backgroundColor = index < 3 ? strengthColors[1] : "transparent";
    } else {
      bar.style.backgroundColor = strengthColors[2];
    }
  });

  const strengthLabel = document.querySelector(".strength-meter label");
  strengthLabel.textContent = "Strength: " + strength;
}

// Function to update the character length display
function updateCharacterLength() {
  const charLengthSlider = document.getElementById("char-length");
  const charLengthValue = document.getElementById("char-length-value");

  charLengthValue.textContent = charLengthSlider.value;

  generatePassword();
  updatePasswordStrength(charLengthSlider.value, checkedBoxes);
  updateTimeToCrack(charLengthSlider.value, checkedBoxes);
}

// Event listener for the "Generate Password" button
const generateButton = document.querySelector(".generate-button");
generateButton.addEventListener("click", generatePassword);

// Event listener for the character length slider
const charLengthSlider = document.getElementById("char-length");
charLengthSlider.addEventListener("input", updateCharacterLength);

// Event listeners for checkboxes
const checkboxes = document.querySelectorAll(".include-checkbox");
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const includeLowercaseCheckbox = document.getElementById("include-lowercase");
    const includeNumbersCheckbox = document.getElementById("include-numbers");
    const includeSymbolsCheckbox = document.getElementById("include-symbols");

    const checkedBoxes = [
      includeUppercase,
      includeLowercaseCheckbox.checked,
      includeNumbersCheckbox.checked,
      includeSymbolsCheckbox.checked,
    ].filter((isChecked) => isChecked);

    updatePasswordStrength(charLength, checkedBoxes);
    updateTimeToCrack(charLength, checkedBoxes);
  });
});

// Update the initial character length display
updateCharacterLength();

// Random Logo-letter color changer
const h3 = document.querySelector(".rgb-animation");
const letters = h3.textContent.trim().split("");

h3.innerHTML = "";

letters.forEach((letter) => {
  const span = document.createElement("span");
  span.textContent = letter;
  h3.appendChild(span);
});

setInterval(() => {
  const randomIndex = Math.floor(Math.random() * letters.length);
  const randomLetter = h3.querySelectorAll("span")[randomIndex];
  randomLetter.classList.toggle("letter-animation");
}, 300);

// Function to calculate the number of possible guesses
function calculateGuesses(passwordStrength, numberOfPossibleCharacters, passwordLength) {
  if (passwordStrength === "Weak") {
    return Math.pow(numberOfPossibleCharacters, passwordLength);
  } else if (passwordStrength === "Medium") {
    return Math.pow(numberOfPossibleCharacters, passwordLength) * 1000;
  } else {
    return Math.pow(numberOfPossibleCharacters, passwordLength) * 1000000;
  }
}

// Function to calculate the number of possible characters based on selected checkboxes
function getNumberOfPossibleCharacters(checkedBoxes, includeNumbers, includeSymbols) {
  let numberOfPossibleCharacters = 0;

  if (checkedBoxes.includes(true)) {
    if (includeUppercase) numberOfPossibleCharacters += 26;
    if (includeLowercase) numberOfPossibleCharacters += 26;
    if (includeNumbers) numberOfPossibleCharacters += 10;
    if (includeSymbols) numberOfPossibleCharacters += 8;
  } else {
    // If no character types are selected, assume the weakest scenario
    numberOfPossibleCharacters = 26 + 26 + 10; // Only lowercase, uppercase, and numbers
  }

  return numberOfPossibleCharacters;
}

// Update the time to crack whenever password strength changes
function updateTimeToCrack(charLength, checkedBoxes, includeNumbers, includeSymbols) {
  const passwordStrength = getPasswordStrength(charLength, checkedBoxes);
  const numberOfPossibleCharacters = getNumberOfPossibleCharacters(checkedBoxes, includeNumbers, includeSymbols);
  const guesses = calculateGuesses(passwordStrength, numberOfPossibleCharacters, charLength);
  const timeToCrackText = getTimeToCrackText(guesses);

  const timeToCrackLabel = document.querySelector(".time-to-crack label");
  timeToCrackLabel.textContent = "Time to Crack: " + timeToCrackText;
}


// Function to convert guesses to a human-readable time format
function getTimeToCrackText(guesses) {
// Function to convert guesses to a human-readable time format
function getTimeToCrackText(guesses) {
  if (guesses < 1e3) {
    return "Instant";
  } else if (guesses < 1e6) {
    return "Seconds";
  } else if (guesses < 1e9) {
    return "Minutes";
  } else if (guesses < 1e12) {
    return "Hours";
  } else if (guesses < 1e15) {
    return "Days";
  } else if (guesses < 1e18) {
    return "Years";
  } else if (guesses < 1e21) {
    return "Millennia";
  } else {
    return "Forever";
  }
}

// Update the time to crack initially and whenever password strength changes
updateTimeToCrack(charLengthSlider.value, checkedBoxes);
}

// Update the time to crack initially and whenever password strength changes
updateTimeToCrack(charLengthSlider.value, checkedBoxes);

// Function to convert guesses to a human-readable time format
function getTimeToCrackText(guesses) {
  if (guesses < 1e3) {
    return "Instant";
  } else if (guesses < 1e6) {
    return "Seconds";
  } else if (guesses < 1e9) {
    return "Minutes";
  } else if (guesses < 1e12) {
    return "Hours";
  } else if (guesses < 1e15) {
    return "Days";
  } else if (guesses < 1e18) {
    return "Years";
  } else if (guesses < 1e21) {
    return "Millennia";
  } else {
    return "Forever";
  }
}

// Update the time to crack whenever password strength changes
function updateTimeToCrack(charLength, checkedBoxes, includeNumbers, includeSymbols) {
  const passwordStrength = getPasswordStrength(charLength, checkedBoxes);
  const numberOfPossibleCharacters = getNumberOfPossibleCharacters(checkedBoxes, includeNumbers, includeSymbols);
  const guesses = calculateGuesses(passwordStrength, numberOfPossibleCharacters, charLength);
  const timeToCrackText = getTimeToCrackText(guesses);

  const timeToCrackLabel = document.getElementById("time-text");
  timeToCrackLabel.textContent = "Approximately " + timeToCrackText;
}

