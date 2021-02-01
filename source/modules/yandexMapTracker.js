import {changeArrayElementsOrder} from "../utils";

class YandexMapTracker {
  constructor() {
    this._ymaps = window.ymaps;
    this._myMap = null;
    this._myPolyline = null;

    this._points = [];
    this._marks = [];
    this._newPointId = 0;
    this._activeMarkNumber = null;

    this._pointAddHandler = null;
    this._pointDataChangeHandler = null;
    this.addPointToMap = this.addPointToMap.bind(this);
  }

  init() {
    this._ymaps.ready(() => {
      this._createMap();
    })
  }

  addPointToMap(point) {
    this._ymaps.geocode(point)
      .then((response) => {
        if (response.metaData.geocoder.found) {
          const newMapMark = response.geoObjects.get(0);

          const newPoint = {
            id: this._newPointId,
            name: newMapMark.properties.get("name"),
            coordinates: newMapMark.geometry.getCoordinates(),
          }

          this._points.push(newPoint);
          this._marks.push(newMapMark);
          this._addMarkToMap(newMapMark, this._newPointId);

          this._newPointId++;

          this._updatePolyline();

          this._pointAddHandler(newPoint);
        }
      })
  }

  deletePoint(pointToDelete) {
    const pointNumber = this._points.findIndex(({id}) => id === pointToDelete.id);
    this._points.splice(pointNumber, 1);

    const markToDelete = this._marks[pointNumber];
    this._deleteMarkFromMap(markToDelete);
    this._marks.splice(pointNumber, 1);

    this._updatePolyline();
  }

  changePointsOrder(nearbyPoint, movedPoint, pastePosition) {
    this._points = changeArrayElementsOrder(this._points, nearbyPoint, movedPoint, pastePosition);
    this._changeMarksOrder(nearbyPoint, movedPoint, pastePosition);
    this._updatePolyline();
  }

  setPointDataChangeHandler(handler) {
    this._pointDataChangeHandler = handler;
  }

  setPointAddHandler(handler) {
    this._pointAddHandler = handler;
  }

  _createMap() {
    this._myMap = new this._ymaps.Map("map", {
      center: [55.76, 37.64],
      zoom: 9,
    })
  }

  _addMarkToMap(mark, id) {
    mark.properties.set("id", id);
    mark.options.set("draggable", true);

    mark.events.add("dragstart", () => {
      this._activeMarkNumber = this._points.findIndex(({id}) => id === mark.properties.get("id"));
    })

    mark.events.add("drag", () => {
      if (this._myPolyline) {
        this._myPolyline.geometry.set(
          this._activeMarkNumber,
          mark.geometry.getCoordinates()
        );
      }
    })

    mark.events.add("dragend", () => {
      const newCoordinates = mark.geometry.getCoordinates();
      this._ymaps.geocode(newCoordinates)
        .then((response) => {
          const data = response.geoObjects.get(0).properties.getAll();
          mark.properties.set(data);

          this._points[this._activeMarkNumber].coordinates = mark.geometry.getCoordinates();
          this._activeMarkNumber = null;
        })
    })

    this._myMap.geoObjects.add(mark);
  }

  _deleteMarkFromMap(mark) {
    this._myMap.geoObjects.remove(mark);
  }

  _changeMarksOrder(nearbyPoint, movedPoint, pastePosition) {
    const nearbyMark = this._marks.find((mark) => mark.properties.get("id") === nearbyPoint.id);
    const movedMark = this._marks.find((mark) => mark.properties.get("id") === movedPoint.id);

    this._marks = changeArrayElementsOrder(this._marks, nearbyMark, movedMark, pastePosition);
  }

  _updatePolyline() {
    if (this._myPolyline) {
      const coordinates = this._points.map(({coordinates}) => coordinates);
      this._myPolyline.geometry.setCoordinates(coordinates);
    } else if (this._points.length > 1) {
      this._createPolyline();
    }
  }

  _createPolyline() {
    const coordinates = this._points.map(({coordinates}) => coordinates);
    this._myPolyline = new this._ymaps.Polyline(coordinates);

    this._myMap.geoObjects.add(this._myPolyline);
  }
}

export default new YandexMapTracker();
