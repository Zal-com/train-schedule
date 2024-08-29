import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StationInfo, VehicleInfo } from "../Home/Home"; // Ensure these are correctly imported

interface Stop {
  id: string;
  station: string;
  stationinfo: StationInfo;
  locationX: string;
  locationY: string;
  standardname: string;
  name: string;
}

interface TrainInfo {
  vehicleinfo: VehicleInfo;
  stops: {
    stop: Stop[];
  };
  time: string;
  delay: number;
  platform: number;
  canceled: boolean;
  departureDelay: number;
  departureCanceled: boolean;
  scheduledDepartureTime: number;
  arrivalDelay: boolean;
  arrivalCanceled: boolean;
  isExtraStop: boolean;
  scheduledArrivalTime: number;
}

const TrainShow: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const [trainInfo, setTrainInfo] = useState<TrainInfo | null>(null);
  const [loading, setLoading] = useState(true);

  async function getTrainInfo(id: string) {
    setLoading(true);
    try {
      console.log(id);
      const response = await fetch(
        `https://api.irail.be/vehicle/?id=${id}&format=json&lang=fr`,
      );
      const data: TrainInfo = await response.json();
      setTrainInfo(data);
    } catch (error) {
      console.error("Error getting TrainInfo:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getTrainInfo(id);
    }
  }, [id]); // Dependency should be `id`, not `trainInfo`

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!trainInfo) {
    return <div>Unable to retrieve data from the train.</div>;
  }
  return (
    <div>
      <h1>Train Information</h1>
      <ul>
        {trainInfo.stops?.stop.map((stop: Stop) => (
          <li key={stop.id}>{stop.station}</li>
        ))}
      </ul>
    </div>
  );
};

export default TrainShow;
