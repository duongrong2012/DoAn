import React from 'react';
import dayjs from 'dayjs';

import styles from './style.module.scss';
import UserPageManagementLayout from 'components/UserPageManagementLayout';
import useAppSelector from 'hooks/useAppSelector';
import { Button, DatePicker, DatePickerProps, Input, Radio, RadioChangeEvent } from 'antd';
import { getGenderLabel } from 'utils';
import { Gender } from 'constants/types/user';
import { dateFormat } from '../../constants';
import ImageFilePreview, { ImageFile } from 'components/ImageFilePreview';

interface State {
    fullName: string,
    email: string,
    phone: string,
    gender: string,
    birthDay: Date | null,
    attachFile: ImageFile,
}

export default function UserAccountPage() {

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const [state, setState] = React.useState<State>({
        fullName: "",
        email: "",
        phone: "",
        gender: getGenderLabel(Gender.MALE),
        birthDay: null,
        attachFile: { filePreview: null, fileSend: null },
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
        // dispatch({ type: ActionTypes.UPDATE_PROFILE, payload: { avatar: state.attachFile } })
    }, [])

    React.useEffect(() => {
        if (user) {
            setState((prevState) => ({
                ...prevState,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
                gender: user.gender,
            }))
        }
    }, [user])
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
            defaultValue={dayjs('2015/01/01', dateFormat)}
            format={dateFormat}
            onChange={onChangeDatePicker}
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