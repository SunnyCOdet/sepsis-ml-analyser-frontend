import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
    BarChart, Bar, Cell
} from 'recharts';

const Results = ({ results }) => {
    if (!results) return null;

    const { correlation, models } = results;

    return (
        <div className="space-y-8">
            {/* Correlation Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Correlation Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">LAR vs PCT</p>
                        <p className="text-2xl font-bold">{correlation.LAR_PCT?.toFixed(4)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">LAR vs Outcome</p>
                        <p className="text-2xl font-bold">{correlation.LAR_Outcome?.toFixed(4)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">PCT vs Outcome</p>
                        <p className="text-2xl font-bold">{correlation.PCT_Outcome?.toFixed(4)}</p>
                    </div>
                </div>
            </div>

            {/* Models Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {models.map((model) => (
                    <div key={model.name} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">{model.name}</h3>

                        {/* Metrics Table */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Performance Metrics</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="flex justify-between border-b py-1">
                                    <span>Sensitivity:</span>
                                    <span className="font-medium">{model.metrics.Sensitivity.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Specificity:</span>
                                    <span className="font-medium">{model.metrics.Specificity.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>PPV:</span>
                                    <span className="font-medium">{model.metrics.PPV.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>NPV:</span>
                                    <span className="font-medium">{model.metrics.NPV.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Accuracy:</span>
                                    <span className="font-medium">{model.metrics.Accuracy?.toFixed(4) || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>CV AUC:</span>
                                    <span className="font-medium">
                                        {model.metrics.CV_AUC_Mean?.toFixed(4) || 'N/A'}
                                        {model.metrics.CV_AUC_Std && ` ±${model.metrics.CV_AUC_Std.toFixed(4)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b py-1 col-span-2 bg-blue-50 p-2 rounded">
                                    <span className="font-bold text-blue-800">AUC:</span>
                                    <span className="font-bold text-blue-800">{model.metrics.AUC.toFixed(4)}</span>
                                </div>
                            </div>
                        </div>

                        {/* ROC Curve */}
                        <div className="h-64 w-full">
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">ROC Curve</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={model.roc_data.fpr.map((f, i) => ({ fpr: f, tpr: model.roc_data.tpr[i] }))}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fpr" type="number" domain={[0, 1]} label={{ value: 'False Positive Rate', position: 'insideBottomRight', offset: -5 }} />
                                    <YAxis type="number" domain={[0, 1]} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="red" strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="tpr" stroke="#2563eb" dot={false} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
