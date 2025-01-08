
import axios from "axios";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";

// Dynamically determine the base URL
const BASE_URL = window.location.origin.includes('localhost') 
    ? "http://localhost:4000" // Local development
    : "https://viewscheduleapp.azurewebsites.net"; // Azure production

const EVENTS_URL = `${BASE_URL}/events`;
const BOOKINGS_URL = `${BASE_URL}/bookings`;
const WEBS_URL = `${BASE_URL}/webs`;

export const getEvents = async (start, end) => {
    const startDate = new DayPilot.Date(start);
    const endDate = new DayPilot.Date(end);
    const response = await axios.get(`${EVENTS_URL}?start=${startDate}&end=${endDate}`);
   // console.log('getEvents response.data:', response.data)
    return response.data;
};

export const getBookings = async (start, end) => {
    const startDate = new DayPilot.Date(start);
    const endDate = new DayPilot.Date(end);
    const response = await axios.get(`${BOOKINGS_URL}?start=${startDate}&end=${endDate}`)
    console.log('getBookings response.data:', response.data)
    return response.data;
}

export const getBooking = async () => {
    const response = await axios.get(BOOKINGS_URL)
    console.log('getBookings response.data:', response.data)
    return response.data;
}


export const getWebs = async () => {
    const response = await axios.get(WEBS_URL)
    console.log('getWebs response.data:', response.data)
    return response.data;
}