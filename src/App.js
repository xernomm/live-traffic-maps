import logo from './logo.svg';
import "./App.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttmaps from "@tomtom-international/web-sdk-maps";
import { useRef, useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-services";
import { FaPlus } from "react-icons/fa6";

function App() {

  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [mapLongitude, setMapLongitude] = useState(null);
  const [mapLatitude, setMapLatitude] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});

  useEffect(() => {
    let map = ttmaps.map({
      key: "3mGfsROrskVchZ4JwCRdaFjFX4bxOYE8",
      container: mapElement.current,
      center: [0, 0], // default center
      zoom: 15,
      pitch: 50,
      style: {
        map: "basic_main",
        poi: "poi_main",
        trafficFlow: "flow_relative",
        trafficIncidents: "incidents_day",
      },
      stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    });
    setMap(map);
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapLongitude(position.coords.longitude);
        setMapLatitude(position.coords.latitude);
      },
      (error) => {
        alert(error.message);
      }
    );
  }, []);

  useEffect(() => {
    if (mapLongitude && mapLatitude) {
      map.setCenter([mapLongitude, mapLatitude]);
    }
  }, [mapLongitude, mapLatitude]);

  const moveMapTo = (newLoc) => {
    map.flyTo({
      center: newLoc,
      zoom: 14,
    });
  };

  const fuzzySearch = (query) => {
    tt.services
      .fuzzySearch({
        key: "3mGfsROrskVchZ4JwCRdaFjFX4bxOYE8", // replace with your actual API key
        query: query,
      })
      .then((res) => {
        const amendRes = res.results;
        setResult(amendRes);
        moveMapTo(res.results[0].position);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
const ResultBox = ({ result }) => (
  <div
    className="result"
    onClick={(e) => {
      moveMapTo(result.position);
      setMapLongitude(result.position.lng);
      setMapLatitude(result.position.lat);
    }}
  >
    {result.address.freeformAddress}, {result.address.country}
  </div>
);
return (
  <div id='root' className="App">
    <div className="control">
      <div className="search-wrapper">
        <div className="search-control">
          <input
            className="input"
            type="text"
            placeholder="Search Location"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fuzzySearch(query);
              }
            }}
            required
          />
          <button type="submit" onClick={() => fuzzySearch(query)}>
            Search
          </button>
        </div>

        {/* <div className="results">
          {result.length > 0 ? (
            result.map((resultItem) => (
              <ResultBox result={resultItem} key={resultItem.id} />
            ))
          ) : (
            <h4>No locations</h4>
          )}
        </div> */}
      </div>
    </div>
    <div ref={mapElement} id="map-area"></div>
    <div className='col-12 d-flex justify-content-end'>
    <div className='col-3'>

       
    </div>
    </div>
  </div>
);
}

export default App;