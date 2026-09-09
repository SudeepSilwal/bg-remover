"use strict";

/*
 * RemoveBG Frontend
 * API: https://api.sudeepsilwal.com.np/bg-remover
 */

const API_URL = "https://api.sudeepsilwal.com.np/bg-remover";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


/* =========================================================
   LOGGER
========================================================= */

const log = {
  info(...args) {
    console.log(
      "%c[RemoveBG] INFO",
      "color:#ff7a1a;font-weight:bold",
      ...args
    );
  },

  success(...args) {
    console.log(
      "%c[RemoveBG] SUCCESS",
      "color:#22c55e;font-weight:bold",
      ...args
    );
  },

  warn(...args) {
    console.warn(
      "%c[RemoveBG] WARNING",
      "color:#f59e0b;font-weight:bold",
      ...args
    );
  },

  error(...args) {
    console.error(
      "%c[RemoveBG] ERROR",
      "color:#ef4444;font-weight:bold",
      ...args
    );
  },
};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const chooseButton = document.getElementById("chooseButton");

const previewScrollButton = document.getElementById(
  "previewScrollButton"
);

const previewSection = document.getElementById(
  "previewSection"
);
const previewImage = document.getElementById("previewImage");

const removeBackgroundButton = document.getElementById(
  "removeBackgroundButton"
);

const processingSection = document.getElementById(
  "processingSection"
);

const resultSection = document.getElementById(
  "resultSection"
);

const resultImage = document.getElementById(
  "resultImage"
);

const downloadButton = document.getElementById(
  "downloadButton"
);

const errorMessage = document.getElementById(
  "errorMessage"
);



/* =========================================================
   INITIALIZATION CHECK
========================================================= */

log.info("Frontend initialized");
log.info("API endpoint:", API_URL);
log.info(
  "Maximum file size:",
  `${MAX_FILE_SIZE / 1024 / 1024}MB`
);

if (!uploadArea) {
  log.error("uploadArea element not found");
}

if (!fileInput) {
  log.error("fileInput element not found");
}

if (!chooseButton) {
  log.error("chooseButton element not found");
}

if (!previewSection) {
  log.error("previewSection element not found");
}

if (!removeBackgroundButton) {
  log.error("removeBackgroundButton element not found");
}

if (!processingSection) {
  log.error("processingSection element not found");
}

if (!resultSection) {
  log.error("resultSection element not found");
}

if (!downloadButton) {
  log.error("downloadButton element not found");
}


/* =========================================================
   STATE
========================================================= */

let selectedFile = null;
let previewObjectUrl = null;
let resultObjectUrl = null;


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showError(message) {
  log.error(message);

  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = message;
  errorMessage.hidden = false;
}


function clearError() {
  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = "";
  errorMessage.hidden = true;
}


/* =========================================================
   SECTION HELPERS
========================================================= */

function hideAllSections() {
  if (previewSection) {
    previewSection.hidden = true;
  }

  if (processingSection) {
  setTimeout(() => {
    const y =
      processingSection.getBoundingClientRect().top +
      window.pageYOffset -
      80

    window.scrollTo({
      top: y,
      behavior: "smooth",
    })
  }, 100)
}

  if (resultSection) {
    resultSection.hidden = true;
  }
}


function showPreviewSection() {
  hideAllSections();

  if (previewSection) {
    previewSection.hidden = false;
  }
}


function showProcessingSection() {
  hideAllSections();

  if (processingSection) {
    processingSection.hidden = false;
  }
}


function showResultSection() {
  hideAllSections();

  if (resultSection) {
    resultSection.hidden = false;
  }
}


/* =========================================================
   FILE VALIDATION
========================================================= */

function validateFile(file) {
  if (!file) {
    showError("No image selected.");
    return false;
  }

  log.info("Processing selected file");
  log.info("File name:", file.name);
  log.info("File type:", file.type);
  log.info(
    "File size:",
    `${(file.size / 1024).toFixed(2)} KB`
  );

  if (!ALLOWED_TYPES.includes(file.type)) {
    log.warn("Invalid image type:", file.type);

    showError(
      "Please upload a JPG, PNG, or WebP image."
    );

    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    log.warn("File exceeds maximum size");

    showError(
      "Image is too large. Maximum file size is 10MB."
    );

    return false;
  }

  if (file.size === 0) {
    showError("The selected image is empty.");

    return false;
  }

  log.info("Image validation: PASSED");

  return true;
}


/* =========================================================
   FILE SELECTION
========================================================= */

function handleFile(file) {
  clearError();

  if (!file) {
    log.warn("No file received");
    return;
  }

  if (!validateFile(file)) {
    return;
  }

  selectedFile = file;

  log.success("File validation passed");

  createPreview(file);

  showPreviewSection();
}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function createPreview(file) {
  if (!previewImage) {
    log.error("Preview image element not found");
    return;
  }

  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
  }

  previewObjectUrl = URL.createObjectURL(file);

  previewImage.src = previewObjectUrl;

  previewImage.alt =
    `Preview of uploaded image ${file.name}`;

  log.success("Image preview created");
}


