import React from 'react';

import styles from './style.module.scss';
import { Product } from 'constants/types/product';
import { Button } from 'antd';
import classNames from 'classnames';

export interface Props {
    product: Product | null,
}

interface State {
    expanded: boolean,
}

export default function ProductDescription({ product }: Props) {

    const [state, setState] = React.useState<State>({
        expanded: false,
    })

    const onClickExpand = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, expanded: !prevState.expanded }))
    }, [])

    return (
        <div className={`${styles.productDescriptionContainer} column`}>
            <div className='label'>Mô Tả Sản Phẩm</div>
            <div className={classNames({
                'body-container': true,
                [styles.onExpand]: state.expanded
            })}>
                {product?.description}
            </div>
            <Button className='expand-button' onClick={onClickExpand}>
                {state.expanded ? "Thu Gọn" : "Mở Rộng"}
            </Button>
        </div>
    )

}