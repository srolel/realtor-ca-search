import * as React from 'react';
import Link from './Link';
// import AppState from '../stores/AppState';
import * as styles from './styles.css';

interface Props {
    currentPage: number;
    numItems: number;
    itemsPerPage: number;
}

export class Pagination extends React.Component<Props, any> {

    get lastPage() {
        const { numItems, itemsPerPage } = this.props;
        return Math.ceil(numItems / itemsPerPage);
    }

    render() {
        const { numItems, itemsPerPage, currentPage } = this.props;
        return <div>
            <Link href={`/${Math.max(1, currentPage - 1)}`}>Prev</Link>
            {Array(Math.ceil(numItems / itemsPerPage)).fill(0).map((_, i) => <Link className={styles.pageLink} key={i} href={`/${i + 1}`}>{i + 1}</Link>)}
            <Link href={`/${Math.min(this.lastPage, currentPage + 1)}`}>Next</Link>
        </div>;
    }
}

export default Pagination;