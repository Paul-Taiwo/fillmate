/**
 * File handling utilities for autofill
 */

/**
 * Converts a data URL string back into a File object.
 */
export async function dataUrlToFile(
  dataUrl: string,
  filename: string
): Promise<File | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    return null;
  }
}

/**
 * Programmatically assigns a File object to a file input element.
 */
export const assignFileToInput = (fileInput: HTMLInputElement, file: File) => {
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Dispatch events to mimic user interaction
    const changeEvent = new Event("change", { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    const inputEvent = new Event("input", { bubbles: true }); // Some frameworks might need this
    fileInput.dispatchEvent(inputEvent);
  } catch (error) {
    // Silent error handling
  }
};
