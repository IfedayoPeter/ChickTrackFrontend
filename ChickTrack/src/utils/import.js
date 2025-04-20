import axios from 'axios';
import * as XLSX from 'xlsx'; // Updated to use named import

/**
 * Convert an Excel file to JSON.
 * @param {File} file - The Excel file to convert.
 * @returns {Promise<Array>} - A promise that resolves to the JSON data.
 */
const excelToJson = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);

            // Process each record to ensure proper formatting
            const processedData = json.map((record) => {
                const parsedDate = XLSX.SSF.parse_date_code(record.date);
                const formattedDate = parsedDate
                    ? `${parsedDate.y}-${String(parsedDate.m).padStart(2, '0')}-${String(parsedDate.d).padStart(2, '0')}T${String(parsedDate.H).padStart(2, '0')}:${String(parsedDate.M).padStart(2, '0')}:${String(parsedDate.S).padStart(2, '0')}`
                    : null;

                return {
                    ...record,
                    code: '', // Add code field as an empty string
                    amount: parseFloat(record.amount || 0).toFixed(2), // Ensure amount is a decimal
                    bagsBought: parseFloat(record.bagsBought || 0).toFixed(2), // Ensure bagsBought is a decimal
                    date: formattedDate, // Convert Excel date to ISO string
                };
            });

            resolve(processedData);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Import data to the Feed Inventory API.
 * @param {File} file - The Excel file to import.
 * @returns {Promise} - Axios response promise.
 */
export const importFeedInventory = async (file) => {
    const url = 'https://chicktrack.runasp.net/api/FeedInventory/import';
    try {
        const jsonData = await excelToJson(file);
        const response = await axios.post(url, jsonData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error importing feed inventory:', error);
        throw error;
    }
};

/**
 * Import data to the Sale Record API.
 * @param {File} file - The Excel file to import.
 * @returns {Promise} - Axios response promise.
 */
export const importSaleRecord = async (file) => {
    const url = 'https://chicktrack.runasp.net/api/SaleRecord/import';
    try {
        const jsonData = await excelToJson(file);
        const response = await axios.post(url, jsonData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error importing sale record:', error);
        throw error;
    }
};
