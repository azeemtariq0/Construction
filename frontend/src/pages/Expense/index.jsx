import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Select, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/heading/PageHeading';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  bulkDeleteExpense,
  deleteExpense,
  getExpenseForPrint,
  getExpenseList,
  setExpenseDeleteIDs,
  setExpenseListParams
} from '../../store/features/expenseSlice';
// import { createExpensePrint } from '../../utils/prints/expense-print';

const Expense = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.expense
  );
  const { user } = useSelector((state) => state.auth);
  // const permissions = user.permission.expense;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedExpenseNo = useDebounce(params.document_identity, 500);
  const debouncedChargeNo = useDebounce(params.charge_no, 500);
  const debouncedQuotationNo = useDebounce(params.quotation_no, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const onExpenseDelete = async (id) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
      toast.success('Purchase order deleted successfully');
      dispatch(getExpenseList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteExpense(deleteIDs)).unwrap();
      toast.success('Purchase orders deleted successfully');
      closeDeleteModal();
      await dispatch(getExpenseList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printExpense = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getExpenseForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createExpensePrint(data);
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Expense Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setExpenseListParams({ document_date: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null
    },
    {
      title: (
        <div>
          <p>Expense No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.expense_no}
            onChange={(e) =>
              dispatch(
                setExpenseParams({
                  expense_no: e.target.value
                })
              )
            }
          />
        </div>
      ),
      dataIndex: 'expense_no',
      key: 'expense_no',
      sorter: true,
      width: 165,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Expense Type</p>
          <Select
            className="w-full font-normal"
            size="small"
            value={params.type}
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
            onChange={(e) =>
              dispatch(
                setExpenseParams({
                  type: e
                })
              )
            }
          />
        </div>
      ),
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      width: 180,
      ellipsis: true
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { purchase_order_id }) => (
        <div className="flex items-center gap-2">
         
            <>
              <Tooltip title="Print">
                <Button
                  size="small"
                  type="primary"
                  className="bg-rose-600 hover:!bg-rose-500"
                  icon={<FaRegFilePdf size={14} />}
                  onClick={() => printExpense(expense_id)}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Link to={`/expense/edit/${expense_id}`}>
                  <Button
                    size="small"
                    type="primary"
                    className="bg-gray-500 hover:!bg-gray-400"
                    icon={<MdOutlineEdit size={14} />}
                  />
                </Link>
              </Tooltip>
            </>
     
          
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete?"
                description="After deleting, You will not be able to recover it."
                okButtonProps={{ danger: true }}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onExpenseDelete(expense_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
       
        </div>
      ),
      width: 105,
      fixed: 'right'
    }
  ];


  useEffect(() => {
    dispatch(getExpenseList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    debouncedSearch,
    debouncedExpenseNo
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>PURCHASE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Purchase Order' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setExpenseListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
           
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModalIsOpen(true)}
                disabled={!deleteIDs.length}>
                Delete
              </Button>
            
              <Link to="/expense/create">
                <Button type="primary">Add New</Button>
              </Link>
            
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            {
                  type: 'checkbox',
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) =>
                    dispatch(setExpenseDeleteIDs(selectedRowKeys))
                }
            }
            
          loading={isListLoading}
          className="mt-2"
          rowKey="purchase_order_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} purchase orders`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setExpenseListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these purchase orders?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default Expense;
