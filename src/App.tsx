import React, { useState, useEffect } from "react";
import "./App.css";
import moment from "moment";
import { Button, Input, NextUIProvider, Switch } from "@nextui-org/react";
import { log } from "node:util";

interface StationInfo {
  id: string;
  url: string;
  name: string;
  standardName: string;
  locationX: string;
  locationY: string;
}

interface VehicleInfo {
  name: string;
  shortname: string;
  number: string;
  type: string;
  locationX: string;
  locationY: string;
  url: string;
}

interface Departure {
  id: string;
  station: string;
  stationInfo: StationInfo;
  vehicle: string;
  vehicleinfo: VehicleInfo;
  time: string;
}

interface Arrival {
  arrived: string;
  canceled: string;
  delay: string;
  departureConnection: string;
  id: string;
  isExtra: string;
  platform: string;
  station: string;
  stationInfo: StationInfo;
  time: string;
  vehicle: string;
  vehicleinfo: VehicleInfo;
}

interface ApiData {
  arrivals?: {
    arrival: Arrival[];
  };
  departures?: {
    departure: Departure[];
  };
}

function App() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stationName, setStationName] = useState<string>("Cologne"); // Default station name
  const [searchQuery, setSearchQuery] = useState<string>(""); // For handling user input
  const [switchChecked, setSwitchChecked] = useState<boolean>(false); // Managing switch state

  // Handle the switch toggle
  const handleSwitchChange = () => {
    setSwitchChecked((prev) => !prev);
  };

  async function getApi(station: string, arrDep: string) {
    try {
      setLoading(true);
      let api = await fetch(
        `https://api.irail.be/liveboard/?station=${station}&format=json&arrdep=${arrDep}&lang=fr`,
      );
      let response: ApiData = await api.json();
      setApiData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the API data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getApi(stationName, switchChecked ? "arrivals" : "departures");
  }, [stationName, switchChecked]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStationName(searchQuery);
  };
  console.log(apiData);

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSearch}>
          <label>
            Arrivées / Départs
            <Switch
              name={"arrDep"}
              size={"md"}
              checked={switchChecked}
              onChange={handleSwitchChange}
            />
          </label>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter station name"
          />
          <Button type="submit">Search</Button>
        </form>
        {loading ? (
          <p>Loading...</p>
        ) : !apiData ? (
          <p>Failed to load data</p>
        ) : (
          <ul>
            {apiData.departures
              ? apiData.departures?.departure.map((departure, index) => (
                  <li key={index}>
                    {departure.station} - {departure.vehicleinfo?.shortname} -{" "}
                    {moment.unix(parseInt(departure.time)).format("HH:mm")}
                  </li>
                ))
              : apiData.arrivals?.arrival.map((arrival, index) => (
                  <li key={index}>
                    {arrival.station} - {arrival.vehicleinfo?.shortname} -{" "}
                    {moment.unix(parseInt(arrival.time)).format("HH:mm")}
                  </li>
                ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;
