import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../../components/Forms/ExpenseForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { createExpense } from '../../store/features/expenseSlice';

const CreateExpense = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onExpenseCreate = async (data) => {
    try {
      await dispatch(createExpense(data)).unwrap();
      toast.success('Expense created successfully');
      navigate('/expense');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE EXPENSE</PageHeading>
        <Breadcrumb items={[{ title: 'Expense' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <ExpenseForm onSubmit={onExpenseCreate} />
      </div>
    </>
  );
};

export default CreateExpense;
