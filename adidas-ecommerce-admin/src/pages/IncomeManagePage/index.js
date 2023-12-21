import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Button, DatePicker } from "antd";
import { Line } from "@ant-design/charts";
// My comment
import styles from "./styles.module.css";
import * as ActionTypes from "../../redux/actionTypes";
import { formatCurrency } from "../../utils";

const InComeManagePage = () => {
  const dispatch = useDispatch();

  const budget = useSelector((state) => state.budget.budgetList);

  const yearbudget = useSelector((state) => state.budget.yearBudgetList);

  const [state, setState] = React.useState({
    viewType: 'month',
    yearSelected: new Date().getFullYear()
  });

  const onDatePickerChange = React.useCallback((date, dateString) => {
    setState((prevState) => ({
      ...prevState,
      yearSelected: dateString
    }))
    dispatch({
      type: ActionTypes.GET_YEARBUDGET,
      payload: {
        viewType: state.viewType,
        dateString
      }
    });
  }, [dispatch, state.viewType]);

  const onClickChange = React.useCallback((viewType) => () => {
    setState((prevState) => ({
      ...prevState,
      viewType
    }))
    dispatch({
      type: ActionTypes.GET_YEARBUDGET,
      payload: {
        viewType,
        dateString: state.yearSelected
      }
    });
  }, [dispatch, state.yearSelected]);

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
      values.monthYearIncomeTableTitle = 'Tháng';
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
      dataIndex: state.viewType,
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
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Doanh số",
      dataIndex: "quantity",
    },
    {
      title: "Doanh thu",
      dataIndex: "price",
      render: (text) => formatCurrency(`${text} VNĐ`),
    },
  ];

  const config = {
    data: yearbudget,
    xField: state.viewType,
    yField: "price",
    point: { size: 5, shape: "diamond" },
    xAxis: { title: { text: sharedValues.chartTitle } },
    yAxis: { title: { text: "Doanh thu" } },
  };

  React.useEffect(() => {
    const now = new Date()
    dispatch({ type: ActionTypes.GET_BUDGET });
    dispatch({
      type: ActionTypes.GET_YEARBUDGET,
      payload: {
        dateString: now.getFullYear(),
        viewType: 'month'
      }
    });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Card
        title="Danh mục các sản phẩm bán chạy"
        className={(styles.customerDetailCard, styles.cardSeparator)}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="product_id"
          dataSource={budget}
          pagination={{ pageSize: 4 }}
          columns={productIncomeColumns}
        />
      </Card>

      <Card
        bodyStyle={{ padding: 0 }}
        title={sharedValues.monthYearIncomeCard}
        className={(styles.customerDetailCard, styles.cardSeparator)}
      >
        <Table
          dataSource={yearbudget}
          pagination={{ pageSize: 4 }}
          columns={monthYearIncomeColumns}
          rowKey={(record) => `${+record.price}_${Date.now()}`}
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
export default InComeManagePage;
