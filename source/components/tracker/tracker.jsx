import * as React from "react";
import DragList from "../drag-list/drag-list.jsx";
import {useEffect, useState} from "react";
import YandexMapTracker from "../../modules/yandexMapTracker";
import {changeArrayElementsOrder} from "../../utils.js";

export default function Tracker() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    YandexMapTracker.init();
    YandexMapTracker.setPointDataChangeHandler(handlePointDataChange);
    YandexMapTracker.setPointAddHandler(handlePointAdd);
  }, [])

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      YandexMapTracker.addPointToMap(event.target.value)
    }
  }

  function handlePointAdd(newPoint) {
    setPoints((prev) => {
      return [...prev, newPoint];
    })
  }

  function handlePointDelete(pointToDelete) {
    setPoints((prevPoints) => {
      return prevPoints.filter((point) => point !== pointToDelete);
    })

    YandexMapTracker.deletePoint(pointToDelete);
  }

  function handlePointsOrderChange(nearbyPoint, movedPoint, pastePosition) {
    setPoints((prev) => {
      const currentPoints = prev.slice();
      return changeArrayElementsOrder(currentPoints, nearbyPoint, movedPoint, pastePosition);
    })

    YandexMapTracker.changePointsOrder(nearbyPoint, movedPoint, pastePosition);
  }

  function handlePointDataChange(point, changedPoint) {
    setPoints((prev) => {
      const currentPoints = prev.slice();
      const changedPointIndex = currentPoints.indexOf(point);

      currentPoints[changedPointIndex] = changedPoint;

      return currentPoints
    });
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
