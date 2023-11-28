import React from 'react';

import styles from './style.module.scss';
import images from 'assets';
import { Button, Select } from 'antd';
import useAppSelector from 'hooks/useAppSelector';
import { CategoryActions } from 'redux/slices/category';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

interface State {
    category: string[] | undefined,
    categoryParams: string[] | null,
}

interface OnChangeData {
    category: State['category']
}

export interface FilterMenuProps {
    onChange: (data: OnChangeData) => void
}

export default function FilterMenu({ onChange }: FilterMenuProps) {

    const [searchParams] = useSearchParams();

    const categoryParams = searchParams.getAll('category');

    const dispatch = useDispatch()

    const categories = useAppSelector((reduxState) => reduxState.category.categories);

    const [state, setState] = React.useState<State>({
        category: categoryParams,
        categoryParams
    },)

    const categorySelectOptions = categories.map((item) => {
        return {
            label: item.name,
            value: item.slug,
        }
    })

    React.useEffect(() => {
        dispatch(CategoryActions.getCategories())
    }, [dispatch])

    React.useEffect(() => {
        if (state.categoryParams) {
            setState((prevState) => ({ ...prevState, category: state.categoryParams ?? undefined }))
        }
    }, [dispatch, state.categoryParams])

    const onChangeCategorySelect = (value: any) => {
        setState((prevState) => ({ ...prevState, category: value }))
    };

    const onClickSearch = React.useCallback(() => {
        onChange({ category: state.category })
    }, [onChange, state.category])

    const filterMenuLayout = [
        {
            label: 'Danh Mục',
            headerIcon: images.menu,
            component: <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', height: 36 }}
                placeholder="Có thể chọn nhiều"
                onChange={onChangeCategorySelect}
                options={categorySelectOptions}
                value={state.category}
            />
        },
    ]

    return (
        <div className={`${styles.filterMenuContainer} column`}>
            {filterMenuLayout.map((item) => (
                <div className='column item-container' key={item.label}>
                    <div className='item-header-container flex'>
                        <img alt='' src={item.headerIcon} className='header-icon' />
                        {item.label}
                    </div>
                    <div className='item-component-container'>
                        {item.component}
                    </div>
                </div>
            ))}
            <Button onClick={onClickSearch} className='search-button' type="primary" icon={<SearchOutlined />} > Tìm Kiếm</Button>
        </div >
    )

}