// function convertHTMLtoPDF() {
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF("l", "mm", [1500, 1400]);
//     const pdfjs = document.getElementById("webPage");

//     doc.html(pdfjs, {
//         x: 12,
//         y: 12 
//     })
//         .then(() => {
//             doc.save("newpdf.pdf");
//         })
//         .catch(error => {
//             console.error("Error generating PDF:", error);
//         });
// }
