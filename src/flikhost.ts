let uploadReport: HTMLElement | null = document.getElementById('file-report');
let fileStatus: HTMLElement | null = document.getElementById('file-status');
let imageElement = document.getElementById('image') as HTMLImageElement | null;
let fileNameAnchor = document.getElementById('file-name') as HTMLAnchorElement | null
let uploadText: HTMLElement | null = document.getElementById('hosted-text')

export function reloadReferencesFlikhost(): void {
    uploadReport = document.getElementById('file-report') as HTMLElement | null;
    fileStatus = document.getElementById('file-status') as HTMLElement | null;
    imageElement = document.getElementById('image') as HTMLImageElement | null;
    fileNameAnchor = document.getElementById('file-name') as HTMLAnchorElement | null
    uploadText = document.getElementById('hosted-text') as HTMLElement | null

}

function uploadImage(event: Event, websiteName: string, apiKey: string): void {
    event.preventDefault();
    const input = event.target as HTMLFormElement;
    const image: File | undefined = (input.elements[0] as HTMLInputElement).files?.[0];
    const formData = new FormData();
    if (!image) {
        console.log("No image");
        return;
    }
    formData.append("imageUpload", image);
    formData.append("websiteName", websiteName);
    formData.append("apiKey", apiKey);

    fetch('https://api.flik.host/upload.php', {
        method: 'POST',
        body: formData,
    })
    .then(async (response) => {
        const text = await response.text();
        if (!uploadReport || !uploadText || !fileNameAnchor || !fileStatus || !imageElement){
            return;
        }
        
        uploadReport.classList.add("flex")
        uploadReport.classList.remove("hidden")
        try {
            //throw new Error("I said so");
            const result: any = JSON.parse(text);

            if (result.success) {
                if (fileStatus.classList.contains('text-red-500')){
                    fileStatus.classList.add("text-green-500");
                    fileStatus.classList.remove("text-red-500");
                    fileNameAnchor.classList.remove("hidden");
                    imageElement.classList.remove("hidden");
                    fileStatus.innerText = "File uploaded sucessfully!";
                    uploadText.innerText = "This image is now hosted on the flikhost website that I created!"
                }

                let realLink: string = result.link.replace("api.", "")
                let fileName: string = result.link.replace("https://api.flik.host/images/", "")
                fileNameAnchor.innerText = fileName
                fileNameAnchor.href = realLink
                imageElement.src = realLink

            } else {
                console.log("Post failed", result)
                fileStatus.classList.remove("text-green-500")
                fileStatus.classList.add("text-red-500")
                fileStatus.innerText = "File upload failed :\\";
                fileNameAnchor.classList.add("hidden")
                imageElement.classList.add("hidden")
                uploadText.innerText = result.message
            }
        } catch (e) {
            console.log("Server error")
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

(window as any).uploadImage = uploadImage