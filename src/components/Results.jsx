import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

const formatNumber = (value, digits = 4) => {
    if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
    return Number(value).toFixed(digits);
};

const Results = ({ results }) => {
    if (!results) return null;

    const {
        summary,
        imputation,
        distribution,
        descriptive_stats,
        group_comparison,
        correlation,
        univariate_logistic,
        multivariable_logistic,
        roc_models,
        diagnostic_metrics,
        internal_validation,
        culture_sensitivity,
    } = results;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Dataset Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Total Samples</p>
                        <p className="text-2xl font-bold">{summary?.n_total ?? 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Survivors</p>
                        <p className="text-2xl font-bold">{summary?.n_survivors ?? 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Non-Survivors</p>
                        <p className="text-2xl font-bold">{summary?.n_non_survivors ?? 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Missing Data Imputation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {imputation && Object.entries(imputation).map(([biomarker, info]) => (
                        <div key={biomarker} className="p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">{biomarker}</p>
                            <p className="text-sm font-semibold">Method: {info.method}</p>
                            <p className="text-xs text-gray-500">Value: {formatNumber(info.value, 3)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Descriptive Statistics (Median / IQR)</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2">Biomarker</th>
                                <th className="py-2">Overall</th>
                                <th className="py-2">Survivors</th>
                                <th className="py-2">Non-Survivors</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {descriptive_stats?.overall && Object.keys(descriptive_stats.overall).map((biomarker) => (
                                <tr key={biomarker}>
                                    <td className="py-2 font-medium">{biomarker}</td>
                                    <td className="py-2">
                                        {formatNumber(descriptive_stats.overall[biomarker].median, 3)} / {formatNumber(descriptive_stats.overall[biomarker].iqr, 3)}
                                    </td>
                                    <td className="py-2">
                                        {formatNumber(descriptive_stats.survivors[biomarker].median, 3)} / {formatNumber(descriptive_stats.survivors[biomarker].iqr, 3)}
                                    </td>
                                    <td className="py-2">
                                        {formatNumber(descriptive_stats.non_survivors[biomarker].median, 3)} / {formatNumber(descriptive_stats.non_survivors[biomarker].iqr, 3)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Distribution Testing & Group Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2">Biomarker</th>
                                <th className="py-2">Distribution</th>
                                <th className="py-2">Test</th>
                                <th className="py-2">Statistic</th>
                                <th className="py-2">p-value</th>
                                <th className="py-2">Effect Size</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {group_comparison && Object.keys(group_comparison).map((biomarker) => (
                                <tr key={biomarker}>
                                    <td className="py-2 font-medium">{biomarker}</td>
                                    <td className="py-2">{distribution?.[biomarker]?.classification || 'N/A'}</td>
                                    <td className="py-2">{group_comparison[biomarker].test || 'N/A'}</td>
                                    <td className="py-2">{formatNumber(group_comparison[biomarker].statistic, 4)}</td>
                                    <td className="py-2">{formatNumber(group_comparison[biomarker].p_value, 4)}</td>
                                    <td className="py-2">{formatNumber(group_comparison[biomarker].effect_size, 4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Spearman Correlation with Mortality</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {correlation && Object.entries(correlation).map(([biomarker, info]) => (
                        <div key={biomarker} className="p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">{biomarker}</p>
                            <p className="text-lg font-bold">r = {formatNumber(info.r, 4)}</p>
                            <p className="text-xs text-gray-500">p = {formatNumber(info.p_value, 4)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Univariate Logistic Regression</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2">Biomarker</th>
                                <th className="py-2">Beta</th>
                                <th className="py-2">OR</th>
                                <th className="py-2">95% CI</th>
                                <th className="py-2">p-value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {univariate_logistic?.map((row) => (
                                <tr key={row.biomarker}>
                                    <td className="py-2 font-medium">{row.biomarker}</td>
                                    <td className="py-2">{formatNumber(row.beta, 4)}</td>
                                    <td className="py-2">{formatNumber(row.odds_ratio, 4)}</td>
                                    <td className="py-2">
                                        {formatNumber(row.ci_95?.[0], 4)} - {formatNumber(row.ci_95?.[1], 4)}
                                    </td>
                                    <td className="py-2">{formatNumber(row.p_value, 4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Multivariable Logistic Regression</h2>
                <div className="space-y-4">
                    {multivariable_logistic?.map((model) => (
                        <div key={model.name} className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">{model.name}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500">
                                            <th className="py-2">Feature</th>
                                            <th className="py-2">OR</th>
                                            <th className="py-2">95% CI</th>
                                            <th className="py-2">p-value</th>
                                            <th className="py-2">VIF</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {model.features.map((feature) => (
                                            <tr key={feature}>
                                                <td className="py-2 font-medium">{feature}</td>
                                                <td className="py-2">{formatNumber(model.odds_ratios?.[feature], 4)}</td>
                                                <td className="py-2">
                                                    {formatNumber(model.ci_95?.[feature]?.[0], 4)} - {formatNumber(model.ci_95?.[feature]?.[1], 4)}
                                                </td>
                                                <td className="py-2">{formatNumber(model.p_values?.[feature], 4)}</td>
                                                <td className="py-2">{formatNumber(model.vif?.[feature], 2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">ROC Curves (Multivariable Models)</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {roc_models?.map((model) => (
                        <div key={model.name} className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">{model.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">AUC: {formatNumber(model.auc, 4)}</p>
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={model.roc_data.fpr.map((f, i) => ({ fpr: f, tpr: model.roc_data.tpr[i] }))}
                                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="fpr" type="number" domain={[0, 1]} />
                                        <YAxis type="number" domain={[0, 1]} />
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

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Diagnostic Performance Metrics</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2">Model</th>
                                <th className="py-2">Sensitivity</th>
                                <th className="py-2">Specificity</th>
                                <th className="py-2">Accuracy</th>
                                <th className="py-2">PPV</th>
                                <th className="py-2">NPV</th>
                                <th className="py-2">F1</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {diagnostic_metrics && Object.entries(diagnostic_metrics).map(([name, metrics]) => (
                                <tr key={name}>
                                    <td className="py-2 font-medium">{name}</td>
                                    <td className="py-2">{formatNumber(metrics.sensitivity, 4)}</td>
                                    <td className="py-2">{formatNumber(metrics.specificity, 4)}</td>
                                    <td className="py-2">{formatNumber(metrics.accuracy, 4)}</td>
                                    <td className="py-2">{formatNumber(metrics.ppv, 4)}</td>
                                    <td className="py-2">{formatNumber(metrics.npv, 4)}</td>
                                    <td className="py-2">{formatNumber(metrics.f1, 4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Internal Validation</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2">Model</th>
                                <th className="py-2">CV AUC</th>
                                <th className="py-2">CV Sensitivity</th>
                                <th className="py-2">CV Specificity</th>
                                <th className="py-2">CV Accuracy</th>
                                <th className="py-2">Bootstrap AUC</th>
                                <th className="py-2">Bootstrap 95% CI</th>
                                <th className="py-2">Optimism-Corrected AUC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {internal_validation && Object.keys(internal_validation.kfold || {}).map((name) => (
                                <tr key={name}>
                                    <td className="py-2 font-medium">{name}</td>
                                    <td className="py-2">{formatNumber(internal_validation.kfold[name].auc_mean, 4)}</td>
                                    <td className="py-2">{formatNumber(internal_validation.kfold[name].sensitivity_mean, 4)}</td>
                                    <td className="py-2">{formatNumber(internal_validation.kfold[name].specificity_mean, 4)}</td>
                                    <td className="py-2">{formatNumber(internal_validation.kfold[name].accuracy_mean, 4)}</td>
                                    <td className="py-2">{formatNumber(internal_validation.bootstrap[name]?.mean_auc, 4)}</td>
                                    <td className="py-2">
                                        {formatNumber(internal_validation.bootstrap[name]?.ci_95?.[0], 4)} - {formatNumber(internal_validation.bootstrap[name]?.ci_95?.[1], 4)}
                                    </td>
                                    <td className="py-2">{formatNumber(internal_validation.bootstrap[name]?.optimism_corrected_auc, 4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {culture_sensitivity?.available && !culture_sensitivity?.error && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Culture Sensitivity Analysis (LAR)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Culture Positive Median (IQR)</p>
                            <p className="text-lg font-bold">
                                {formatNumber(culture_sensitivity.median.culture_positive, 3)} / {formatNumber(culture_sensitivity.iqr.culture_positive, 3)}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Culture Negative Median (IQR)</p>
                            <p className="text-lg font-bold">
                                {formatNumber(culture_sensitivity.median.culture_negative, 3)} / {formatNumber(culture_sensitivity.iqr.culture_negative, 3)}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Mann-Whitney p-value</p>
                            <p className="text-lg font-bold">{formatNumber(culture_sensitivity.p_value, 4)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;
