import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../../components/Forms/ExpenseForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { getExpenseForm, updateExpenseForm } from '../../store/features/expenseFormSlice';

const EditExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.expenseForm);

  const onExpenseUpdate = async (data) => {
    try {
      await dispatch(updateExpense({ id, data })).unwrap();
      toast.success('Expense updated successfully');
      navigate('/expense');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getExpense(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT EXPENSE</PageHeading>
        <Breadcrumb items={[{ title: 'Expense' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <ExpenseForm mode="edit" onSubmit={onExpenseUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditExpense;
