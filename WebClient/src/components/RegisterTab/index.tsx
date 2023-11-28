import images from '../../assets';
import { Button, Input, Radio, RadioChangeEvent } from 'antd';
import React from 'react';

import styles from './style.module.scss'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Gender } from 'constants/types/user';
import { getGenderLabel } from 'utils';
export interface RegisterTabProps {
    authLoading: boolean,
    onRegister: (username: string, password: string, email: string, phone: string, name: string, gender: Gender) => void
}

interface State {
    username: string,
    password: string,
    email: string,
    phone: string,
    fullName: string,
    gender: Gender,
}

export default function RegisterTab({ onRegister, authLoading }: RegisterTabProps) {

    const [state, setState] = React.useState<State>({
        username: "",
        password: "",
        email: "",
        phone: "",
        fullName: "",
        gender: Gender.MALE,
    },)

    const onChange = React.useCallback((fieldName: keyof State): React.ChangeEventHandler<HTMLInputElement> => {
        return function (event) {
            setState((prevState) => ({ ...prevState, [fieldName]: event.target.value }))
        }
    }, [])

    const onChangeRadioGr = React.useCallback((event: RadioChangeEvent) => {
        setState((prevState) => ({ ...prevState, gender: event.target.value }))
    }, [])

    const onClickRegister = React.useCallback(() => {
        onRegister(state.username, state.password, state.email, state.phone, state.fullName, state.gender)
    }, [onRegister, state.email, state.fullName, state.gender, state.password, state.phone, state.username])

    return (
        <div className={`${styles.registerTabContainer} column center`}>
            <div className='white-user-container center'>
                <img alt='' src={images.whiteUser} className='white-user' />
            </div>
            <div className='register-Label'>Đăng Kí</div>
            <Input
                prefix={
                    <img alt="" src={images.blackUser}
                        className='default-icon' />
                }
                placeholder="Tên Đăng Nhập*"
                maxLength={50}
                className='auth-input'
                onChange={onChange("username")}
            />
            <Input.Password
                prefix={
                    <img alt="" src={images.padLock}
                        className='default-icon' />
                }
                placeholder="Mật Khẩu*"
                maxLength={50}
                className='auth-input'
                onChange={onChange("password")}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <Input
                prefix={
                    <img alt="" src={images.email}
                        className='default-icon' />
                }
                placeholder="Email*"
                maxLength={50}
                className='auth-input'
                onChange={onChange("email")}
            />
            <Input
                prefix={
                    <img alt="" src={images.phoneNumber}
                        className='default-icon' />
                }
                placeholder="Số Điện Thoại*"
                className='auth-input'
                onChange={onChange("phone")}
            />
            <Input
                prefix={
                    <img alt="" src={images.fullName}
                        className='default-icon' />
                }
                placeholder="Họ Và Tên*"
                maxLength={50}
                className='auth-input'
                onChange={onChange("fullName")}
            />
            <Radio.Group onChange={onChangeRadioGr} value={state.gender}>
                {Object.keys(Gender).map((key) => (
                    <Radio value={key}>{getGenderLabel(key as Gender)}</Radio>
                ))}
            </Radio.Group>
            <Button className='register-butt center' onClick={onClickRegister} loading={authLoading}>Đăng Kí</Button>
        </div>
    )
}