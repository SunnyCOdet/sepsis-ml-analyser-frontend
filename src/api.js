import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sepsis-ml-analyser-backend.onrender.com',
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
