/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useError from '../../hooks/useError';
import {
  addExpenseDetail,
  changeExpenseDetailOrder,
  changeExpenseDetailValue,
  copyExpenseDetail,
  getExpenseForPrint,
  removeExpenseDetail
} from '../../store/features/expenseSlice';
// import { createExpensePrint } from '../../utils/prints/expense-print';
import AsyncSelect from '../AsyncSelect';

const ExpenseForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, expenseDetails } = useSelector(
    (state) => state.expense
  );

  const POType = Form.useWatch('type', form);
  const isBillable = POType === 'Billable';

  const { user } = useSelector((state) => state.auth);
  // const permissions = user.permission;

  let totalAmount = 0;
  let totalQuantity = 0;

  expenseDetails.forEach((detail) => {
    totalAmount += +detail.amount || 0;
    totalQuantity += +detail.quantity || 0;
  });

  const onFinish = (values) => {
    if (!totalAmount) return toast.error('Total Amount cannot be zero');

    const data = {
      type: values.type,
      remarks: values.remarks,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      total_amount: totalAmount
    };

    onSubmit(data);
  };

  const printExpense = async () => {
    const loadingToast = toast.loading('Loading print...');
    try {
      const data = await dispatch(getExpenseForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createExpensePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addExpenseDetail())}
        />
      ),
      key: 'order',
      dataIndex: 'order',
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(changeExpenseDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === expenseDetails.length - 1}
              onClick={() => {
                dispatch(changeExpenseDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50
    },
    {
      title: 'Expense Title',
      dataIndex: 'expense_title',
      key: 'expense_title',
      render: (_, { expense_title }, index) => {
        return (
          <DebounceInput
            value={expense_title}
            onChange={(value) =>
              dispatch(
                changeExpenseDetailValue({
                  index,
                  key: 'expense_title',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 120
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (_, { remarks }, index) => {
        return (
          <DebounceInput
            value={remarks}
            onChange={(value) =>
              dispatch(
                changeExpenseDetailValue({
                  index,
                  key: 'remarks',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 120
    },
    {
      title: 'Ext. Cost',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} disabled />
      ),
      width: 120
    },
    
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addExpenseDetail())}
        />
      ),
      key: 'action',
      render: (_, { id }, index) => (
        <Dropdown
          trigger={['click']}
          arrow
          menu={{
            items: [
              {
                key: '1',
                label: 'Add',
                onClick: () => dispatch(addExpenseDetail(index))
              },
              {
                key: '2',
                label: 'Copy',
                onClick: () => dispatch(copyExpenseDetail(index))
              },
              {
                key: '3',
                label: 'Delete',
                danger: true,
                onClick: () => dispatch(removeExpenseDetail(id))
              }
            ]
          }}>
          <Button size="small">
            <BsThreeDotsVertical />
          </Button>
        </Dropdown>
      ),
      width: 50,
      fixed: 'right'
    }
  ];

  return (
    <Form
      name="expense"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={
        mode === 'edit'
          ? initialFormValues
          : {
              document_date: dayjs(),
              type: 'Inventory'
            }
      }
      scrollToFirstError>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">Expense No:</span>
        <span
          className={`ml-4 text-amber-600 ${
            mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
          } rounded px-1`}
          onClick={() => {
            if (mode !== 'edit') return;
            navigator.clipboard.writeText(initialFormValues?.expense_no);
            toast.success('Copied');
          }}>
          {mode === 'edit' ? initialFormValues?.expense_no : 'AUTO'}
        </span>
      </p>
      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="document_date"
            label="Expense Date"
            rules={[{ required: true, message: 'Expense date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="expense_type"
            label="Expense Type"
            rules={[
              {
                required: true,
                message: 'Expense Type is required'
              }
            ]}>
            <Select
              options={[
                {
                  value: 'Inventory',
                  label: 'Inventory'
                },
                {
                  value: 'Billable',
                  label: 'Billable'
                }
              ]}
            />
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={12}>
        <Col span={16} >
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>


      <Divider orientation="left" className="!border-gray-300">
        Expense Items
      </Divider>

      <Table
        columns={columns}
        dataSource={expenseDetails}
        rowKey={'id'}
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      />

      <div className="flex flex-wrap gap-4 rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
       
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/purchase-order">
          <Button className="w-28">Cancel</Button>
        </Link>
        {mode === 'edit' ? (
          <Button
            type="primary"
            className="w-28 bg-rose-600 hover:!bg-rose-500"
            // onClick={printPurchaseOrder}
          >
            Print
          </Button>
        ) : null}
        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting}
          onClick={() => form.submit()}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ExpenseForm;
