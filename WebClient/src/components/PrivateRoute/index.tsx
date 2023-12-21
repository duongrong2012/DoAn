import React from 'react';
import { useNavigate } from 'react-router-dom';

import routes from 'constants/routes';
import useClientAppSelector from 'hooks/useAppSelector';
import useAdminAppSelector from '../../admin/hooks/useAppSelector';
import adminRoutes from 'admin/constants/routes';


interface Props {
    Component: React.ComponentType;
}

export default function PrivateRoute({ Component }: Props) {
    const navigate = useNavigate();

    const user = useClientAppSelector((reduxState) => reduxState.auth.user)

    const admin = useAdminAppSelector((reduxState) => reduxState.auth.admin)

    const checkLoginLoading = useClientAppSelector((reduxState) => reduxState.auth.checkLoginLoading)

    const isAdminRoute = window.location.pathname.startsWith('/quan-tri')

    if (checkLoginLoading) return null;

    if (isAdminRoute && !admin) {
        navigate(adminRoutes.Login().path)

        return null;
    } else if (!isAdminRoute && !user) {
        navigate(routes.Home().path)

        return null;
    }

    return <Component />;
}