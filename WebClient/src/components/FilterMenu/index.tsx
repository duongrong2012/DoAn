import React from 'react';

import styles from './style.module.scss';
import images from 'assets';
import { Select } from 'antd';
import useAppSelector from 'hooks/useAppSelector';
import { CategoryActions } from 'redux/slices/category';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

interface State {
    category: string[] | null,
    categoryParams: string[] | null,
}

export default function FilterMenu() {

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
            setState((prevState) => ({ ...prevState, category: state.categoryParams }))
        }
    }, [dispatch, state.categoryParams])

    const onChangeCategorySelect = (value: any) => {
        setState((prevState) => ({ ...prevState, category: value }))
    };

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
        {
            label: 'Danh mục 2',
            component: <div>bb</div>
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
        </div >
    )

}