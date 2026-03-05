import axios from 'axios';

export const getCoordsFromCEP = async (cep: string) => {
    try {
        const cleanCEP = cep.replace(/\D/g, '');

        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                postalcode: cleanCEP,
                country: 'Brazil',
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'MeuAppLogistico/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            return {
                latitude: parseFloat(response.data[0].lat),
                longitude: parseFloat(response.data[0].lon)
            };
        }
        return { latitude: null, longitude: null };
    } catch (error) {
        console.error("Erro na geocodificação:", error);
        return { latitude: null, longitude: null };
    }
};