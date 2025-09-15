
'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle, MapContainerProps } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps extends MapContainerProps {
  children: (components: {
    TileLayer: typeof TileLayer,
    Marker: typeof Marker,
    Popup: typeof Popup,
    Circle: typeof Circle
  }) => React.ReactNode;
}

const Map = ({ children, ...props }: MapProps) => {
  return (
    <MapContainer {...props}>
      {children({ TileLayer, Marker, Popup, Circle })}
    </MapContainer>
  )
}

export default Map;
