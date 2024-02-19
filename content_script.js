document.addEventListener("mouseup", handleSelection);

function handleSelection() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    showOptionsWindow(selectedText);
  } else {
    hideOptionsWindow();
  }
}

function showOptionsWindow(selectedText) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "container";

  const optionsWindow = document.createElement("div");
  optionsWindow.className = "selection-options";

  const defineButton = document.createElement("button");
  defineButton.innerText = "Define";
  defineButton.addEventListener("click", async () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      try {
        const response = await fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" + selectedText
        );
        const data = await response.json();
        if (data.title) {
          console.error("Error:", data.title);
        } else {
          const existingDefinitionWindow =
            containerDiv.querySelector(".definition-window");
          if (existingDefinitionWindow) {
            existingDefinitionWindow.remove();
          }
          const definitionWindow = document.createElement("div");
          definitionWindow.className = "definition-window";
          definitionWindow.style.position = "absolute";
          const rect = window
            .getSelection()
            .getRangeAt(0)
            .getBoundingClientRect();
          definitionWindow.style.position = "fixed"; 
          definitionWindow.style.top = "20px"; 
          definitionWindow.style.right = "20px"; 

          if (data) {
            for (let i = 0; i < Math.min(2, data.length); i++) {
              const item = data[i];
              const wordMeaning = document.createElement("div");
              wordMeaning.className = "wordMeaning";
              const wordDiv = document.createElement("div");
              wordDiv.className = "word";
              const h2 = document.createElement("h2");
              h2.innerText = selectedText;
              wordDiv.appendChild(h2);
              wordMeaning.appendChild(wordDiv);
              const hr = document.createElement("hr");
              wordMeaning.appendChild(hr);
              const detailsDiv = document.createElement("div");
              detailsDiv.className = "details";
              const partOfSpeech = document.createElement("p");
              partOfSpeech.innerText = item.meanings[0].partOfSpeech;
              detailsDiv.appendChild(partOfSpeech);
              const phonetic = document.createElement("p");
              phonetic.innerText = `/${item.phonetic}/`;
              detailsDiv.appendChild(phonetic);
              wordMeaning.appendChild(detailsDiv);
              const definitionP = document.createElement("p");
              definitionP.className = "word-meaning";
              definitionP.innerText =
                item.meanings[0].definitions[0].definition;
              wordMeaning.appendChild(definitionP);
              const exampleP = document.createElement("p");
              exampleP.className = "word-example";
              exampleP.innerText =
                item.meanings[0].definitions[0].example || "";
              wordMeaning.appendChild(exampleP);
              const hr2 = document.createElement("hr");
              wordMeaning.appendChild(hr2);
              definitionWindow.appendChild(wordMeaning);
            }
          }
          containerDiv.appendChild(definitionWindow);
          optionsWindow.remove();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("No text selected");
    }
  });

  const generateQRButton = document.createElement("button");
  generateQRButton.innerText = "Generate QR";
  generateQRButton.addEventListener("click", async () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      selectedText
    )}`;
    const qrResponse = await fetch(qrUrl);
    const qrBlob = await qrResponse.blob();
    const qrImage = URL.createObjectURL(qrBlob);
    showQRImage(qrImage);
  });

  optionsWindow.appendChild(defineButton);
  optionsWindow.appendChild(generateQRButton); 
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  optionsWindow.style.top = `${rect.top + window.pageYOffset}px`;
  optionsWindow.style.left = `${rect.right + window.pageXOffset}px`;

  containerDiv.appendChild(optionsWindow);
  document.body.appendChild(containerDiv);

  
  const clickHandler = (event) => {
    if (!containerDiv.contains(event.target)) {
      hideOptionsWindow(containerDiv);
      hideQRImage();
      document.removeEventListener("click", clickHandler);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", clickHandler);
  }, 0);
}

function hideOptionsWindow(containerDiv) {
  if (containerDiv) {
    containerDiv.remove();
  }
}
function hideQRImage() {
  const qrImageContainer = document.querySelector(".qr-image-container");
  if (qrImageContainer) {
    qrImageContainer.remove();
  }
}

function showQRImage(qrImageUrl) {
  const qrImageContainer = document.createElement("div");
  qrImageContainer.className = "qr-image-container";

  const qrImage = document.createElement("img");
  qrImage.src = qrImageUrl;
  qrImage.alt = "QR Code";

  qrImageContainer.appendChild(qrImage);
  document.body.appendChild(qrImageContainer);
  qrImageContainer.style.position = "fixed";
  qrImageContainer.style.top = "20px"; 
  qrImageContainer.style.right = "20px"; 
  qrImageContainer.style.zIndex = "9999";
  qrImageContainer.style.backgroundColor = "#333333";
  qrImageContainer.style.margin = "10px";
}
