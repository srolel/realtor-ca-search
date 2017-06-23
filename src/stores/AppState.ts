import { autorun, computed, observable, action } from 'mobx';

import { Listing } from './types';
import { Query } from './QueryComponents';

export interface AppStateProps {
  data: Listing[];
}

/*
* This is the entry point for the app's state. All stores should go here.
*/
class AppState implements AppStateProps {
  @observable data: Listing[] = [];
  @observable searched = '';
  @observable query: Query<Listing> | null = null;
  @observable favorites: string[] = [];

  getSearchResults(arr: Listing[]) {
    return this.query
      ? arr.filter(r => this.query!.match(r))
      : arr;
  }

  @computed get searchResults() {
    return this.getSearchResults(this.data);
  }

  @computed get favoriteSearchResults() {
    return this.getSearchResults(this.favoriteListings);
  }

  @computed get favoriteListings(): Listing[] {
    return this.favorites.map(f => this.data.find(d => d.MlsNumber === f)!).filter(Boolean);
  }

  localStorageQueryName = '__query__';
  localStorageStateName = '__state__';

  saveQuery() {
    localStorage.setItem(this.localStorageQueryName, JSON.stringify(this.query));
  }

  loadQuery(): object | null {
    const stored = localStorage.getItem(this.localStorageQueryName);
    return stored ? JSON.parse(stored) : null;
  }

  constructor() {
    this.getData();
    this.getSavedState();
    autorun(() => {
      this.setSavedState();
    });
  }

  setSavedState() {
    localStorage.setItem(this.localStorageStateName, JSON.stringify({
      searched: this.searched,
      favorites: this.favorites
    }));
  }

  @action getSavedState() {
    const stored = localStorage.getItem(this.localStorageStateName);
    const savedState = stored ? JSON.parse(stored) : null;
    if (savedState) Object.assign(this, savedState);
  }

  disposer: Function;

  @action setData = (data: Listing[]) => {
    this.data = data;
    const saved = this.loadQuery();
    this.query = Query.fromJS(data, saved);
    this.disposer = autorun(() => {
      this.saveQuery();
    });
  }

  async getData() {
    const data = await fetch('/api/get-data');
    const json = await data.json();
    this.setData(json);
  }

  @action setSearch = (term: string) => this.searched = term;

  @action toggleFavorite = (listing: Listing) => {
    this.favorites = this.favorites || [];
    if (this.favorites.includes(listing.MlsNumber)) {
      this.favorites.splice(this.favorites.indexOf(listing.MlsNumber), 1)
    } else {
      this.favorites.push(listing.MlsNumber);
    }
  }

  isFavorite = (listing: Listing) => {
    return this.favorites.includes(listing.MlsNumber);
  }

  reload(store?: AppStateProps) {
    if (store) this.data = store.data;
    return this;
  }

  unload() {
    this.disposer();
  }
}

export default AppState;