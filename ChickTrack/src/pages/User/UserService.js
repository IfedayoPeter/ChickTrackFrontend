import axios from 'axios';

const BASE_URL = 'https://chicktrack.runasp.net/api/BaseUser';

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getAllUsers = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}?page=${page}&pageSize=${pageSize}`);
    // Return just the data array from the response
    return response.data.content.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to get a user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Function to delete a user by ID
export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${userId}`); // Changed to DELETE method
    return response.data;
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    throw error;
  }
};