import React, { useState, useEffect, useRef } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "daypilot-pro-react";
import { getEvents, getBookings, getWebs,getBooking } from "./event_loader";
import resources_obj from "./resources";

import "./Calendar.css";
const Calendar = () => {
  const [selectedPurpose, setSelectedPurpose] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [startDate, setStartDate] = useState("2024-12-16");
  const [endDate, setEndDate] = useState("2024-12-25");
  const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState([]);
  // const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedName, setSelectedName] = useState("All");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startTime, setStartTime] = useState("14");
  const [endTime, setEndTime] = useState("19");
  const [bookingsData, setBookingsData] = useState();
  const [webs, setWebs] = useState();

  const allSpaces = webs?.spaces ?? [];
  console.log("allSpaces", allSpaces);

  const allBookings = bookingsData?.bookings ?? [];

  const ready = allSpaces.length > 0 && allBookings.length > 0;

  const events = !ready ? [] : allBookings?.map((booking) => {
    if (allSpaces.length === 0) {
      return;
    }
    const matchingSpace = allSpaces?.find((space) => {
      const spaceId = booking.spaces[0];
      return space.id === spaceId;
    });

    if (!matchingSpace) {
      throw new Error(`No matching space found for booking ID: ${booking.id}`);
    }

    return {
      start: new DayPilot.Date(booking.start),
      end: new DayPilot.Date(booking.end),
      text: "",
      id: booking.name,
      resource: matchingSpace.id,
    };
  });
  console.log("events", events);

  useEffect(() => {
    const loadBookings = async () => {
      const bookingsData = await getBookings();
      setBookingsData(bookingsData);
      console.log("bookingsData", bookingsData);
      const webs = await getWebs();
      setWebs(webs);
      console.log("webs", webs);
    };
    loadBookings();
  }, []);



const loadBookings = async () => {
  const bookingsData = await getBookings();

  const e = bookingsData.bookings.map((booking) => ({
start: new DayPilot.Date(booking.start),
end: new DayPilot.Date(booking.end),

  }));
  setEvent(e);
}

useEffect(() => {
  loadBookings();
},[]);







  const [config, setConfig] = useState({
    locale: "en-us",
    columnWidthSpec: "Auto",
    viewType: "Resources",
    headerLevels: 1,
    headerHeight: 30,
    cellHeight: 30,
    crosshairType: "Header",
    showCurrentTime: false,

   

    // eventArrangement: "Cascade",
    allowEventOverlap: true,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      console.log("not supported");
   
    },
    eventDeleteHandling: "Disabled",
    eventMoveHandling: "Update",

    onEventMoved: (args) => {
      console.error("oneventMoved not supported");
 
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      console.error("onEventResized not supported");
  
    },

    eventClickHandling: "Disabled",
    eventHoverHandling: "Disabled",
  });

  const calendarRef = useRef(null);











  // const loadEvents = async () => {
  //   const events = await getEvents(startDate, endDate);
  //   console.log(
  //     events
  //       .map((e) => e.resources)
  //       .filter((value, index, self) => self.indexOf(value) === index)
  //   );
  //   const e = events.map((event) => ({
  //     start: new DayPilot.Date(event.start),
  //     end: new DayPilot.Date(event.end),

  //     text: event.summary,
  //     id: event.uid,
  //     resource: event.resources,
  //   }));
  //   setEvents(e);
  //   setSelectedEvents(
  //     e)
  // };

  useEffect(() => {
    daysResources();
  }, []);

  const initializeResources = (
    date,
    purpose = "All",
    location = "All",
    name = "All"
  ) => {
    const resources = resources_obj.map((resource) => ({
      ...resource,
      start: date,
    }));

    return resources.filter((resource) => {
      return (
        (purpose === "All" || resource.purpose === purpose) &&
        (location === "All" || resource.location === location) &&
        (name === "All" || resource.name === name)
      );
    });
  };

  const handleNameChange = (e) => {
    setSelectedName(e.target.value);
  };

  const handlePurposeChange = (e) => {
    setSelectedPurpose(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const applyResourceFilter = () => {
    const date = new Date();
    const filteredResources = initializeResources(
      date,
      selectedPurpose,
      selectedLocation
    );

    daysResources();

   
  };


  const daysResources = () => {
    const columns = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);
    const daysDifference =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Get all events that fall within the date range
    const allEvent = event; /*.filter((event) => {
  
    });*/

    for (let i = 0; i < daysDifference; i++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + i);
      const dayResources = initializeResources(
        currentDay,
        selectedPurpose,
        selectedLocation,
        selectedName
      );

      columns.push({
        id: i,
        name: currentDay.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        children: dayResources,
      });
    }

    const columnWidth =
      selectedName !== "All" &&
      selectedPurpose === "All" &&
      selectedLocation === "All"
        ? 210
        : 120;

    setConfig({
      ...config,
      columnWidthSpec: "Fixed",
      columnWidth: columnWidth,
      columns,
      headerLevels: 2,
      events: allEvent,
    });
  };














  

  const daysResourcess = () => {
    const columns = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);
    const daysDifference =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Get all events that fall within the date range
    const allEvents = events; /*.filter((event) => {
  
    });*/

    for (let i = 0; i < daysDifference; i++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + i);
      const dayResources = initializeResources(
        currentDay,
        selectedPurpose,
        selectedLocation,
        selectedName
      );

      columns.push({
        id: i,
        name: currentDay.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        children: dayResources,
      });
    }

    const columnWidth =
      selectedName !== "All" &&
      selectedPurpose === "All" &&
      selectedLocation === "All"
        ? 210
        : 120;

    setConfig({
      ...config,
      columnWidthSpec: "Fixed",
      columnWidth: columnWidth,
      columns,
      headerLevels: 2,
      events: allEvents,
    });
  };








  const endDateTillMidnight = new Date(endDate);
  endDateTillMidnight.setHours(23, 59, 59);

  const adjustZoom = (delta) => {
    setZoomLevel((prev) => {
      const newZoom = Math.min(Math.max(prev + delta, 0.2), 2); // Zoom between 0.5x and 2x
      return newZoom;
    });
  };

  useEffect(() => {
    // Update column and cell sizes when zoom changes
    setConfig((prevConfig) => ({
      ...prevConfig,
      columnWidth: 140 * zoomLevel,
      cellHeight: 30 * zoomLevel,
    }));
  }, [zoomLevel]);

  return (
    <div className={"wrap"}>
      <div className={"left"}>
        <DayPilotNavigator
          selectMode={"Day"}
          showMonths={3}
          skipMonths={3}
          selectionDay={startDate}
          startDate={startDate}
          onTimeRangeSelected={(args) => setStartDate(args.day)}
        />
      </div>
      <div className={"calendar"}>
        <button onClick={() => adjustZoom(0.1)}>Zoom In</button>
        <button onClick={() => adjustZoom(-0.1)}>Zoom Out</button>
        <p>Current Zoom: {zoomLevel.toFixed(1)}x</p>

        <div className={"toolbar"}>
          <div>
            <label>
              Start Date:{" "}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              End Date:{" "}
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <label>
            Room Type:
            <select onChange={handlePurposeChange} value={selectedPurpose}>
              <option value="All">All</option>
              <option value="Play">Play</option>
              <option value="Couple">Couple</option>
              <option value="Individual">Individual</option>
              <option value="Conference Room">Conference Room</option>
            </select>
          </label>
          <label>
            Location:
            <select onChange={handleLocationChange} value={selectedLocation}>
              <option value="All">All</option>
              <option value="RP">RP</option>
              <option value="CC">CC</option>
              <option value="Airmont">Airmont</option>
              <option value="SRR">SRR</option>
              <option value="WC">WC</option>
            </select>
          </label>
          Name:
          <select onChange={handleNameChange} value={selectedName}>
            <option value="All">All</option> {/* Add an option for "All" */}
            {resources_obj.map((resource) => (
              <option key={resource.name} value={resource.name}>
                {resource.name}
              </option>
            ))}
          </select>
          <label>
            Start Time:{" "}
            <input
              type="time"
              value={startTime}
              //onChange={handleStartTimeChange} // Corrected onChange handler
            />
          </label>
          <label>
            End Time: <input type="time" value={endTime} format="HH:mm" />
          </label>
          <label>
            <input type="checkbox" />
            Clinical Spaces
          </label>
          <input
            name="view"
            type="button"
            onClick={applyResourceFilter}
            value="Search"
          />
        </div>
        <DayPilotCalendar
          {...config}
          ref={calendarRef}
          events={events}
          startDate={startDate}
          endDate={endDateTillMidnight}
          idField="id"
          startField="start"
          endField="end"
          resourceField="resource"
          startTime={startTime}
        />
      </div>
    </div>
  );
};

export default Calendar;
