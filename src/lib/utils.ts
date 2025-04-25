/**
 * Convert a File object to its base64 representation
 *
 * @param blob File or Blob object
 * @returns promised base64 blob or file
 */
const fileToBase64 = (blob: Blob | File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export { fileToBase64 };
