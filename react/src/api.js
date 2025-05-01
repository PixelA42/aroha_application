
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Your Django API base URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Token ${token}` } : {};
};

// Function to place an order
export const placeOrder = async (paymentMethod) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/order/place/`, 
            { payment_method: paymentMethod },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to place order");
    }
};

// Function to get order history
export const getOrderHistory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/order/history/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching order history:", error.response?.data || error.message);
        throw error.response?.data || new Error("Failed to fetch order history");
    }
};

// You might already have cart functions here or in another file.
// Example: Fetch cart (if not already defined elsewhere)
export const fetchCartApi = async () => {
     try {
        const response = await axios.get(`${API_BASE_URL}/cart/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error.response?.data || error.message);
        // Handle specific errors like 401 if needed
        if (error.response?.status === 401) {
            // Optionally clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect logic might be better handled in the component
        }
        throw error.response?.data || new Error("Failed to fetch cart");
    }
};

// Add other API functions (like updateQuantity, removeItem) if they aren't defined elsewhere
