import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const predictPatient = async (patientData) => {
    const response = await api.post('/predict', patientData);
    return response.data;
};
