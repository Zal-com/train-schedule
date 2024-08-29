import React, { useEffect, useState } from "react";
import "./Home.css";
import "../index.css";
import {
  Button,
  Input,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import moment from "moment/moment";
import Layout from "../Layout";

export interface StationInfo {
  id: string;
  url: string;
  name: string;
  standardName: string;
  locationX: string;
  locationY: string;
}

export interface VehicleInfo {
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

function Home() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stationName, setStationName] = useState<string>("Cologne"); // Default station name
  const [searchQuery, setSearchQuery] = useState<string>(""); // For handling user input
  const [switchChecked, setSwitchChecked] = useState<boolean>(false); // Managing switch state

  const handleSwitchChange = () => {
    setSwitchChecked((prev) => !prev);
  };

  async function getApi(station: string, arrDep: string) {
    try {
      setLoading(true);
      const api = await fetch(
        `https://api.irail.be/liveboard/?station=${station}&format=json&arrdep=${arrDep}&lang=fr`,
      );
      const response: ApiData = await api.json();
      if (response) {
        setApiData(response);
      }
    } catch (error) {
      console.error("Error fetching the API data:", error);
    } finally {
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
  return (
    <div
      className="App"
      style={{ height: "100vh", margin: "auto", width: "75%" }}
    >
      <form onSubmit={handleSearch} className="form flex flex-row gap-2 py-4">
        <label className={"flex flex-row gap-1"}>
          Départs / Arrivées
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
        <div style={{ margin: "1rem" }}>
          <Table isStriped={true} className="table mt-10">
            <TableHeader>
              <TableColumn>
                {switchChecked ? "Arrivées" : "Départs"}
              </TableColumn>
              <TableColumn>Train</TableColumn>
              <TableColumn>Heure</TableColumn>
            </TableHeader>
            <TableBody>
              {(apiData.departures?.departure ||
                apiData.arrivals?.arrival)!.map((entry, index) => (
                <TableRow
                  className={"nextui-table-row"}
                  key={entry.id || index}
                  href={"/train/" + entry.vehicleinfo.name}
                >
                  <TableCell>{entry.station}</TableCell>
                  <TableCell>{entry.vehicleinfo?.shortname}</TableCell>
                  <TableCell>
                    {moment.unix(parseInt(entry.time)).format("HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Home;
