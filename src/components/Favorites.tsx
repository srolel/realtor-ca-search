import { observer } from 'mobx-react';
import Listings from './Listings';

@observer
export class Favorites extends Listings {
    getListings() {
        return this.props.appState.favoriteSearchResults;
    }
}

export default Favorites;