/* =========================================================
   CHOOSE IMAGE
========================================================= */

function openFilePicker() {
  if (!fileInput) {
    log.error("Cannot open file picker: fileInput missing");
    return;
  }

  log.info("Opening file picker");

  fileInput.click();
}


/* =========================================================
   CHOOSE BUTTON
========================================================= */

if (chooseButton) {
  chooseButton.addEventListener("click", function (event) {
    /*
     * Important:
     * Prevent this click from bubbling to uploadArea.
     */

    event.preventDefault();
    event.stopPropagation();

    log.info("Choose Image button clicked");

    openFilePicker();
  });
}


/* =========================================================
   UPLOAD AREA CLICK
========================================================= */

if (uploadArea) {
  uploadArea.addEventListener("click", function (event) {

    /*
     * If the actual button was clicked,
     * don't open the picker again.
     */

    if (
      event.target === chooseButton ||
      chooseButton?.contains(event.target)
    ) {
      return;
    }

    log.info("Upload area clicked");

    openFilePicker();
  });
}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

if (uploadArea) {
  uploadArea.addEventListener("keydown", function (event) {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      log.info(
        "Upload area activated by keyboard"
      );

      openFilePicker();
    }
  });
}


/* =========================================================
   FILE INPUT CHANGE
========================================================= */

if (fileInput) {
  fileInput.addEventListener(
    "change",
    function (event) {

      log.info("File input changed");

      const files = event.target.files;

      if (!files || files.length === 0) {
        log.warn("No file selected");

        return;
      }

      const file = files[0];

      handleFile(file);

      /*
       * Reset input so selecting the same file again
       * triggers the change event.
       */

      fileInput.value = "";
    }
  );
}


/* =========================================================
   DRAG ENTER
========================================================= */

if (uploadArea) {
  uploadArea.addEventListener(
    "dragenter",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      uploadArea.classList.add("drag-over");

      log.info("Drag entered upload area");
    }
  );
}


/* =========================================================
   DRAG OVER
========================================================= */

if (uploadArea) {
  uploadArea.addEventListener(
    "dragover",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      /*
       * Required so the browser allows dropping.
       */

      event.dataTransfer.dropEffect = "copy";

      uploadArea.classList.add("drag-over");
    }
  );
}


/* =========================================================
   DRAG LEAVE
========================================================= */

if (uploadArea) {
  uploadArea.addEventListener(
    "dragleave",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      uploadArea.classList.remove("drag-over");

      log.info("Drag left upload area");
    }
  );
}


/* =========================================================
   DROP
========================================================= */

if (uploadArea) {
  uploadArea.addEventListener(
    "drop",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      uploadArea.classList.remove("drag-over");

      log.info("File dropped");

      const files = event.dataTransfer.files;

      if (!files || files.length === 0) {
        log.warn("No files found in drop");

        showError(
          "Please drop an image file."
        );

        return;
      }

      if (files.length > 1) {
        log.warn(
          "Multiple files dropped. Using first file."
        );
      }

      handleFile(files[0]);
    }
  );
}


/* =========================================================
   REMOVE BACKGROUND
========================================================= */

if (removeBackgroundButton) {
  removeBackgroundButton.addEventListener(
    "click",
    async function (event) {

      event.preventDefault();
      event.stopPropagation();

      clearError();

      if (!selectedFile) {
        showError(
          "Please select an image first."
        );

        return;
      }

      await removeBackground();
    }
  );
}


/* =========================================================
   API REQUEST
========================================================= */

