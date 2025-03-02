"use client";

import { useEffect, useState } from "react";
import * as PDFJS from "pdfjs-dist/types/src/pdf";

export const usePDFJS = () => {
  const [pdfjs, setPDFJS] = useState<typeof PDFJS | null>(null);
  const [pdfContent, setPdfContent] = useState<string>("");

  // load the library once on mount (the webpack import automatically sets-up the worker)
  useEffect(() => {
    import("pdfjs-dist/webpack.mjs").then((pdf) => {
      setPDFJS(pdf);
      // Initialize worker
      pdf.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();
    });
  }, []);

  const extractText = async (file: File) => {
    if (!pdfjs) {
      console.error("PDF.js not loaded yet");
      return "";
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;
      let fullText = "";

      // Extract text from all pages
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText;
      }

      // Normalize whitespace: replace multiple spaces, newlines, and tabs with a single space
      const normalizedText = fullText.replace(/\s+/g, " ").trim();
      setPdfContent(normalizedText);
      return normalizedText;
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      return "";
    }
  };

  return {
    extractText,
    pdfContent,
  };
};
