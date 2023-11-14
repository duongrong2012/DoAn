import React from 'react';
import { useDispatch } from 'react-redux';

import styles from './style.module.scss';
import FilterMenu from 'components/FilterMenu';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductActions } from 'redux/slices/product';
import useAppSelector from 'hooks/useAppSelector';
import routes from 'constants/routes';
import { Pagination } from 'antd';
import { getQueryStringValue } from 'utils/query';

interface State {
    category: string[] | null,
    categoryParams: string[] | null,
}

export default function FilterPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const categoryParams = searchParams.getAll('category');

    const dispatch = useDispatch()

    const productListByFilter = useAppSelector((reduxState) => reduxState.product.productListByFilter);

    const totalProduct = useAppSelector((reduxState) => reduxState.product.totalProduct);

    const [state, setState] = React.useState<State>({
        category: categoryParams,
        categoryParams
    },)

    const currentPage = React.useMemo(() => {
        return getQueryStringValue(searchParams, "page", 1)
    }, [searchParams])


    const pageSize = React.useMemo(() => {
        return getQueryStringValue(searchParams, "limit", 20)
    }, [searchParams])

    React.useEffect(() => {
        if (state.categoryParams) {
            dispatch(ProductActions.getProducts({ stateName: "productListByFilter", limit: pageSize, page: currentPage, category: state.categoryParams }))
        }
    }, [currentPage, dispatch, pageSize, state.categoryParams])

    const onChangePagination = React.useCallback((page: number, pageSize: number) => {
        setSearchParams({ page: page.toString(), limit: pageSize.toString() })
    }, [setSearchParams])

    return (
        <div className={`${styles.filterPageContainer} flex resolution`}>
            <FilterMenu />
            <div className='column-two-container column'>
                <Pagination
                    showQuickJumper
                    current={currentPage}
                    total={totalProduct}
                    pageSize={pageSize}
                    pageSizeOptions={[50, 100, 1]}
                    showSizeChanger={true}
                    onChange={onChangePagination}
                />
                <div className='product-container flex'>
                    {productListByFilter.map((item) => (
                        <Link key={item._id} className='item-container column' to={routes.ProductDetail(item.slug).path}>
                            <img className='item-image' alt="" src={item.images[0].url} />
                            <div className='item-infor-container column'>
                                <div className='item-name long-content'>{item.name}</div>
                                <div className='flex item-detail center'>
                                    <div className='item-price'>đ{item.price}</div>
                                    <div className='total-item-sold'>đ{item.totalSold}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    )

}