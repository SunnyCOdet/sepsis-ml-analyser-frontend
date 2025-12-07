import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Results from './components/Results';
import PatientForm from './components/PatientForm';

function App() {
    const [results, setResults] = useState(null);

    const handleUploadSuccess = (data) => {
        setResults(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Medical Data Analysis
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Upload your patient data CSV to analyze biomarkers and mortality risk.
                    </p>
                </div>

                <div className="space-y-12">
                    <FileUpload onUploadSuccess={handleUploadSuccess} />

                    {results && (
                        <>
                            <Results results={results} />
                            <PatientForm />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
