import * as React from 'react';
import AppState from '../stores/AppState';
import * as styles from './styles.css';

export abstract class Listings extends React.Component<{ appState: AppState }, any> {

    onFavorite = (listing: AppState['data'][0]) => () => {
        return this.props.appState.toggleFavorite(listing);
    }

    getListings(): AppState['data'] {
        throw new Error('getListings must be implemented.');
    }

    get listings() {
        return this.getListings();
    }

    render() {
        return (
            <div className={styles.home}>
                <div className={styles.left}>
                    {this.props.appState.query && React.createElement(this.props.appState.query.component)}
                </div>
                <div className={styles.right}>
                    <br />
                    <div>{this.listings.length} results.</div>
                    <br />
                    <table>
                        <thead>
                            <tr>
                                <th>Favorite</th>
                                <th>Address</th>
                                <th>Photo</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.listings.map(result => {
                                const isFavorite = this.props.appState.isFavorite(result);
                                return <tr key={result.Id} onClick={this.onFavorite(result)} className={`${isFavorite ? styles.favorite : ''} ${styles.row}`}>
                                    <td><input type="checkbox" readOnly checked={isFavorite} /></td>
                                    <td>{result.Property.Address.AddressText}</td>
                                    <td>{result.Property.Photo && <img src={result.Property.Photo[0].LowResPath} />}</td>
                                    <td>{result.Property.Price}</td>
                                    <td>{result.PublicRemarks}</td>
                                    <td><a onClick={e => e.stopPropagation()} target="_blank" href={`http://realtor.ca${result.RelativeDetailsURL}`}>{result.MlsNumber}</a></td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Listings;