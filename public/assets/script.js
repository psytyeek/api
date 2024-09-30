async function loadOptions() {
  try {
    // Fetch the JSON file from the external URL
    const response = await fetch(
      "https://muftukmallapi.koyeb.app/api/batch/neet-2025-1818"
    );
    const options = await response.json();

    // Get the dropdown element
    const dropdown = document.getElementById("optionsDropdown");

    // Loop through the options and create <option> elements
    options.Data.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.slug;
      opt.textContent = option.name;
      dropdown.appendChild(opt);
    });
  } catch (error) {
    console.error("Error fetching the JSON:", error);
  }
}

// Function to update the selected option text
function updateSelectedText() {
  const dropdown = document.getElementById("optionsDropdown");
  const selectedTextElement = document.getElementById("subjectText");

  // Get the selected option text and value
  const selectedOptionText = dropdown.options[dropdown.selectedIndex].text;
  selectedTextElement.innerHTML = `<strong>${selectedOptionText}</strong>`;
}

// Load options when the page loads
window.onload = function () {
  loadOptions();

  const submitButton = document.getElementById("Btn");
  const videoInput = document.getElementById("video-input");
  const noteInput = document.getElementById("note-input");
  const dppInput = document.getElementById("dpp-input");

  // Attach the click event listener to the submit button

  try {
    submitButton.addEventListener("click", () => {
      const dropdown = document.getElementById("optionsDropdown");
      const selectedOptionValue = dropdown.value; // Get selected dropdown value

      // Prepare data to be sent
      const obj = {
        videoData: videoInput.value,
        noteData: noteInput.value,
        dppData: dppInput.value,
        subject: selectedOptionValue,
      };

      fetch("/data", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(obj),
      });

      document.getElementById("video-input").value = "";
      document.getElementById("note-input").value = "";
      document.getElementById("dpp-input").value = "";

      alert("Chapter Added")

      // Optional: Prevent default behavior if it's inside a form
      event.preventDefault();
    });

    // Add an event listener to detect changes in the dropdown
    const dropdown = document.getElementById("optionsDropdown");
    dropdown.addEventListener("change", updateSelectedText);
  } catch (error) {
    console.log(error);
  }
};
