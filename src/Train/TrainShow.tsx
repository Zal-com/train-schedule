import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StationInfo, VehicleInfo } from "../Home/Home";
import "./TrainShow.css";
import moment from "moment";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import { ReactSVG } from "react-svg";
import "../img/head_loco.svg";

interface Stop {
  id: string;
  station: string;
  stationinfo: StationInfo;
  locationX: string;
  locationY: string;
  standardname: string;
  name: string;
  time: string;
  platform: string;
  delay: string;
  departuredelay: string;
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

interface Unit {
  id: string;
  hasToilets: string;
  hasSecondClassOutlets: string;
  hasFirstClassOutlets: string;
  hasHeating: string;
  hasAirco: string;
  materialNumber: string;
  tractionType: string;
  canPassToNextUnit: string;
  seatsFirstClass: string;
  seatsCoupeFirstClass: string;
  standingPlacesFirstClass: string;
  seatsSecondClass: string;
  seatsCoupeSecondClass: string;
  standingPlacesSecondClass: string;
  lengthInMeter: string;
  hasSemiAutomaticInteriorDoors: string;
  materialSubTypeName: string;
  tractionPosition: string;
  hasPrmSection: string;
  hasPriorityPlaces: string;
  hasBikeSection: string;
  hasLuggageSection: string;
}

interface Segment {
  origin: StationInfo;
  destination: StationInfo;
  composition: {
    units: {
      unit: Unit[];
    };
  };
}

interface TrainComposition {
  composition: {
    segments: {
      segment: Segment[];
    };
  };
}

const TrainShow: React.FC = () => {
  let { id, station } = useParams<{ id: string; station: string }>();

  console.log(station);
  const [trainInfo, setTrainInfo] = useState<TrainInfo | null>(null);
  const [trainComposition, setTrainComposition] =
    useState<TrainComposition | null>(null);
  const [loading, setLoading] = useState(true);

  async function getTrainComposition(id: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.irail.be/v1/composition/?id=${id}&format=json`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: TrainComposition = await response.json();
      setTrainComposition(data);
    } catch (error) {
      console.error("Error getting train composition:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getTrainInfo(id: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.irail.be/vehicle/?id=${id}&format=json&lang=fr`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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
      getTrainComposition(id);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!trainInfo || !trainComposition) {
    return <div>Unable to retrieve data from the train.</div>;
  }

  // Function to determine if a stop comes after the specified stationId
  const getStopsAfterStation = (stops: Stop[], station: string): Stop[] => {
    if (!station) return []; // If no stationId, return an empty array

    const stationIndex = stops.findIndex(
      (stop) => stop.stationinfo.name === station,
    );
    if (stationIndex === -1) return []; // If stationId is not found, return an empty array
    return stops.slice(stationIndex + 1); // Return stops after the specified stationId
  };

  const filteredStops = trainInfo.stops.stop
    ? getStopsAfterStation(trainInfo.stops.stop, station!)
    : []; // Ensure stops are defined before filtering

  return (
    <div>
      <h1>Train Information</h1>
      <div>
        <h2>Ce train s'arrête à :</h2>
        <ul className="list-unstyled flex flex-row gap-1">
          {filteredStops.length > 0 ? (
            filteredStops.map((stop: Stop, index) => (
              <li key={index}>
                <Card>
                  <CardHeader className="text-center p-2 flex flex-row gap-2">
                    {stop.stationinfo?.name}
                    {stop.delay === "1" ? (
                      <Chip size={"sm"} color={"danger"}>
                        Retardé
                      </Chip>
                    ) : (
                      ""
                    )}
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {stop.delay === "1" ? (
                      <div className="flex flex-row gap-1">
                        <p style={{ textDecoration: "line-through" }}>
                          {" "}
                          {moment.unix(parseInt(stop.time)).format("HH:mm")}
                        </p>
                        <p className="text-red-500">
                          {moment
                            .unix(parseInt(stop.departuredelay))
                            .format("HH:mm")}
                        </p>
                      </div>
                    ) : (
                      <p> {moment.unix(parseInt(stop.time)).format("HH:mm")}</p>
                    )}
                    <p>Quai {stop.platform}</p>
                  </CardBody>
                </Card>
              </li>
            ))
          ) : (
            <li>No stops found after the specified station.</li>
          )}
        </ul>
      </div>
      <div>
        <h2>Composition</h2>
        {trainComposition?.composition?.segments?.segment.map(
          (segment: Segment, index) => (
            <div key={index} className="mb-4">
              <h3>
                Segment from {segment.origin.name} to {segment.destination.name}
              </h3>
              <div className="flex flex-row gap-2">
                {segment.composition.units.unit.map((unit: Unit, unitIndex) => (
                  <Card key={unitIndex} className="mb-2">
                    <CardBody>
                      <div className="flex flex-row gap-2 align-items-center justify-content-between">
                        <p>{unit.hasToilets ? "🚻" : null}</p>
                        <p>{unit.hasBikeSection ? "🚲" : null}</p>
                        <p>{unit.hasPrmSection ? "♿️" : null}</p>
                        <p>{unit.hasLuggageSection ? "🛄️" : null}</p>
                      </div>
                      <div
                        className={
                          "flex flex-1 align-middle justify-center mt-0"
                        }
                      >
                        {parseInt(unit.id) + 1}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default TrainShow;
