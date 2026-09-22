import React, { useState } from 'react';
import StartPage from './StartPage/StartPage';
import RoutesPage from './RoutesPage/RoutesPage';
import CreateRoutePage from './CreateRoutePage/CreateRoutePage';

export const PAGES = {
    START: 'START',
    ROUTES: 'ROUTES',
    CREATE_ROUTE: 'CREATE_ROUTE',
};

const PageManager = () => {
    const [page, setPage] = useState(PAGES.START);
    const [selectedCity, setSelectedCity] = useState(null);

    const props = {
        setPage,
        PAGES,
        selectedCity,
        setSelectedCity,
    };

    return (
        <>
            {page === PAGES.START && <StartPage {...props} />}
            {page === PAGES.ROUTES && <RoutesPage {...props} />}
            {page === PAGES.CREATE_ROUTE && <CreateRoutePage {...props} />}
        </>
    );
};

export default PageManager;