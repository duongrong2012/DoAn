import Modal from 'antd/es/modal/Modal';
import React from 'react';
import TextArea from 'antd/es/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import styles from './style.module.scss'
import RatingStar from '../RatingStar';

interface Props {
    open: boolean,
    oncancel: () => void,
    onSubmitRating: (rating: number, comment: string) => void,
    ratingProductLoading: boolean,
}

export default function RatingModal({ open, oncancel, onSubmitRating, ratingProductLoading }: Props) {
    const [state, setState] = React.useState({
        productRating: 0,
        starDescrip: "",
        productComment: "",
    })

    const onMouseEnter = React.useCallback((item: string, index: number) => {
        setState((prevState) => ({ ...prevState, productRating: index + 1, starDescrip: item }))
    }, [])

    const onChangeFeedback = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState((prevState) => ({ ...prevState, productComment: event.target.value }))
    }, [])

    const onClickCommentButt = React.useCallback(() => {
        onSubmitRating(state.productRating, state.productComment)
    }, [onSubmitRating, state.productComment, state.productRating])

    React.useEffect(() => {
        if (open) {
            setState((prevState) => ({ ...prevState, productRating: 0, starDescrip: "", productComment: "" }))
        }
    }, [open])

    return (
        <Modal open={open} onCancel={oncancel} footer={null} className={`${styles.authModalContainer} column`}>
            <div className='rating-title'>Đánh Giá</div>
            <div className='descrip'>Đánh Giá Số Sao</div>
            <div className='star-rating-row flex'>
                <RatingStar
                    size={36}
                    ratingNumber={state.productRating}
                    onMouseEnter={onMouseEnter}
                    starSpacing={8}
                />
                <div className='star-descrip'>{state.starDescrip}</div>
            </div>
            <div className='descrip'>Đánh Giá Sản Phẩm  &#40;Không Quá 500 Chữ&#41;</div>
            <TextArea
                placeholder="Nhập Đánh Giá"
                autoSize={{ minRows: 5, maxRows: 5 }}
                maxLength={500}
                showCount
                onChange={onChangeFeedback}
                value={state.productComment}
            />
            <button
                className='custom-but self-center'
                onClick={onClickCommentButt}
                disabled={ratingProductLoading}
            >
                {ratingProductLoading && <Spin indicator={<LoadingOutlined style={{ color: "white" }} />} />}
                Gửi Đánh Giá
            </button>
        </Modal>
    )
}