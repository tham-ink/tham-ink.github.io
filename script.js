document.querySelectorAll(".column img").forEach((img) => {
    img.addEventListener("click", () => {
        // Create popup container
        const popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        popup.style.display = "flex";
        popup.style.alignItems = "center";
        popup.style.justifyContent = "center";
        popup.style.zIndex = "9999";

        // Create the full-size image
        const fullImage = document.createElement("img");
        fullImage.src = img.src; // Use the same image source
        fullImage.style.maxWidth = "90vw"; // Scale image to fit the viewport width
        fullImage.style.maxHeight = "90vh"; // Scale image to fit the viewport height
        fullImage.style.width = "auto"; // Maintain aspect ratio
        fullImage.style.height = "auto"; // Maintain aspect ratio
        fullImage.style.border = "5px solid white";
        fullImage.style.borderRadius = "10px";

        // Close popup when clicked
        popup.addEventListener("click", () => popup.remove());

        // Append the image to the popup container
        popup.appendChild(fullImage);

        // Add the popup to the body
        document.body.appendChild(popup);
    });
});