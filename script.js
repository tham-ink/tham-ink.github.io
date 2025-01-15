document.querySelectorAll(".column img").forEach((img) => {
    img.addEventListener("click", () => {
        // Create the popup container
        const popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        popup.style.display = "flex";
        popup.style.flexDirection = "column"; // Stack the image and text
        popup.style.alignItems = "center";
        popup.style.justifyContent = "center";
        popup.style.zIndex = "9999";

        // Create the full-size image
        const fullImage = document.createElement("img");
        fullImage.src = img.src; // Use the same image source
        fullImage.style.maxWidth = "90vw";
        fullImage.style.maxHeight = "80vh";
        fullImage.style.border = "5px solid white";
        fullImage.style.borderRadius = "10px";
        fullImage.style.objectFit = "contain";

        // Create a caption for the image
        const caption = document.createElement("p");
        caption.textContent = img.alt || "Image description"; // Use the 'alt' attribute as the caption
        caption.style.color = "white";
        caption.style.fontSize = "18px";
        caption.style.marginTop = "10px";
        caption.style.textAlign = "center";

        // Close popup when clicking outside the image or text
        popup.addEventListener("click", () => popup.remove());

        // Add the image and caption to the popup
        popup.appendChild(fullImage);
        popup.appendChild(caption);

        // Add the popup to the body
        document.body.appendChild(popup);
    });
});
