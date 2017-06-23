import { computed, extendObservable, action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

export class Query<T> {

    private _component: React.ComponentClass<any>;

    static fromJS<T extends { [index: string]: any }>(arr: T | T[], presets?: any) {
        const q = new Query<T>();
        const first = Array.isArray(arr) ? arr[0] : arr;
        for (let k of Object.keys(first)) {
            let obs;
            const prop = first[k];
            const values = Array.isArray(arr) ? arr.map(x => x[k]) : null;
            if (typeof prop === 'object' && !Array.isArray(prop)) {
                const next = values || prop;
                obs = Query.fromJS(next, presets ? presets[k] : null);
            } else if (NumberSearchable.detect(prop, k)) {
                obs = new NumberSearchable(presets && presets[k]);
            } else if (values && SelectSearchable.detect(values)) {
                obs = new SelectSearchable(values, presets && presets[k]);
            } else if (StringSearchable.detect(prop, k)) {
                obs = new StringSearchable(presets && presets[k]);
            } else if (BooleanSearchable.detect(prop, k)) {
                obs = new BooleanSearchable(presets && presets[k]);
            }
            if (obs) extendObservable(q, { [k]: obs });
        }

        return q;
    }

    get component() {
        if (!this._component) this._component = this.getComponent();
        return this._component;
    }

    get observables() {
        const queryInstance = this as any as { [index: string]: Query<any> };
        const mobxManager = (queryInstance as any).$mobx;
        return mobxManager ? Object.keys(mobxManager.values) : [];
    }

    get innerQueries() {
        return this as any as { [index: string]: Query<any> };
    }

    match(obj: T) {
        for (let k of this.observables) {
            if (!this.innerQueries[k].match((obj as any)[k])) {
                return false;
            }
        }
        return true;
    }

    getComponent() {
        const queryInstance = this;

        @observer
        class QueryComponent extends React.Component<any, any> {
            render() {
                return <div style={{ marginLeft: 50 }}>
                    {queryInstance.observables.map(k => {
                        const Q = queryInstance.innerQueries[k];
                        return <div key={k}>
                            {k}: <div><Q.component /></div>
                        </div>;
                    })}
                </div>;
            }
        }

        return QueryComponent;

    }
}

(window as any).Q = Query;

abstract class Searchable<T> extends Query<T> {
    constructor(args?: any) {
        super();
        if (args) Object.assign(this, args);
    }
}

class NumberSearchable extends Searchable<any> {

    @observable min: string = this.min || '';
    @observable max: string = this.max || '';

    static detect = (value: any, key?: string) => {
        return typeof value === 'number' ||
            value === 'number' ||
            (typeof value === 'string' && value.match(/^\$[,0-9]+$/)) ||
            (typeof value === 'string' && value.match(/^[0-9]+ sqft$/)) ||
            (typeof value === 'string' && value.match(/^[0-9]+$/));
    }

    match(value: any) {
        if (!this.min && !this.max) return true;
        if (typeof value === 'string') {
            value = parseFloat(value.replace(/[$,a-zA-Z]*/g, ''));
        }

        if (this.min && !this.max) {
            return value >= this.min;
        }
        if (!this.min && this.max) {
            return value <= this.max;
        }
        if (this.min && this.max) {
            return value >= this.min && value <= this.max;
        }
        return true;
    }

    getComponent() {
        const queryInstance = this;

        @observer
        class NumberSearchableComponent extends React.Component<any, any> {

            @action onChangeMin = (e: any) => {
                const { value } = e.target;
                queryInstance.min = value;
            }

            @action onChangeMax = (e: any) => {
                const { value } = e.target;
                queryInstance.max = value;
            }

            render() {
                return <div>
                    <input type="number" onChange={this.onChangeMin} value={queryInstance.min} />
                    <input type="number" onChange={this.onChangeMax} value={queryInstance.max} />
                </div>;
            }
        }

        return NumberSearchableComponent;
    }
}

class StringSearchable extends Searchable<any> {
    @observable value: string = this.value || '';

    static detect = (value: any, key?: string) => typeof value === 'string' || value === 'string';

    match(value: string) {
        if (!this.value) return true;
        if (value == null) return false;
        return this.value.toLowerCase().split('&').every(and => and.split('|').some(or => {
            const neg = or.startsWith('!');
            or = or.replace(/^!/, '');
            return (value.toLowerCase().includes(or) === (neg ? false : true));
        }));
    }

    getComponent() {
        const queryInstance = this;

        @observer
        class StringSearchableComponent extends React.Component<any, any> {

            @action onChange = (e: any) => {
                const { value } = e.target;
                queryInstance.value = value;
            }

            render() {
                return <div><input value={queryInstance.value} onChange={this.onChange} /></div>;
            }
        }

        return StringSearchableComponent;
    }
}

class BooleanSearchable extends Searchable<any> {
    @observable checked: boolean = this.checked || false;

    static detect = (value: any, key?: string) => typeof value === 'boolean' || value === 'boolean';

    match(value: boolean) {
        if (this.checked == null) return true;
        if (value == null) return false;
        return this.checked === value;
    }

    getComponent() {
        const queryInstance = this;

        @observer
        class StringSearchableComponent extends React.Component<any, any> {

            @action onChange = (e: any) => {
                const { checked } = e.target;
                queryInstance.checked = checked;
            }

            render() {
                return <div><input type="checkbox" checked={queryInstance.checked} onChange={this.onChange} /></div>;
            }
        }

        return StringSearchableComponent;
    }
}

type Stringable = string;

class SelectSearchable extends Searchable<any> {
    @observable selected: Stringable[] | null = this.selected || null;
    @observable options: Stringable[] = [];

    @computed get sortedOptions() {
        if (this.options.every(x => Boolean(x.toString().match(/^[0-9]+$/)))) {
            return this.options.map(parseFloat).sort((a, b) => a - b).map(x => x.toString());
        }
        return [...this.options].sort();
    }

    constructor(values: Stringable[], presets: any) {
        super(presets);
        this.options = SelectSearchable.getOptions(values);
    }

    static getOptions = (values: Stringable[]) => {
        return [...new Set(values.filter(Boolean).map(x => x))];
    }

    static detect = (values: Stringable[], key?: string) => {
        if (typeof values[0] === 'object') return false;
        return SelectSearchable.getOptions(values).length < 30;
    }

    match(value: Stringable) {
        if (this.selected == null) return true;
        if (this.selected.length === 0) return true;
        if (value == null) return false;
        return this.selected.includes(value);
    }

    getComponent() {
        const queryInstance = this;

        @observer
        class StringSearchableComponent extends React.Component<any, any> {

            @action onChange = (e: any) => {
                const { value } = e.target;
                const { selected } = queryInstance;
                if (!value) queryInstance.selected = [];
                else if (!selected) queryInstance.selected = [value];
                else if (selected.includes(value)) {
                    selected.splice(selected.indexOf(value), 1);
                } else {
                    queryInstance.selected = selected.concat(value);
                }
            }

            render() {
                const { selected } = queryInstance;
                return <div>
                    <select multiple value={selected ? toJS(selected) : []} onChange={this.onChange}>
                        <option></option>
                        {queryInstance.sortedOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>;
            }
        }

        return StringSearchableComponent;
    }
}

