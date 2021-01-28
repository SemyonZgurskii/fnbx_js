import * as React from "react";
import DragList from "../drag-list/drag-list.jsx";
import {useEffect} from "react";
import YandexMapTracker from "../../modules/yandexMapTracker";

export default function Tracker() {
  useEffect(() => {
    YandexMapTracker.init();
  }, [])

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      YandexMapTracker.addPointToMap(event.target.value);
    }
  }

  return (
    <div className="tracker">
      <div className="tracker__input-wrapper">
        <input className="tracker__point-input" type="text" placeholder="введите название новой точки"
               onKeyDown={handleKeyDown}
        />
      </div>
      <div className="tracker__map" id="map"></div>
      <div className="tracker__points-list">
        <DragList/>
      </div>
    </div>
  )
}
