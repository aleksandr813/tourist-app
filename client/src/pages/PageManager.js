import React, { useState } from 'react';
import StartPage from './StartPage/StartPage';
import RoutesPage from './RoutesPage/RoutesPage';
import CreateRoutePage from './CreateRoutePage/CreateRoutePage';
import EditRoutPage from './EditRoutPage/EditRoutPage';
import RoutePage from './RoutePage/RoutePage';

export const PAGES = {
    START: 'START',
    ROUTES: 'ROUTES',
    CREATE_ROUTE: 'CREATE_ROUTE',
    EDIT: 'EDIT',
    ROUTE: 'ROUTE',
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
            {page === PAGES.EDIT && <EditRoutPage {...props} />}
            {page === PAGES.ROUTE && <RoutePage {...props} />}
        </>
    );
};

export default PageManager;