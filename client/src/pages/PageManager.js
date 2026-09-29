import React, { useState } from 'react';
import StartPage from './StartPage/StartPage';
import RoutesPage from './RoutesPage/RoutesPage';
import CreateRoutePage from './CreateRoutePage/CreateRoutePage';
import EditRoutPage from './EditRoutPage/EditRoutPage';
import RoutePage from './RoutePage/RoutePage';
import UserRoutesPage from './UserRoutesPage/UserRoutesPages';

export const PAGES = {
    START: 'START',
    ROUTES: 'ROUTES',
    CREATE_ROUTE: 'CREATE_ROUTE',
    EDIT: 'EDIT',
    ROUTE: 'ROUTE',
    USERROUTE: 'USERROUTE'
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
            {page === PAGES.USERROUTE && <UserRoutesPage {...props} />}
        </>
    );
};

export default PageManager;