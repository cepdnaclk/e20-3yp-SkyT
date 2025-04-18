import axios from "axios";

// Base API of the server
const API_BASE_URL = import.meta.env.VITE_LOCAL_BACKEND;
//const API_BASE_URL = import.meta.env.VITE_VERCEL_BACKEND;

// Get data from backend
export async function getData(page: string) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Fetching data from: ${destination}`);
    const response = await axios.get(destination);
    return response;
  } catch (error) {
    console.error("Fetching data error!", error);
    throw error;
  }
}

// Update data in backend
export async function updateData(sendData: object, page: string) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Updating data in: ${destination}`);
    const response = await axios.patch(destination, sendData);
    return response;
  } catch (error) {
    console.error("Updating data error!", error);
    throw error;
  }
}

// Post data to backend
export async function postData(sendData: object, page: string) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Adding new data in: ${destination}`);
    const response = await axios.post(destination, sendData);
    return response;
  } catch (error) {
    console.error("Posting data error!", error);
    throw error;
  }
}

// Add new data in backend -- Need to midify
export async function deleteData(sendData: object, page: string) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Deleting excisting data in: ${destination}`);
    const response = await axios.delete(destination, { data: sendData });
    return response;
  } catch (error) {
    console.error("Deleting data error!", error);
    throw error;
  }
}

// Function to validate access
export async function validateToken(token: string) {
  try {
    const destination = `${API_BASE_URL}/auth`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    //console.log("Validating from: ", destination);
    const response = await axios.get(destination, config);
    return response.data; // Return only the data instead of the whole response object
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
}
