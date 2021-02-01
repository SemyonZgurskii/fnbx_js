export function changeArrayElementsOrder(array, nearbyElement, movedElement, pastePosition) {
    const movedElementIndex = array.indexOf(movedElement);
    array.splice(movedElementIndex, 1);

    const pointIndex = array.indexOf(nearbyElement);

    if (pastePosition === "before") {
      array.splice(pointIndex, 0, movedElement);
    } else {
      array.splice(pointIndex + 1, 0, movedElement);
    }

    return array;
}

