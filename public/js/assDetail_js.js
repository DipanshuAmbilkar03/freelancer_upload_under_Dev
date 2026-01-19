function openPdfModal(path) {
    const modal = document.getElementById("pdfModal");
    const viewer = document.getElementById("pdfViewer");
    viewer.src = path;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closePdfModal() {
    const modal = document.getElementById("pdfModal");
    const viewer = document.getElementById("pdfViewer");
    viewer.src = "";
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Optional: Close modal by clicking outside
  window.addEventListener("click", function(e) {
    const modal = document.getElementById("pdfModal");
    if (e.target === modal) closePdfModal();
  });