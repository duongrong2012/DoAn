import React from 'react';
import classNames from 'classnames';

import styles from './style.module.scss'
import { StarFilled, StarOutlined } from '@ant-design/icons';

interface Props {
    ratingNumber: number,
    size?: number,
    onClick?: () => void,
    onMouseEnter?: (item: string, index: number) => void,
    starSpacing?: number,
}

// type IndexType = 1 | 2 | 3 |4 //ket qua cua index as keyof typeof ratingLabel

export default function RatingStar({ ratingNumber, size = 25, onClick, onMouseEnter: onMouseEnterProps, starSpacing }: Props) {
    const starArray = React.useMemo(() => {
        const ratingLabel = {
            0: "Rất Tệ",
            1: "Không Hay Lắm",
            2: "Bình Thường",
            3: "Hay",
            4: "Rất Hay",
        }
        return Array.from({ length: 5 }, (item, index) => ratingLabel[index as keyof typeof ratingLabel]) //ep kieu du lieu cho index ve 1,2,3,4
    }, [])

    const starStyle = React.useMemo((): React.CSSProperties => ({
        fontSize: size
    }), [size])

    const starSpacingStyle = React.useMemo((): React.CSSProperties => ({
        gap: starSpacing
    }), [starSpacing])

    const onMouseEnter = React.useCallback((item: string, index: number) => () => {
        onMouseEnterProps?.(item, index)
    }, [onMouseEnterProps])

    return (
        <div
            className={classNames({
                [styles.starRatingContainer]: true,
                [styles.triggerPointer]: onClick,
            })}
            onClick={onClick}
            style={starSpacingStyle}
        >
            {
                starArray.map((item, index) => {
                    const starProps = {
                        className: 'star-rating',
                        title: item,
                        key: index,
                        style: starStyle,
                        onMouseEnter: onMouseEnter(item, index)
                    }

                    if (ratingNumber >= index + 1)
                        return (
                            <StarFilled {...starProps} />
                        )

                    return (
                        <StarOutlined {...starProps} />
                    )
                })
            }
        </div >
    )
}
