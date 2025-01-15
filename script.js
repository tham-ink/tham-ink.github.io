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
        popup.style.flexDirection = "column";
        popup.style.alignItems = "center";
        popup.style.justifyContent = "center";
        popup.style.zIndex = "9999";

        const fullImage = document.createElement("img");
        fullImage.src = img.src;
        fullImage.style.maxWidth = "90vw";
        fullImage.style.maxHeight = "80vh";
        fullImage.style.border = "5px solid white";
        fullImage.style.borderRadius = "10px";
        fullImage.style.objectFit = "contain";

        const caption = document.createElement("p");
        caption.textContent = img.alt || "Image description";
        caption.style.color = "white";
        caption.style.fontSize = "18px";
        caption.style.marginTop = "10px";
        caption.style.textAlign = "center";

        popup.addEventListener("click", () => popup.remove());

        popup.appendChild(fullImage);
        popup.appendChild(caption);

        document.body.appendChild(popup);
    });
});
