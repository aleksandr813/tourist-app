import React, { useState } from 'react';
import StartPage from './StartPage/StartPage';
import RoutesPage from './RoutesPage/RoutesPage';

export const PAGES = {
    START: 'START',
    ROUTES: 'ROUTES'
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
        </>
    );
};

export default PageManager;