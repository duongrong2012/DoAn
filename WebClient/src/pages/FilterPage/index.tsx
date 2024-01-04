import React from 'react';
import { Pagination } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

import routes from 'constants/routes';
import useAppSelector from 'hooks/useAppSelector';
import { getQueryStringValue } from 'utils/query';
import { ProductActions } from 'redux/slices/product';
import FilterMenu, { FilterMenuProps } from 'components/FilterMenu';

import styles from './style.module.scss';
import images from 'assets';

interface State {

}

export default function FilterPage() {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams();

    const totalProduct = useAppSelector((reduxState) => reduxState.product.totalProduct);

    const productListByFilter = useAppSelector((reduxState) => reduxState.product.productListByFilter);

    const currentPage = React.useMemo(() => {
        return getQueryStringValue(searchParams, "page", 1)
    }, [searchParams])

    const categoryParams = React.useMemo(() => {
        return searchParams.getAll('category');
    }, [searchParams])

    const pageSize = React.useMemo(() => {
        return getQueryStringValue(searchParams, "limit", 20)
    }, [searchParams])

    const keyword = React.useMemo(() => {
        return getQueryStringValue(searchParams, "keyword", '')
    }, [searchParams])

    React.useEffect(() => {
        dispatch(ProductActions.getProducts({
            stateName: "productListByFilter",
            keyword,
            limit: pageSize,
            page: currentPage,
            category: categoryParams
        }))
    }, [categoryParams, currentPage, dispatch, keyword, pageSize])

    const onChangePagination = React.useCallback((page: number, pageSize: number) => {
        setSearchParams({ page: page.toString(), limit: pageSize.toString() }, { replace: false })
    }, [setSearchParams])

    const onFilterChange = React.useCallback<FilterMenuProps['onChange']>((data) => {
        const params: Record<string, string | string[]> = {}

        if (data.category) {
            params.category = data.category
        }

        setSearchParams(prevState => {
            Object.keys(params).forEach((key) => {
                prevState.set(key, params[key] as string);
            });

            return prevState;
        })
    }, [setSearchParams])

    return (
        <div className={`${styles.filterPageContainer} flex resolution`}>
            <FilterMenu onChange={onFilterChange} />

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
                    {productListByFilter.length !== 0 ? (productListByFilter.map((item) => (
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
                    ))) : (
                        <div className='empty-comment-container center'>
                            <img alt='' src={images.emptyIcon} className='empty-icon' />
                            <div>Không tìm thấy sản phẩm</div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )

}