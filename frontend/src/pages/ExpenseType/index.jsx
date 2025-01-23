import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegSave } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import PageHeading from '../../components/heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  addNewExpenseType,
  bulkDeleteExpenseType,
  createExpenseType,
  deleteExpenseType,
  getExpenseTypeList,
  removeNewExpenseType,
  setExpenseTypeDeleteIDs,
  setExpenseTypeEditable,
  setExpenseTypeListParams,
  updateExpenseType,
  updateExpenseTypeListValue
} from '../../store/features/expenseTypeSlice';

const ExpenseType = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, isSubmitting, deleteIDs } =
    useSelector((state) => state.expenseType);

  const debouncedSearch = useDebounce(params.search, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updateExpenseTypeListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error('Name field is required');

    try {
      // await dispatch(createExpenseType({ name })).unwrap();
      // await dispatch(getExpenseTypeList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { expenseType_id, name } = record;

    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(
        updateExpenseType({
          id: expenseType_id,
          data: { name }
        })
      ).unwrap();
      // await dispatch(getExpenseTypeList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === 'new') return dispatch(removeNewExpenseType());
    dispatch(setExpenseTypeEditable({ id, editable: false }));
  };

  const onExpenseTypeDelete = async (id) => {
    try {
      // await dispatch(deleteExpenseType(id)).unwrap();
      // toast.success('Expense Type deleted successfully');
      // dispatch(getExpenseTypeList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      // await dispatch(bulkDeleteExpenseType(deleteIDs)).unwrap();
      // toast.success('Expense Types deleted successfully');
      closeDeleteModal();
      // await dispatch(getExpenseTypeList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, expenseType_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(expenseType_id, 'name', e.target.value)}
          />
        ) : (
          <span>{name}</span>
        )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) =>
        created_at ? (
          dayjs(created_at).format('MM-DD-YYYY hh:mm A')
        ) : (
          <span className="text-gray-400">AUTO</span>
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const { expenseType_id, editable } = record;

        if (editable) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Cancel" onClick={() => onCancel(expenseType_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === expenseType_id}
                  onClick={() => (expenseType_id === 'new' ? onCreate(record) : onUpdate(record))}
                />
              </Tooltip>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit">
              <Button
                size="small"
                type="primary"
                className="bg-gray-500 hover:!bg-gray-400"
                icon={<MdOutlineEdit size={14} />}
                onClick={() =>
                  dispatch(
                    setExpenseTypeEditable({
                      id: expenseType_id,
                      editable: true
                    })
                  )
                }
              />
            </Tooltip>

            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete?"
                description="After deleting, You will not be able to recover it."
                okButtonProps={{ danger: true }}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onExpenseTypeDelete(expenseType_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
      width: 70,
      fixed: 'right'
    }
  ];

  useEffect(() => {
    // dispatch(getExpenseTypeList(params)).unwrap().catch(handleError);
  }, [params.page, params.limit, params.sort_column, params.sort_direction, debouncedSearch]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>Expense Type</PageHeading>
        <Breadcrumb items={[{ title: 'Expense Type' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setExpenseTypeListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled={!deleteIDs.length}>
              Delete
            </Button>
            <Button type="primary" onClick={() => dispatch(addNewExpenseType())}>
              Add New
            </Button>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: deleteIDs,
            onChange: (selectedRowKeys) => dispatch(setExpenseTypeDeleteIDs(selectedRowKeys)),
            getCheckboxProps: (record) => ({
              disabled: record.expenseType_id === 'new'
            })
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setExpenseTypeListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          loading={isListLoading}
          rowKey="expenseType_id"
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} Expense types`
          }}
          dataSource={[
            {
              expenseType_id: '1',
              name: 'Test',
              editable: false
            }
          ]}
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
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these Expense Type?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default ExpenseType;
