import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { importFeedInventory, importSaleRecord } from '../../utils/import';

const ImportPage = () => {
    const [importType, setImportType] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleImport = async () => {
        if (!importType || !file) {
            setMessage('Please select an import type and a file.');
            return;
        }

        try {
            setMessage('Importing...');
            if (importType === 'feedInventory') {
                await importFeedInventory(file);
            } else if (importType === 'saleRecord') {
                await importSaleRecord(file);
            }
            setMessage('Import successful!');
        } catch (error) {
            setMessage('Import failed. Please try again.');
        }
    };

    const handleClose = () => {
        navigate('/setup'); // Navigate back to the setup page
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Import Data</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Select Import Type:
                        <select
                            value={importType}
                            onChange={(e) => setImportType(e.target.value)}
                            className="w-full p-2 border rounded mt-1"
                        >
                            <option value="">--Select--</option>
                            <option value="feedInventory">Feed Inventory</option>
                            <option value="saleRecord">Sale Record</option>
                        </select>
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Select File:
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </label>
                </div>
                <button
                    onClick={handleImport}
                    className="w-full py-2 mb-3 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Import
                </button>
                {message && (
                    <p
                        className={`text-center ${
                            message.includes('failed') ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {message}
                    </p>
                )}
                <button
                    onClick={handleClose}
                    className="w-full py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ImportPage;
