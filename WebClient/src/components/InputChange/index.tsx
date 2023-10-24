import React from 'react';

import styles from './style.module.scss';
import { Button, Input } from 'antd';

export interface Props {
    value: number,
    onChange: (value: number) => void
}

interface State {
    currentNumber: number,
}

export default function InputChange({ value, onChange }: Props) {

    const onclickDecrease = React.useCallback(() => {
        onChange(value - 1)
    }, [onChange, value])

    const onClickIncrease = React.useCallback(() => {
        onChange(value + 1)
    }, [onChange, value])

    const onChangeInput = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
        if (!isNaN(+e.target.value)) {
            onChange(+e.target.value)
        }
    }, [onChange])

    return (
        <div className={`${styles.inputChangeContainer} flex`}>
            <div className='decrease center' onClick={onclickDecrease}>-</div>
            <Input className='number center' onChange={onChangeInput} value={value} />
            <div className='increase center' onClick={onClickIncrease}>+</div>
        </div>
    )

}