import React, { useState } from 'react';
import StartPage from './StartPage/StartPage';
import RoutesPage from './RoutesPage/RoutesPage';

export const PAGES = {
    START: 'START',
    ROUTES: 'ROUTES'
};

const PageManager = () => {
    const [page, setPage] = useState(PAGES.START);

    const props = {
        setPage,
        PAGES,
    };

    return (
        <>
            {page === PAGES.START && <StartPage {...props} />}
            {page === PAGES.ROUTES && <RoutesPage {...props} />}
        </>
    );
};

export default PageManager;