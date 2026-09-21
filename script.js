const fileInput = document.getElementById("fileInput");

const chooseButton =
    document.getElementById("chooseButton");

const uploadArea =
    document.getElementById("uploadArea");

const fileSection =
    document.getElementById("fileSection");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const removeButton =
    document.getElementById("removeButton");

const convertButton =
    document.getElementById("convertButton");

const status =
    document.getElementById("status");

const adModal =
    document.getElementById("adModal");

const adNumber =
    document.getElementById("adNumber");

const timer =
    document.getElementById("timer");

const continueButton =
    document.getElementById("continueButton");


let selectedFile = null;

let currentAd = 1;

let countdown;


chooseButton.onclick = () => {

    fileInput.click();

};


fileInput.onchange = () => {

    handleFile(fileInput.files[0]);

};


function handleFile(file) {

    if (!file) return;


    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        alert("Please select a PDF file.");

        return;

    }


    selectedFile = file;


    fileName.textContent = file.name;

    fileSize.textContent =
        formatFileSize(file.size);


    uploadArea.classList.add("hidden");

    fileSection.classList.remove("hidden");

}


function formatFileSize(bytes) {

    if (bytes < 1024)
        return bytes + " B";

    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + " KB";

    return (bytes / 1024 / 1024).toFixed(1) + " MB";

}


removeButton.onclick = () => {

    selectedFile = null;

    fileInput.value = "";

    fileSection.classList.add("hidden");

    uploadArea.classList.remove("hidden");

};


convertButton.onclick = () => {

    if (!selectedFile) {

        alert("Please select a PDF first.");

        return;

    }


    currentAd = 1;

    showAdvertisement();

};


function showAdvertisement() {

    adNumber.textContent =
        `Advertisement ${currentAd} of 2`;

    continueButton.disabled = true;

    adModal.classList.remove("hidden");


    let seconds = 10;

    timer.textContent =
        seconds + " seconds";


    clearInterval(countdown);


    countdown = setInterval(() => {

        seconds--;

        timer.textContent =
            seconds + " seconds";


        if (seconds <= 0) {

            clearInterval(countdown);

            timer.textContent =
                "Ad completed";

            continueButton.disabled = false;

        }

    }, 1000);

}


continueButton.onclick = () => {

    if (currentAd === 1) {

        currentAd = 2;

        showAdvertisement();

    }

    else {
    adModal.classList.add("hidden");

    status.textContent = "Converting your PDF...";

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://127.0.0.1:5000/convert", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Conversion failed");
        }

        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "converted.docx";

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

        status.textContent = "Conversion completed! Download started.";
    })
    .catch(error => {
        console.error(error);
        status.textContent =
            "Something went wrong during conversion.";
    });
}

};