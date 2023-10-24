import images from '../../assets';
import { Button, Input } from 'antd';
import React from 'react';

import styles from './style.module.scss'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export interface LoginTabProps {
    onLogin: (username: string, password: string) => void
}

interface State {
    username: string,
    password: string,
}

export default function LoginTab({ onLogin }: LoginTabProps) {

    const [state, setState] = React.useState<State>({
        username: "",
        password: "",
    },)

    const onChange = React.useCallback((fieldName: keyof State): React.ChangeEventHandler<HTMLInputElement> => {
        return function (event) {
            setState((prevState) => ({ ...prevState, [fieldName]: event.target.value }))
        }
    }, [])

    const onClickLogin = React.useCallback(() => {
        onLogin(state.username, state.password)
    }, [onLogin, state.password, state.username])

    return (
        <div className={`${styles.loginTabContainer} column center`}>
            <div className='white-user-container center'>
                <img alt='' src={images.whiteUser} className='white-user' />
            </div>
            <div className='login-Label'>Đăng Nhập</div>
            <Input
                prefix={
                    <img alt="" src={images.blackUser}
                        className='default-icon' />
                }
                placeholder="Tên Đăng Nhập"
                maxLength={50}
                className='auth-input'
                onChange={onChange("username")}
            />
            <Input.Password
                prefix={
                    <img alt="" src={images.padLock}
                        className='default-icon' />
                }
                placeholder="Mật Khẩu"
                maxLength={50}
                className='auth-input'
                onChange={onChange("password")}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <Button className='login-butt center' onClick={onClickLogin}>Đăng Nhập</Button>
        </div>
    )
}