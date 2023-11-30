import React from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import styles from './style.module.scss';
import UserPageManagementLayout from 'components/UserPageManagementLayout';
import useAppSelector from 'hooks/useAppSelector';
import { Button, DatePicker, DatePickerProps, Input, Radio, RadioChangeEvent, notification } from 'antd';
import { getGenderLabel } from 'utils';
import { Gender } from 'constants/types/user';
import { dateFormat } from '../../constants';
import ImageFilePreview, { ImageFile } from 'components/ImageFilePreview';
import { AuthActions } from 'redux/slices/auth';
import { UpdateProfilePayload } from 'redux/slices/auth/payload';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface State {
    fullName: string,
    email: string,
    phone: string,
    gender: Gender,
    birthDay: Date | null,
    attachFile: ImageFile,
    currentPassword: string,
    newPassword: string,
    confirmNewpassword: string,

}

export default function UserAccountPage() {
    const dispatch = useDispatch()

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const [state, setState] = React.useState<State>({
        fullName: user!.fullName,
        email: user!.email,
        phone: user!.phone,
        gender: user!.gender,
        birthDay: user!.birthDay ? new Date(user!.birthDay) : null,
        attachFile: { filePreview: null, fileSend: null },
        currentPassword: "",
        newPassword: "",
        confirmNewpassword: "",
    })

    const onChangeInput = React.useCallback((fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState((prevState) => ({ ...prevState, [fieldName]: event.target.value }))
    }, [])

    const onChangeRadioGr = React.useCallback((event: RadioChangeEvent) => {
        setState((prevState) => ({ ...prevState, gender: event.target.value }))
    }, [])

    const onChangeDatePicker = React.useCallback<NonNullable<DatePickerProps['onChange']>>((date) => {
        setState((prevState) => ({ ...prevState, birthDay: date?.toDate() ?? null }))
    }, [])

    const onChangeImage = React.useCallback((image: ImageFile) => {
        setState((prevState) => ({ ...prevState, attachFile: image }))
    }, [])

    const onClickSaveButton = React.useCallback(() => {
        const payload: UpdateProfilePayload = {
            birthDay: state.birthDay?.toISOString(),
            fullName: state.fullName,
            gender: state.gender,
            phone: state.phone,
            currentPassword: state.currentPassword,
            newPassword: state.newPassword,
        }

        if (state.attachFile.filePreview && state.attachFile.fileSend) {
            payload.avatar = state.attachFile as NonNullable<UpdateProfilePayload['avatar']>
        }
        if (state.newPassword !== state.confirmNewpassword) {
            return notification.error({ message: "Mật khẩu mới và Mật khẩu xác nhận phải giống nhau" })
        }

        dispatch(AuthActions.updateProfile(payload))
    }, [dispatch, state.attachFile, state.birthDay, state.confirmNewpassword, state.currentPassword, state.fullName, state.gender, state.newPassword, state.phone])

    const userInforFields = [{
        label: 'Họ Và Tên',
        component: <Input className='custom-input' value={state.fullName} onChange={onChangeInput("fullName")} />
    }, {
        label: 'Email',
        component: <Input className='custom-input' value={state.email} onChange={onChangeInput("email")} placeholder='Vui lòng nhập email' />
    }, {
        label: 'Số Điện Thoại',
        component: <Input className='custom-input' value={state.phone} onChange={onChangeInput("phone")} placeholder='Vui lòng nhập số điện thoại' />
    }, {
        label: 'Giới Tính',
        component:
            <Radio.Group onChange={onChangeRadioGr} value={state.gender}>
                {Object.keys(Gender).map((key) => (
                    <Radio key={key} value={key}>{getGenderLabel(key as Gender)}</Radio>
                ))}
            </Radio.Group>
    }, {
        label: 'Ngày Sinh',
        component: <DatePicker
            value={state.birthDay ? dayjs(state.birthDay) : null}
            format={dateFormat}
            onChange={onChangeDatePicker}
            placeholder='Chọn Ngày'
        />
    }, {
        label: 'Mật Khẩu Hiện Tại',
        component: <Input.Password
            className='custom-input'
            value={state.currentPassword}
            onChange={onChangeInput('currentPassword')}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
    }, {
        label: 'Mật khẩu Mới',
        component: <Input.Password
            className='custom-input'
            value={state.newPassword}
            onChange={onChangeInput('newPassword')}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
    }, {
        label: 'Xác Nhận Mật Khẩu Mới',
        component: <Input.Password
            className='custom-input'
            value={state.confirmNewpassword}
            onChange={onChangeInput('confirmNewpassword')}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
    },]

    return (
        <UserPageManagementLayout>
            <div className={`${styles.userAccountPageContainer} column`}>
                <div className={`${styles.customBorder} container-label`}>Hồ Sơ Của Tôi</div>
                <div className='row-container flex'>
                    <div className='body-container column'>
                        {userInforFields.map((item) => (
                            <div className='item-container center' key={item.label} data-label={item.label}>
                                <div className='item-label'>{item.label}</div>
                                <div className='component-container'>
                                    {item.component}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`changeAvatarTabContainer alignCenter column`}>
                        <ImageFilePreview onChange={onChangeImage} value={user?.avatar} />
                        <div className='descrip'>Kiểu tệp phải là hình ảnh và dung lượng không vượt quá 5mb</div>
                    </div >
                </div>
                <Button onClick={onClickSaveButton} className='save-button'>Lưu</Button>
            </div >
        </UserPageManagementLayout>
    )

}