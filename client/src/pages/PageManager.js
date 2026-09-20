import React, { useState } from 'react';
import StartPage from './StartPage/StartPage';

export const PAGES = {
    START: 'START',
    JOPA: 'JOPA'
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
        </>
    );
};

export default PageManager;