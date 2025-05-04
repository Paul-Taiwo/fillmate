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
    console.error("Error converting data URL to file:", error);
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

    console.log(`Assigned file ${file.name} to input`, fileInput);
  } catch (error) {
    console.error(`Error assigning file ${file.name} to input:`, error);
  }
};
