import Modal from 'antd/es/modal/Modal';
import React from 'react';
import { useDispatch } from 'react-redux';

import styles from './style.module.scss'
import { Tabs } from 'antd';
import LoginTab, { LoginTabProps } from '../LoginTab';
import RegisterTab, { RegisterTabProps } from '../RegisterTab';
import useAppSelector from 'hooks/useAppSelector';
import { AuthActions } from 'redux/slices/auth';

export default function AuthModal() {
    const dispatch = useDispatch();

    const isModalOpen = useAppSelector((reduxState) => reduxState.auth.isModalOpen);

    const authLoading = useAppSelector((reduxState) => reduxState.auth.authLoading);

    const oncancel = React.useCallback(() => {
        dispatch(AuthActions.toggleAuthModal())
    }, [dispatch])

    const onLogin = React.useCallback<LoginTabProps['onLogin']>((username, password) => {
        dispatch(AuthActions.login({ username, password }))
    }, [dispatch])

    const onRegister = React.useCallback<RegisterTabProps['onRegister']>((username, password, email, phone, fullName, gender) => {
        dispatch(AuthActions.register({ username, password, email, phone, fullName, gender }))
    }, [dispatch])

    const authTab = React.useMemo(() => {
        return [
            {
                key: '1',
                label: <div className={`${styles.customLabel} ${styles.firstLabel}`}>Đăng Nhập</div>,
                children: <LoginTab onLogin={onLogin} />,
            },
            {
                key: '2',
                label: <div className={styles.customLabel}>Đăng Ký</div>,
                children: <RegisterTab onRegister={onRegister} authLoading={authLoading} />
            },
        ]
    }, [authLoading, onLogin, onRegister])

    return (
        <Modal open={isModalOpen} onCancel={oncancel} footer={null} className={`${styles.authModalContainer}`}>
            <div className='tabs-container'>
                <Tabs defaultActiveKey="1" items={authTab} />
            </div>
        </Modal>
    )
}