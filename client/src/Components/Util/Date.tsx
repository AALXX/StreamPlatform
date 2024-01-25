/**
 * formats date to dd:mm::yy
 * @param {string} isoDate 
 * @return {string}
 */
const formatDateToDDMMYY = (isoDate: string): string => {
    const date = new Date(isoDate);

    // Extract day, month, and year components
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-4); // Get last two digits of year

    return `${day}.${month}.${year}`;
}

export default formatDateToDDMMYY