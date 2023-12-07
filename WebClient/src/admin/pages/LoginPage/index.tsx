import React from 'react';
import styles from './style.module.scss';
import images from 'assets';
import { Button, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface State {
    username: string,
    password: string,
}

export default function LoginPage() {

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

    }, [])
    console.log(state.username)
    return (
        <div className={`${styles.LoginPageContainer} column resolution`}>
            <img className='logo' src={images.logo} alt='' />
            <div className='login-form-container column'>
                <div className='input-label'>Tên Đăng Nhập</div>
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
                <div className='input-label'>Mật Khẩu</div>
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
        </div >
    )

}