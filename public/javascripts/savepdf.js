function convertHTMLtoPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("l", "mm", [1500, 1400]);
    const pdfjs = document.getElementById("webPage");

    doc.html(pdfjs, {
        callback: function(doc) {
            doc.save("newpdf.pdf");
        },
        x: 12,
        y: 12
    });			 
}	 