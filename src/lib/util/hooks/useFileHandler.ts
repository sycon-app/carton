import type { ChangeEvent, DragEvent } from "react";

export const downloadTextFile = (fileName: string, fileContent: string) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(fileContent)}`
  );
  element.setAttribute("download", fileName);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const getTextFromFile = async (file: Blob): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.addEventListener("error", () => reject(reader.error));

    reader.readAsText(file);
  });
};

export default function useFileHandler({
  allowedFileTypes,
  badFileTypeCallback,
  fileSuccessCallbad,
}: {
  allowedFileTypes: string[];
  badFileTypeCallback: () => unknown;
  fileSuccessCallbad: (file: File) => unknown;
}) {
  const validateFile = (file: File | null | undefined) => {
    if (!file) return;

    if (!allowedFileTypes.includes(file.type)) {
      badFileTypeCallback();

      return;
    }

    fileSuccessCallbad(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateFile(e.target.files?.[0]);
  };

  const onDragOver = (e: DragEvent<HTMLInputElement | HTMLLabelElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLInputElement | HTMLLabelElement>) => {
    e.preventDefault();

    let file: File | null | undefined;

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
        if (e.dataTransfer.items[i].kind === "file") {
          file = e.dataTransfer.items[i].getAsFile();

          break;
        }
      }
    } else {
      // eslint-disable-next-line prefer-destructuring
      file = e.dataTransfer.files[0];
    }

    validateFile(file);
  };

  return { onChange, onDragOver, onDrop };
}
