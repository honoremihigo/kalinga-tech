import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // Use env variable in real app

export const getComplaints = async () => {
  const res = await axios.get(`${API_BASE}/complaints`);
  return res.data;
};

export const createComplaint = async (data) => {
  const res = await axios.post(`${API_BASE}/complaints`, data);
  return res.data;
};

export const updateComplaint = async (id, data) => {
  const res = await axios.patch(`${API_BASE}/complaints/${id}`, data);
  return res.data;
};

export const deleteComplaint = async (id) => {
  const res = await axios.delete(`${API_BASE}/complaints/${id}`);
  return res.data;
};
