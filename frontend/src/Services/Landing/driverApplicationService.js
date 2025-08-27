import axios from 'axios';

// ✅ Submit Driver Application
export const submitDriverApplication = async(formData) => {
    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
        if (formData[key] && typeof formData[key] !== 'object') {
            formDataToSend.append(key, formData[key]);
        }
    });

    // Append files
    Object.keys(formData).forEach((key) => {
        if (formData[key] && formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
        }
    });

    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/driver-application`,
            formDataToSend
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ Cancel Driver Application
export const cancelDriverApplication = async(applicationId, reason = '') => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/reservation/cancel/${applicationId}`, { reason }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ Submit Driver Rating
export const submitDriverRating = async(reservationId, rating) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/reservation/rating/${reservationId}`, { rating }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const submitLostItem = async(reservationId, lostItemData) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/reservation/lost-items/${reservationId}`,
            lostItemData
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};