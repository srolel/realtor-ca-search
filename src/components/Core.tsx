import * as   React from 'react';
import * as styles from './styles.css';
import Link from './Link';
import { defaultRoute, routes } from '../routes';

/**
 * <Core />
 * Wraps all our child components to provide global navigation.
 * This makes it simple to have a component at the index '/' route
 * of our application.
 */

const Core = ({ children }: { children: JSX.Element }) =>
    <div>
        <header className={styles.header}>
            <Link href={defaultRoute.route}>{defaultRoute.name}</Link>
            {routes.filter(r => !r.route.includes(':')).map(r => <Link key={r.route} href={r.route}>{r.name}</Link>)}
        </header>
        <main className={styles.main}>
            {children}
        </main>
    </div>;

export default Core;
