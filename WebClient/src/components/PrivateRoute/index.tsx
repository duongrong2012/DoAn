import React from 'react';
import { useNavigate } from 'react-router-dom';

import routes from 'constants/routes';
import useAppSelector from 'hooks/useAppSelector';


interface Props {
    Component: React.ComponentType;
}

export default function PrivateRoute({ Component }: Props) {
    const navigate = useNavigate();

    const user = useAppSelector((reduxState) => reduxState.auth.user)

    const checkLoginLoading = useAppSelector((reduxState) => reduxState.auth.checkLoginLoading)

    if (checkLoginLoading) return null;

    if (!user) {
        navigate(routes.Home().path)

        return null;
    }

    return <Component />;
}