async function removeBackground() {

  const startTime = performance.now();

  log.info("===============================");
  log.info("Starting background removal");

  log.info(
    "File:",
    selectedFile.name
  );

  log.info(
    "Size:",
    `${(selectedFile.size / 1024).toFixed(2)} KB`
  );

  log.info(
    "Type:",
    selectedFile.type
  );

  log.info(
    "API:",
    API_URL
  );


  showProcessingSection();


  try {

    /* ---------------------------------------------
       CREATE FORM DATA
    --------------------------------------------- */

    const formData = new FormData();

    formData.append(
      "image",
      selectedFile,
      selectedFile.name
    );

    log.info("FormData created");

    log.info(
      "Sending multipart/form-data request"
    );


    /* ---------------------------------------------
       API REQUEST
    --------------------------------------------- */

    const response = await fetch(
      API_URL,
      {
        method: "POST",
        body: formData
      }
    );


    const responseTime =
      performance.now() - startTime;


    log.info(
      "API response received"
    );

    log.info(
      "Response time:",
      `${Math.round(responseTime)}ms`
    );

    log.info(
      "HTTP status:",
      response.status
    );

    log.info(
      "HTTP status text:",
      response.statusText
    );


    const contentType =
      response.headers.get("content-type") || "";


    log.info(
      "Content-Type:",
      contentType
    );


    /* ---------------------------------------------
       HTTP ERROR
    --------------------------------------------- */

    if (!response.ok) {

      let serverMessage = "";

      try {
        serverMessage = await response.text();
      } catch (readError) {
        log.warn(
          "Could not read error response",
          readError
        );
      }


      log.error(
        "API request failed",
        response.status,
        serverMessage
      );


      if (response.status === 400) {

        showError(
          "Invalid image request. Please try another image."
        );

      } else if (response.status === 413) {

        showError(
          "Image is too large. Maximum file size is 10MB."
        );

      } else if (response.status === 429) {

        showError(
          "Too many requests. Please wait and try again."
        );

      } else if (response.status === 500) {

        showError(
          "The image-processing server encountered an error."
        );

      } else if (response.status === 503) {

        showError(
          "All background-removal providers are currently unavailable. Please try again later."
        );

      } else {

        showError(
          `Background removal failed (HTTP ${response.status}).`
        );
      }


      hideAllSections();

      return;
    }


    /* ---------------------------------------------
       CHECK RESPONSE TYPE
    --------------------------------------------- */

    if (
      !contentType.toLowerCase().includes("image/")
    ) {

      log.error(
        "Unexpected response type:",
        contentType
      );


      const text = await response.text();

      log.error(
        "Unexpected server response:",
        text
      );


      showError(
        "The server returned an unexpected response."
      );


      hideAllSections();

      return;
    }


    /* ---------------------------------------------
       READ IMAGE
    --------------------------------------------- */

    log.info("Reading image response...");

    const blob = await response.blob();

    log.info("Response blob received");

    log.info(
      "Blob type:",
      blob.type
    );

    log.info(
      "Blob size:",
      `${(blob.size / 1024).toFixed(2)} KB`
    );


    if (!blob.size) {

      log.error(
        "Received empty image"
      );

      showError(
        "The server returned an empty image."
      );

      hideAllSections();

      return;
    }


    /* ---------------------------------------------
       CREATE RESULT URL
    --------------------------------------------- */

    if (resultObjectUrl) {
      URL.revokeObjectURL(resultObjectUrl);
    }

    resultObjectUrl =
      URL.createObjectURL(blob);


    if (resultImage) {

      resultImage.src =
        resultObjectUrl;

      resultImage.alt =
        `Background removed from ${selectedFile.name}`;
    }


    showResultSection();


    /* ---------------------------------------------
       SUCCESS
    --------------------------------------------- */

    const totalTime =
      performance.now() - startTime;


    log.success(
      "Background removal successful!"
    );

    log.success(
      "Total processing time:",
      `${Math.round(totalTime)}ms`
    );

    log.success(
      "Output:",
      `${(blob.size / 1024).toFixed(2)} KB`,
      blob.type
    );

    log.info("===============================");


    /*
     * Automatically prepare download.
     */

    prepareDownload(blob);

  } catch (error) {

    const totalTime =
      performance.now() - startTime;


    log.error(
      "Background removal failed:",
      error
    );


    log.error(
      "Error name:",
      error.name
    );


    log.error(
      "Error message:",
      error.message
    );


    log.error(
      "Total time before failure:",
      `${Math.round(totalTime)}ms`
    );


    if (
      error instanceof TypeError
    ) {

      showError(
        "Could not connect to the background-removal API. Check your internet connection or API server and try again."
      );

    } else {

      showError(
        "Something went wrong while removing the background. Please try again."
      );
    }


    hideAllSections();

  } finally {

    log.info(
      "Request finished"
    );

  }
}


/* =========================================================
   PREPARE DOWNLOAD
========================================================= */

function prepareDownload(blob) {

  if (!downloadButton) {
    log.error(
      "Download button not found"
    );

    return;
  }


  const originalName =
    selectedFile?.name ||
    "image";


  const nameWithoutExtension =
    originalName.replace(
      /\.[^/.]+$/,
      ""
    );


  const downloadName =
    `${nameWithoutExtension}-sudeepsilwal.png`;


  log.info(
    "Preparing download:",
    downloadName
  );


  /*
   * Remove old click handler by replacing the button.
   */

  const newDownloadButton =
    downloadButton.cloneNode(true);


  downloadButton.parentNode.replaceChild(
    newDownloadButton,
    downloadButton
  );


  newDownloadButton.addEventListener(
    "click",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      const url =
        URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        downloadName;


      document.body.appendChild(link);

      link.click();

      link.remove();


      setTimeout(
        function () {
          URL.revokeObjectURL(url);
        },
        1000
      );


      log.success(
        "Download started:",
        downloadName
      );
    }
  );
}


/* =========================================================
   PAGE CLEANUP
========================================================= */

window.addEventListener(
  "beforeunload",
  function () {

    if (previewObjectUrl) {
      URL.revokeObjectURL(
        previewObjectUrl
      );
    }

    if (resultObjectUrl) {
      URL.revokeObjectURL(
        resultObjectUrl
      );
    }
  }
);


/* =========================================================
   FINAL READY MESSAGE
========================================================= */

log.success(
  "RemoveBG frontend event handlers ready"
);

function showPreviewScrollButton() {
  if (previewScrollButton) {
    previewScrollButton.hidden = false;
  }
}

function hidePreviewScrollButton() {
  if (previewScrollButton) {
    previewScrollButton.hidden = true;
  }
}

if (previewScrollButton && previewSection) {
  previewScrollButton.addEventListener("click", function () {
    previewSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}