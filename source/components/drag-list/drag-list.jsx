import * as React from "react";
import {useState} from "react";

const ShadowModifier = {
  TOP: "drag-list__item--shadow-top",
  BOTTOM: "drag-list__item--shadow-bottom",
}

export default function DragList(props) {
  const {points, onPointDelete, onPointReplace} = props;

  const [activePoint, setActivePoint] = useState(null);
  const [pastePosition, setPastePosition] = useState(null);

  function handleDragStart(point) {
    setActivePoint(point);
  }

  function handleDragOver(evt, point) {
    evt.preventDefault();

    if (point === activePoint) {
      return;
    }

    const {
      height: pointElementHeight,
      y: pointElementX
    } = evt.currentTarget.getBoundingClientRect();

    const pointElementTopSide = pointElementX + pointElementHeight / 2;
    const isMouseOnTopSide = pointElementTopSide > evt.clientY;

    setPastePosition(() => {
      if (isMouseOnTopSide) {
        return PastePosition.BEFORE
      }

      return PastePosition.AFTER
    })

    if (isMouseOnTopSide) {
      evt.currentTarget.classList.add(ShadowModifier.TOP);
      evt.currentTarget.classList.remove(ShadowModifier.BOTTOM);
    } else {
      evt.currentTarget.classList.add(ShadowModifier.BOTTOM);
      evt.currentTarget.classList.remove(ShadowModifier.TOP);
    }
  }

  function handleDrop(evt, point) {
    evt.preventDefault();

    if (point === activePoint) {
      return;
    }

    evt.currentTarget.classList.remove(ShadowModifier.TOP, ShadowModifier.BOTTOM);

    updatePoints((prev) => {
      const currentPoints = prev.slice();
      const activePointIndex = currentPoints.indexOf(activePoint);
      currentPoints.splice(activePointIndex, 1);

      const pointIndex = currentPoints.indexOf(point);

      if (pastePosition === PastePosition.BEFORE) {
        currentPoints.splice(pointIndex, 0, activePoint);
      } else {
        currentPoints.splice(pointIndex + 1, 0, activePoint);
      }

      return currentPoints;
    });
  }

  function handleDragLeave(evt) {
    evt.currentTarget.classList.remove(ShadowModifier.TOP, ShadowModifier.BOTTOM);
  }

  return (
    <ul className="drag-list">
      {points.map((point) => {
        const {id, name} = point;

        return (
          <li className="drag-list__item"
              draggable="true"
              key={id}
              onDragStart={() => handleDragStart(point)}
              onDragOver={(evt) => handleDragOver(evt, point)}
              onDragLeave={(evt) => handleDragLeave(evt)}
              onDrop={(evt) => handleDrop(evt, point)}
          >
            <p className="drag-list__name">{name}</p>
            <button className="drag-list__close-button" type="button" aria-label="удалить пункт"></button>
          </li>
        )
      })}

    </ul>
  )
}
