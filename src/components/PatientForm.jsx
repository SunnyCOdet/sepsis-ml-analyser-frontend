import React, { useState } from 'react';
import { predictPatient } from '../api';

const PatientForm = () => {
    const [formData, setFormData] = useState({
        Lactate: '',
        Albumin: '',
        CRP: '',
        NLR: '',
        PCT: '',
        APACHE: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const result = await predictPatient(formData);
            setPrediction(result);
        } catch (err) {
            setError('Prediction failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const getRiskColorClass = (color) => {
        const colors = {
            'green': 'bg-green-50 border-green-300 text-green-900',
            'orange': 'bg-orange-50 border-orange-300 text-orange-900',
            'red': 'bg-red-50 border-red-300 text-red-900'
        };
        return colors[color] || 'bg-gray-50 border-gray-300 text-gray-900';
    };

    const getRiskBadgeClass = (color) => {
        const colors = {
            'green': 'bg-green-600 text-white',
            'orange': 'bg-orange-600 text-white',
            'red': 'bg-red-600 text-white'
        };
        return colors[color] || 'bg-gray-600 text-white';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Sepsis Mortality Risk Assessment</h2>
            <p className="text-sm text-gray-600 mb-6">Enter patient biomarkers. Missing values will be automatically imputed using advanced statistical methods.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lactate (0hr) <span className="text-gray-400 text-xs">mmol/L</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="Lactate"
                        value={formData.Lactate}
                        onChange={handleChange}
                        placeholder="Optional - leave blank if unavailable"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Albumin (0hr) <span className="text-gray-400 text-xs">g/dL</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="Albumin"
                        value={formData.Albumin}
                        onChange={handleChange}
                        placeholder="Optional - leave blank if unavailable"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CRP (0hr) <span className="text-gray-400 text-xs">mg/L</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="CRP"
                        value={formData.CRP}
                        onChange={handleChange}
                        placeholder="Optional - leave blank if unavailable"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        NLR (0hr) <span className="text-gray-400 text-xs">Neutrophil-Lymphocyte Ratio</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="NLR"
                        value={formData.NLR}
                        onChange={handleChange}
                        placeholder="Optional - leave blank if unavailable"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        PCT (0hr) <span className="text-gray-400 text-xs">ng/mL</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="PCT"
                        value={formData.PCT}
                        onChange={handleChange}
                        placeholder="Optional - leave blank if unavailable"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        APACHE II Score <span className="text-gray-400 text-xs">0-71</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="APACHE"
                        value={formData.APACHE}
                        onChange={handleChange}
                        placeholder="Optional - leave blank if unavailable"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg transition-colors duration-200"
                    >
                        {loading ? 'Analyzing Patient Data...' : '🔬 Predict Mortality Risk'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                    <p className="text-red-700 font-semibold">⚠️ Error: {error}</p>
                </div>
            )}

            {prediction && (
                <div className="mt-8 space-y-6">
                    {/* Main Risk Assessment */}
                    <div className={`p-6 rounded-lg border-2 ${getRiskColorClass(prediction.risk_color)}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold">Risk Assessment</h3>
                            <span className={`px-4 py-2 rounded-full font-bold text-lg ${getRiskBadgeClass(prediction.risk_color)}`}>
                                {prediction.risk_level}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-600">Mortality Probability</p>
                                <p className="text-4xl font-bold mt-2">
                                    {(prediction.ensemble_probability_expired * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-600">Survival Probability</p>
                                <p className="text-4xl font-bold mt-2 text-green-600">
                                    {(prediction.probability_survived * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-600">Confidence Score</p>
                                <p className="text-4xl font-bold mt-2">
                                    {prediction.confidence_score.toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Clinical Recommendation:</p>
                            <p className="text-base font-medium">{prediction.clinical_recommendation}</p>
                        </div>
                    </div>

                    {/* Ensemble Details */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-bold mb-3 text-gray-800">Ensemble Model Analysis</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Prediction based on {prediction.num_models_used} advanced machine learning models
                        </p>
                        <div className="mb-3">
                            <p className="text-sm font-semibold text-gray-700">Model Agreement:</p>
                            <p className="text-base">{prediction.model_agreement}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {prediction.individual_models && prediction.individual_models.map((model, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs font-semibold text-gray-600">{model.model}</p>
                                    <p className="text-lg font-bold mt-1">
                                        {(model.probability * 100).toFixed(1)}%
                                    </p>
                                    <p className={`text-xs font-medium mt-1 ${model.prediction === 'Expired' ? 'text-red-600' : 'text-green-600'}`}>
                                        {model.prediction}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calculated Features */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-bold mb-3 text-blue-900">Patient Biomarkers</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {prediction.calculated_features.LAR !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">LAR (Lactate/Albumin)</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.LAR.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {prediction.calculated_features.Lactate !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">Lactate</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.Lactate.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {prediction.calculated_features.Albumin !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">Albumin</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.Albumin.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {prediction.calculated_features.PCT !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">PCT</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.PCT.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {prediction.calculated_features.CRP !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">CRP</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.CRP.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {prediction.calculated_features.NLR !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">NLR</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.NLR.toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {prediction.calculated_features.APACHE !== null && (
                                <div className="bg-white p-3 rounded">
                                    <p className="text-xs text-gray-600">APACHE II</p>
                                    <p className="text-xl font-bold text-blue-800">
                                        {prediction.calculated_features.APACHE.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feature Importance */}
                    {prediction.feature_importance && Object.keys(prediction.feature_importance).length > 0 && (
                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                            <h4 className="text-lg font-bold mb-3 text-purple-900">Feature Importance Analysis</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Relative importance of each biomarker in the prediction model
                            </p>
                            <div className="space-y-2">
                                {Object.entries(prediction.feature_importance)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([feature, importance]) => (
                                        <div key={feature} className="flex items-center">
                                            <span className="text-sm font-medium w-24">{feature}:</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-6 ml-3">
                                                <div
                                                    className="bg-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                                                    style={{ width: `${(importance * 100).toFixed(1)}%` }}
                                                >
                                                    <span className="text-xs text-white font-semibold">
                                                        {(importance * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                        <p className="text-xs text-yellow-900">
                            <strong>⚠️ Clinical Disclaimer:</strong> This prediction is generated by machine learning models
                            trained on historical data and should be used as a decision support tool only. Clinical judgment
                            and comprehensive patient assessment by qualified healthcare professionals are essential.
                            This tool does not replace professional medical diagnosis or treatment decisions.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientForm;
