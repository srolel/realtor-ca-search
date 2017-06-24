import * as React from 'react';
// import AppState from '../stores/AppState';
// import * as styles from './styles.css';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';

interface Marker {
    position: {
        lat: number;
        lng: number;
    };
}

interface Props {
    onMapLoad: Function;
    markers: Marker[];
}

const getCenter = (markers: Marker[]) => {
    if (markers.length === 0) return { lat: 43.458045, lng: -80.519082 };
    return markers[0].position;
};

const AsyncGettingStartedExampleGoogleMap = withScriptjs(withGoogleMap((props: Props) => (
    <GoogleMap defaultZoom={11} defaultCenter={getCenter(props.markers)}>
        {props.markers.map((marker, index) => (
            <Marker
                key={index}
                {...marker}
            />
        ))}
    </GoogleMap>
)));

const url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBbD_GmWJf_1Ewl7F6xcp2mKAHr-8tVSQg';

export class Map extends React.Component<{ markers: Marker[] }, any> {
    render() {
        return <AsyncGettingStartedExampleGoogleMap
            googleMapURL={url}
            loadingElement={
                <div style={{ height: `100%`, width: '100%' }}>
                    Loading...
                </div>
            }
            containerElement={
                <div style={{ height: `100%`, width: '100%' }} />
            }
            mapElement={
                <div style={{ height: `100%`, width: '100%' }} />
            }
            markers={this.props.markers}
        />;
    }
}

export default Map;