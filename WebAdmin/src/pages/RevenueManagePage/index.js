import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Button, DatePicker } from "antd";
import { Line } from "@ant-design/charts";
import moment from 'moment'
// My comment
import styles from "./styles.module.css";
import * as ActionTypes from "../../redux/actionTypes";
import { formatCurrency } from "../../utils";

const RevenueManagePage = () => {
  const dispatch = useDispatch();

  const revenue = useSelector((state) => state.revenue.revenue);

  const bestSellerProducts = useSelector((state) => state.revenue.bestSellerProducts);

  const [state, setState] = React.useState({
    viewType: 'month',
    yearSelected: new Date().getFullYear()
  });

  const onDatePickerChange = React.useCallback((date, dateString) => {
    setState((prevState) => ({
      ...prevState,
      yearSelected: dateString
    }))
  }, []);

  const onClickChange = React.useCallback((viewType) => () => {
    setState((prevState) => ({
      ...prevState,
      viewType
    }))
  }, []);

  const sharedValues = React.useMemo(() => {
    const values = {
      datepickerDisabled: true,
      monthYearTableTitle: 'Năm',
      chartTitle: 'Năm',
      monthYearIncomeCard: 'Bảng doanh thu theo năm',
      datepickerPlaceholder: 'Chọn năm',
      monthButtonType: 'ghost',
      yearButtonType: 'primary',
      datepickerFormat: 'YYYY',
      monthYearIncomeChart: 'Biểu đồ doanh thu theo năm',
    };

    if (state.viewType === 'month') {
      values.datepickerDisabled = false;
      values.monthYearTableTitle = 'Tháng';
      values.chartTitle = 'Tháng';
      values.monthYearIncomeCard = 'Bảng doanh thu theo tháng';
      values.datepickerPlaceholder = 'Chọn năm';
      values.monthButtonType = 'primary';
      values.yearButtonType = 'ghost';
      values.datepickerFormat = 'YYYY';
      values.monthYearIncomeChart = 'Biểu đồ doanh thu theo tháng';
    }

    return values;
  }, [state.viewType]);

  const monthYearIncomeColumns = [
    {
      title: sharedValues.monthYearTableTitle,
      render: (text, item) => <div>{item.month}</div>
    },
    {
      title: "Doanh thu",
      dataIndex: "price",
      render: (text) => formatCurrency(`${text} VNĐ`),
    },
  ];

  const productIncomeColumns = [
    {
      title: "No.",
      dataIndex: "product_id",
      render: (_, item, index) => index + 1,
    },
    {
      title: <div className="center">Tên sản phẩm</div>,
      dataIndex: "name",
    },
    {
      title: <div className="center">Tổng số sản phẩm bán được</div>,
      dataIndex: "totalSold",
      render: (text, item) => <div className="center">{item.totalSold} sản phẩm</div>
    },
    {
      title: <div className="center">Doanh thu</div>,
      dataIndex: "price",
      render: (text, item) => <div>  {formatCurrency(`${item.totalSold * item.price} VNĐ`)} </div>
    },
  ];

  const config = {
    data: revenue,
    xField: state.viewType,
    yField: "price",
    point: { size: 5, shape: "diamond" },
    xAxis: { title: { text: sharedValues.chartTitle } },
    yAxis: { title: { text: "Doanh thu" } },
  };

  React.useEffect(() => {
    dispatch({
      type: ActionTypes.GET_REVENUE, payload: {
        type: state.viewType.toUpperCase(),
        year: state.yearSelected
      }
    });

    dispatch({ type: ActionTypes.GET_BEST_SELLER_PRODUCTS });
  }, [dispatch, state.viewType, state.yearSelected]);

  return (
    <div className={styles.container}>
      <Card
        title="Danh mục các sản phẩm bán chạy"
        className={(styles.customerDetailCard, styles.cardSeparator)}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="product_id"
          dataSource={bestSellerProducts}
          columns={productIncomeColumns}
        />
      </Card>

      <Card
        bodyStyle={{ padding: 0 }}
        title={sharedValues.monthYearIncomeCard}
        className={(styles.customerDetailCard, styles.cardSeparator)}
      >
        <Table
          dataSource={revenue}
          columns={monthYearIncomeColumns}
          pagination={false}
        />
      </Card>

      <Card
        className={styles.customerDetailCard}
        title={sharedValues.monthYearIncomeChart}
        extra={(
          <>
            <DatePicker
              picker="year"
              inputReadOnly
              allowClear={false}
              className={styles.buttonSeparator}
              format={sharedValues.datepickerFormat}
              disabled={sharedValues.datepickerDisabled}
              placeholder={sharedValues.datepickerPlaceholder}
              onChange={onDatePickerChange}
              value={moment(state.yearSelected, 'yyyy')}
            />

            <Button
              type={sharedValues.monthButtonType}
              className={styles.buttonSeparator}
              onClick={onClickChange("month")}
            >
              Tháng
            </Button>
            <Button
              type={sharedValues.yearButtonType}
              className={styles.buttonSeparator}
              onClick={onClickChange("year")}
            >
              Năm
            </Button>
          </>
        )}
      >
        <Line {...config} />
      </Card>
    </div>
  );
};
export default RevenueManagePage;
