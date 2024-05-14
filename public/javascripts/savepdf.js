function convertHTMLtoPDF() {
    const divList = document.querySelectorAll(".saveToPDF");
    if (window.html2canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF(); // Create a PDF instance outside the loop
        
        const promises = [];
        divList.forEach((div, index) => {
            if (div.style.display !== "none") { // Check if the element is displayed
                div.style.position = "absolute";
                div.style.top = "0px";
                div.style.left = "0px";
                div.style.width = "500px";
                div.style.height = "500px";

                promises.push(
                    html2canvas(div, { 
                        scale: 1, // Retain original size
                        windowWidth: div.offsetWidth, // Capture only visible part
                        windowHeight: div.offsetHeight,
                        x: div.getBoundingClientRect().left, // Capture from the left of the element
                        y: div.getBoundingClientRect().top // Capture from the top of the element
                    })
                        .then((canvas) => {
                            const imgData = canvas.toDataURL("image/png");
                            if (index > 0) {
                                pdf.addPage(); // Add a new page for each div except the first one
                            }
                            pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                        })
                        .catch((error) => {
                            console.error(`Error capturing div ${index + 1}:`, error);
                        })
                );
            }
        });

        Promise.all(promises).then(() => {
            pdf.save("test.pdf"); // Save the PDF after all images are added
        });
    }
}
