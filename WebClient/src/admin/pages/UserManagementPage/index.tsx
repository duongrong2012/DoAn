import React from 'react';
import styles from './style.module.scss';
import { useDispatch } from 'react-redux';
import useAppSelector from 'admin/hooks/useAppSelector';

interface State {

}

export default function UserManagementPage() {

    const dispatch = useDispatch()

    const admin = useAppSelector((reduxState) => reduxState.auth.admin);
    console.log('admin:', admin)
    return (
        <div className={`${styles.userManagementPageContainer} column resolution`}>
            aaaaaaaa
        </div >
    )

}