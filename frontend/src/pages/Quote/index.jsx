import {
  Breadcrumb,
  Button,
  Image,
  Input,
  Modal,
  Popconfirm,
  Typography,
} from "antd";
import { ChevronsRight, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import InternalTable from "../../components/Tables/InternalTable";
import PartnerTable from "../../components/Tables/PartnerTable";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  bulkDeleteQuotes,
  getQuotesList,
  setQuoteListParams,
  setSelectedRequestType,
  setSelectRequestTypeModal,
} from "../../store/features/quoteSlice";
const { Title } = Typography;

import HerringboneParlourImage from "../../assets/images/herringbone-parlour.jpg";
import RotaryParlourImage from "../../assets/images/rotary-parlour.jpg";
import { useNavigate } from "react-router-dom";

const Parlour = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const userType = user.user_type;
  const quotePermission = user.permission["parlour-request"];
  const { params, deleteIDs, selectRequestTypeModal } = useSelector(
    (state) => state.quote,
  );
  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.customer_name, 500);
  const debouncedSubmittedBy = useDebounce(params.submitted_by, 500);
  const debouncedAssignee = useDebounce(params.assignee, 500);

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotes(deleteIDs)).unwrap();
      toast.success("Quotes deleted successfully");
      await dispatch(
        getQuotesList({
          ...params,
          user_type: userType,
          user_id: user.user_id,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCreate = (type) => {
    dispatch(setSelectedRequestType(type));
    dispatch(setSelectRequestTypeModal(false));
    navigate("/quote/create");
  };

  useEffect(() => {
    dispatch(
      getQuotesList({ ...params, user_type: userType, user_id: user.user_id }),
    )
      .unwrap()
      .catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.submitted_date1,
    params.submitted_date2,
    params.status,
    params.country_id,
    params.request_type,
    debouncedSearch,
    debouncedName,
    debouncedSubmittedBy,
    debouncedAssignee,
  ]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>QUOTE REQUEST LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "Quote Request",
            },
            {
              title: "Quote Request List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-2">
          <p className="text-base">Quote Request List</p>
          <div className="flex items-center gap-2">
            {userType === "Partner" && quotePermission.add ? (
              <Button
                type="primary"
                icon={<Plus className="h-5 w-5" />}
                className="mb-2 sm:mb-0"
                onClick={() => dispatch(setSelectRequestTypeModal(true))}
              >
                Create New
              </Button>
            ) : null}

            {quotePermission.delete && userType === "Partner" ? (
              <Popconfirm
                title="Delete the quotes"
                description="Are you sure to delete these quotes?"
                onConfirm={onBulkDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<Trash2 size={16} />}
                  disabled={deleteIDs.length === 0}
                />
              </Popconfirm>
            ) : null}
          </div>
        </div>

        <div className="p-2 sm:p-4">
          {userType === "Internal" && (
            <>
              <Input
                placeholder="Search Here..."
                className="mb-4 w-full sm:w-52"
                value={params.search}
                onChange={(e) =>
                  dispatch(
                    setQuoteListParams({ ...params, search: e.target.value }),
                  )
                }
              />
              <InternalTable />
            </>
          )}
          {userType === "Partner" && <PartnerTable />}
        </div>
      </div>

      <Modal
        open={selectRequestTypeModal}
        onCancel={() => dispatch(setSelectRequestTypeModal(false))}
        footer={null}
        title="Select Request Type"
      >
        {/* Create two button for choose (Herringbone or Rotary) */}
        <div className="my-4 mt-6 flex flex-col gap-2">
          <div
            className="flex cursor-pointer items-center gap-4 rounded-md border border-gray-400 p-2 transition-all hover:bg-slate-50"
            onClick={() => onCreate(1)}
          >
            <div className="h-32 w-32" onClick={(e) => e.stopPropagation()}>
              <Image
                className="rounded-md"
                src={HerringboneParlourImage}
                alt="Herringbone Parlour"
              />
            </div>
            <p className="text-lg font-semibold">Herringbone</p>
          </div>
          <div
            className="flex cursor-pointer items-center gap-4 rounded-md border border-gray-400 p-2 transition-all hover:bg-slate-50"
            onClick={() => onCreate(2)}
          >
            <div className="h-32 w-32" onClick={(e) => e.stopPropagation()}>
              <Image
                className="rounded-md"
                src={RotaryParlourImage}
                alt="Rotary Parlour"
              />
            </div>
            <p className="text-lg font-semibold">Rotary</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Parlour;
