document.addEventListener("mouseup", handleSelection);

function handleSelection() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    showOptionsWindow(selectedText);
  } else {
    hideOptionsWindow();
  }
}

function createNoteInGoogleKeep(title = "title", content) {
  const keepUrl = "https://keep.google.com/";
  const encodedTitle = encodeURIComponent(title);
  const encodedContent = encodeURIComponent(content);
  const newNoteUrl = `${keepUrl}?title=${encodedTitle}&content=${encodedContent}`;
  window.open(newNoteUrl, "_blank");
}

async function askChatGPT(inputText) {
  const apiKey = "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";
  const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";

  const prompt = `Q: ${inputText}\nA:`;

  const body = {
    prompt,
    max_tokens: 50, // Adjust the desired length of the response
    temperature: 0.7, // Adjust the level of randomness in the response
    stop: "\n", // Stop generation after the first line break
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("ChatGPT API request failed.");
    }

    const { choices } = await response.json();
    const answer = choices[0].text.trim();

    // Do something with the generated answer
    console.log("ChatGPT answer:", answer);
    // You can display the answer in the options window or perform any other action
  } catch (error) {
    console.error("Error:", error);
    // Handle errors gracefully and display an error message, if needed
  }
}

function showOptionsWindow(selectedText) {
  const optionsWindow = document.createElement("div");
  optionsWindow.className = "selection-options";

  const shareButton = document.createElement("button");
  shareButton.innerText = "Share to WhatsApp";
  shareButton.addEventListener("click", () => {
    // Implement WhatsApp sharing logic
    const encodedText = encodeURIComponent(selectedText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  });
  optionsWindow.appendChild(shareButton);

  const translateButton = document.createElement("button");
  translateButton.innerText = "Translate";
  translateButton.addEventListener("click", () => {
    // Implement translation logic
    // You can use a translation API or service here
    // Example: Google Translate API
    const encodedText = encodeURIComponent(selectedText);
    const translationUrl = `https://translate.google.com/?text=${encodedText}`;
    window.open(translationUrl, "_blank");
  });
  optionsWindow.appendChild(translateButton);

  const defineButton = document.createElement("button");
  defineButton.innerText = "Define";
  defineButton.addEventListener("click", () => {
    // Implement definition logic
    // You can use a dictionary API or service here
    // Example: Oxford Dictionaries API
    const encodedText = encodeURIComponent(selectedText);
    const definitionUrl = `https://www.oxfordlearnersdictionaries.com/definition/english/${encodedText}`;
    window.open(definitionUrl, "_blank");
  });
  optionsWindow.appendChild(defineButton);

  const chatButton = document.createElement("button");
  chatButton.innerText = "Ask ChatGPT";
  chatButton.addEventListener("click", () => {
    askChatGPT(selectedText);
  });
  optionsWindow.appendChild(chatButton);

  const keepNotesButton = document.createElement("button");
  keepNotesButton.innerText = "Add to Keep Notes";
  keepNotesButton.addEventListener("click", () => {
    createNoteInGoogleKeep(selectedText);
  });
  optionsWindow.appendChild(keepNotesButton);

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  optionsWindow.style.top = `${rect.top + window.pageYOffset}px`;
  optionsWindow.style.left = `${rect.right + window.pageXOffset}px`;

  document.body.appendChild(optionsWindow);
}

function hideOptionsWindow() {
  const optionsWindow = document.querySelector(".selection-options");
  if (optionsWindow) {
    optionsWindow.remove();
  }
}
