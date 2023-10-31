import React from 'react';

import styles from './style.module.scss';
import { Rating } from 'constants/types/rating';
import RatingStar from 'components/RatingStar';
import moment from 'moment';
import { Button } from 'antd';
import { ratingListLimit } from '../../constants';
import classNames from 'classnames';

export interface Props {
    ratingList: Rating[],
    onClickMoreRating: () => void,
}

export default function ProductRating({ ratingList, onClickMoreRating }: Props) {

    const isShowLoadButton = React.useMemo(() => (
        ratingList.length % ratingListLimit === 0 && ratingList.length > 0
    ), [ratingList.length])

    return (
        <div className={`${styles.productRatingContainer} column`}>
            <div className='label'>Đánh Giá Sản Phẩm</div>
            <div className='body-container column'>
                {ratingList.map((item, index) => (
                    <div className={classNames({
                        "item-container": true,
                        "flex": true,
                        [styles.noBorder]: index === ratingList.length - 1
                    })}
                        key={item._id}
                    >
                        <img alt='' className='item-avatar' src={item.user.avatar} />
                        <div className='item-infor-container column'>
                            <div className='item-name'>{item.user.fullName}</div>
                            <RatingStar ratingNumber={item.rating} size={14} />
                            <div className='item-comment'>{item.comment}</div>
                        </div>
                        <div className='item-time'>{moment(item.createdAt).format("DD-MM-YYYY")}</div>
                    </div>
                ))}
            </div>
            {
                isShowLoadButton && (
                    <Button className='more-rating' onClick={onClickMoreRating}>
                        Xem Thêm Đánh Giá
                    </Button>
                )
            }
        </div >
    )

}