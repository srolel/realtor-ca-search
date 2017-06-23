import { observer } from 'mobx-react';
import Listings from './Listings';

@observer
export class Home extends Listings {
    getListings() {
        return this.props.appState.searchResults;
    }
}

export default Home;