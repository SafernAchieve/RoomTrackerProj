
import axios from "axios";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";

// Dynamically determine the base URL
const BASE_URL = window.location.origin.includes('localhost') 
    ? "http://localhost:4000" // Local development
    : "https://viewscheduleapp.azurewebsites.net"; // Azure production

const URL = `${BASE_URL}/events`;

export const getEvents = async (start, end) => {
    const startDate = new DayPilot.Date(start);
    const endDate = new DayPilot.Date(end);
    const response = await axios.get(`${URL}?start=${startDate}&end=${endDate}`);
    console.log(response.data)
    return response.data;
};
