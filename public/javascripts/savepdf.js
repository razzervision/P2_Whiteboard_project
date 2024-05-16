function convertHTMLtoPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("l", "mm", [1500, 1400]);
    const pdfjs = document.getElementById("webPage");
    if(window.html2canvas){
        html2canvas(pdfjs).then((canvas) => {
            const imgData = canvas.toDataURL("image/png"); // or 'image/jpeg' for different format

            // Calculate width based on aspect ratio of the element
            const imgWidth = (doc.internal.pageSize.getWidth() - 24); // 24 for 12mm margins on each side
            const imgHeight = canvas.height * imgWidth / canvas.width; 

            doc.addImage(imgData, "PNG", 12, 12, imgWidth, imgHeight);
            doc.save("newpdf.pdf"); 
        }).catch(error => {
            console.error("Error generating PDF:", error);
        });
    } else{
        console.error("html2canvas failed to load");
    }

}