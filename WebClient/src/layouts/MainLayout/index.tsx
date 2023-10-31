import React from 'react';
import NavigationBar from 'components/NavigationBar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <>
            <NavigationBar />
            <Outlet />
        </>
    );
}

export default MainLayout;
