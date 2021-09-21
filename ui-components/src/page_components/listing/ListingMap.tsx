import React, { useState, useCallback, useEffect, useRef } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import MapGL, { Marker } from "react-map-gl"
import { loadModules } from 'esri-loader';
// import Map from "@arcgis/core/Map";
// import MapView from "@arcgis/core/views/MapView";

import "./ListingMap.scss"
import { MultiLineAddress, Address } from "../../helpers/address"

export interface ListingMapProps {
  address?: Address
  listingName?: string
  enableCustomPinPositioning?: boolean
  setCustomMapPositionChosen?: (customMapPosition: boolean) => void
  setLatLong?: (latLong: LatitudeLongitude) => void
}

export interface LatitudeLongitude {
  latitude: number
  longitude: number
}

export interface Viewport {
  width: string | number
  height: string | number
  latitude?: number
  longitude?: number
  zoom: number
}

const ListingMap = (props: ListingMapProps) => {
  const mapDiv = useRef(null);

  useEffect(() => {
    // setRenderMap(false)
    if (mapDiv.current) {
      loadModules(['esri/views/MapView', 'esri/Map', 'esri/Graphic']).then(([MapView, Map, Graphic]) => {
        const map = new Map({
          basemap: "streets-vector",
        })
        const mapView = new MapView({
          map: map,
          container: mapDiv.current,
          center: [props.address?.longitude, props.address?.latitude],
          zoom: 13
        })

        // create point
        const point = {
          type: "point",
          // todo use viewport lat/long instead?
          longitude: props.address?.longitude,
          latitude: props.address?.latitude
        };

        // Create a symbol for drawing the point
        const markerSymbol = {
          type: "simple-marker",
          color: [24, 37, 42],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        };

        // Create a graphic and add the geometry and symbol to it
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        });

        mapView.graphics.add(pointGraphic)
      })
    }
  }, [props.address?.latitude, props.address?.longitude])

  const [marker, setMarker] = useState({
    latitude: props.address?.latitude,
    longitude: props.address?.longitude,
  })

  const [viewport, setViewport] = useState({
    latitude: marker.latitude,
    longitude: marker.longitude,
    width: "100%",
    height: 400,
    zoom: 13,
  } as Viewport)

  const onViewportChange = (viewport: Viewport) => {
    // width and height need to be set here to work properly with
    // the responsive wrappers
    const newViewport = { ...viewport }
    newViewport.width = "100%"
    newViewport.height = 400
    setViewport(newViewport)
  }

  useEffect(() => {
    onViewportChange({
      ...viewport,
      latitude: props.address?.latitude,
      longitude: props.address?.longitude,
    })
    setMarker({
      latitude: props.address?.latitude,
      longitude: props.address?.longitude,
    })
  }, [props.address?.latitude, props.address?.longitude, props.enableCustomPinPositioning])


  if (
    !props.address ||
    !props.address.latitude ||
    !props.address.longitude ||
    !viewport.latitude ||
    !viewport.longitude
  )
    return null

  return (
    <div className="listing-map">
      <div className="addressPopup">
        {props.listingName && <h3 className="text-caps-tiny">{props.listingName}</h3>}
        <MultiLineAddress address={props.address} />
      </div>
      <div style={{height: "400px"}} ref={mapDiv}></div>
    </div>
  )
}
export { ListingMap as default, ListingMap }
