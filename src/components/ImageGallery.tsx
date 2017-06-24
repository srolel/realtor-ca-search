import ReactImageGallery from 'react-image-gallery';
import * as React from 'react';
import { Listing } from '../stores/types';

export class ImageGallery extends React.Component<{listing: Listing}, any> {

    get images() {
        return this.props.listing.Property.Photo.map(x => ({original: x.HighResPath, thumbnail: x.LowResPath}));
    }

    render() {
        return (
            <ReactImageGallery
                items={this.images}/>
        );
    }

}

export default ImageGallery;