/**
 * turns image string data to file
 * @param {string}  dataURL
 * @param {string} fileName
 * @return {JSX}
 */
function dataURLtoFile(dataURL: string, fileName: string) {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const base64 = atob(arr[1])
    const uint8Array = new Uint8Array(base64.length)

    for (let i = 0; i < base64.length; i++) {
        uint8Array[i] = base64.charCodeAt(i)
    }

    // Create a new File or Blob
    return new File([uint8Array], fileName, { type: mime })
}

export default { dataURLtoFile }
