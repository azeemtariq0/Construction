import { Breadcrumb, Segmented, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Step7Form from "../../components/Forms/Quote/Step7Form";
import useError from "../../hooks/useError";
import {
  createQuote,
  getQuote,
  setSelectRequestTypeModal,
  updateQuote,
} from "../../store/features/quoteSlice";

import Step1Form from "../../components/Forms/Quote/Step1Form";
import Step2Form from "../../components/Forms/Quote/Step2Form";
import Step3Form from "../../components/Forms/Quote/Step3Form";
import Step4Form from "../../components/Forms/Quote/Step4Form";
import Step5Form from "../../components/Forms/Quote/Step5Form";
import Step6Form from "../../components/Forms/Quote/Step6Form";
import Step8Form from "../../components/Forms/Quote/Step8Form";
import Step9Form from "../../components/Forms/Quote/Step9Form";

const { Title } = Typography;

const CreateQuote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const {
    isFormSubmitting,
    initialFormValues,
    isQuoteGetting,
    selectedRequestType,
  } = useSelector((state) => state.quote);
  let [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "1";
  const id = searchParams.get("id") || "";

  const goToTab = (key) => {
    setSearchParams({ tab: key, id });
    window.scrollTo(0, 0);
  };

  const onCreate = async (payload) => {
    try {
      if (id) {
        await dispatch(
          updateQuote({
            id,
            data: {
              ...payload,
              tab_no: 1,
              user_id: user.user_id,
              user_type: user.user_type,
            },
          }),
        ).unwrap();
        setSearchParams({ id, tab: "2" });
      } else {
        const { request_id } = await dispatch(
          createQuote({
            ...payload,
            tab_no: 2,
            user_id: user.user_id,
            user_type: user.user_type,
          }),
        ).unwrap();
        setSearchParams({ id: request_id, tab: "2" });
      }
      toast.success("Details has been saved successfully");
      window.scrollTo(0, 0);
    } catch (error) {
      handleError(error);
    }
  };

  const onTab2Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 2,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();
    toast.success("Stallwork has been saved successfully");
    goToTab("3");
  };

  const onTab3Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 3,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();
    toast.success("Equipment has been saved successfully");
    goToTab("4");
  };

  const onTab4Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 4,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();
    toast.success("Milk Delivery has been saved successfully");
    goToTab("5");
  };

  const onTab5Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 5,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();
    toast.success("Automation has been saved successfully");
    goToTab("6");
  };

  const onTab6Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 6,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();
    toast.success("Washing has been saved successfully");
    goToTab("7");
  };

  const onTab7Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 7,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();
    toast.success("Herd Management has been saved successfully");
    goToTab("8");
  };

  const onTab8Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 8,
          user_id: user.user_id,
          user_type: user.user_type,
          burn_id: initialFormValues?.step8?.burn_id || null,
        },
      }),
    ).unwrap();
    toast.success("Feeding has been saved successfully");
    goToTab("9");
  };

  const onTab9Submit = async (payload) => {
    await dispatch(
      updateQuote({
        id,
        data: {
          ...payload,
          tab_no: 9,
          user_id: user.user_id,
          user_type: user.user_type,
        },
      }),
    ).unwrap();

    payload?.submitted_by
      ? toast.success("You have successfully Submitted the request")
      : toast.success("Submit has been saved successfully");
    navigate("/quote");
  };

  useEffect(() => {
    if (!selectedRequestType && !id) {
      dispatch(setSelectRequestTypeModal(true));
      navigate("/quote");
    }

    if (!id) {
      setSearchParams({ tab: "1" });
    } else {
      dispatch(getQuote(id)).unwrap().catch(handleError);
    }
  }, []);

  const forms = {
    1: (
      <Step1Form
        onSubmit={onCreate}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step1}
      />
    ),
    2: (
      <Step2Form
        onBack={() => goToTab("1")}
        onSubmit={onTab2Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step2}
      />
    ),
    3: (
      <Step3Form
        onBack={() => goToTab("2")}
        onSubmit={onTab3Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step3}
      />
    ),
    4: (
      <Step4Form
        onBack={() => goToTab("3")}
        onSubmit={onTab4Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step4}
      />
    ),
    5: (
      <Step5Form
        onBack={() => goToTab("4")}
        onSubmit={onTab5Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step5}
      />
    ),
    6: (
      <Step6Form
        onBack={() => goToTab("5")}
        onSubmit={onTab6Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step6}
      />
    ),
    7: (
      <Step7Form
        onBack={() => goToTab("6")}
        onSubmit={onTab7Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step7}
      />
    ),
    8: (
      <Step8Form
        onBack={() => goToTab("7")}
        onSubmit={onTab8Submit}
        isFormSubmitting={isFormSubmitting}
        initialValues={initialFormValues?.step8}
      />
    ),
    9: (
      <Step9Form
        onBack={() => goToTab("8")}
        onSubmit={onTab9Submit}
        isFormSubmitting={isFormSubmitting}
      />
    ),
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>
          CREATE QUOTE REQUEST
          {selectedRequestType &&
            ` - (${selectedRequestType === 1 ? "Herringbone" : "Rotary"})`}
        </Title>
        <Breadcrumb
          items={[
            {
              title: "Quote Request",
            },
            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      {isQuoteGetting ? (
        <div className="flex min-h-96 items-center justify-center">
          <ThreeDots color="#ce0105" />
        </div>
      ) : null}

      {(id && initialFormValues && !isQuoteGetting) || !id ? (
        <div className="mt-2 min-h-96 rounded-lg bg-white p-2">
          <Segmented
            options={[
              { value: "1", label: "Details" },
              { value: "2", label: "Stallwork", disabled: !id || tab < 2 },
              { value: "3", label: "Equipment", disabled: !id || tab < 3 },
              { value: "4", label: "Milk Delivery", disabled: !id || tab < 4 },
              { value: "5", label: "Automation", disabled: !id || tab < 5 },
              { value: "6", label: "Washing", disabled: !id || tab < 6 },
              {
                value: "7",
                label: "Herd Management",
                disabled: !id || tab < 7,
              },
              { value: "8", label: "Feeding", disabled: !id || tab < 8 },
              { value: "9", label: "Submit", disabled: !id || tab < 9 },
            ]}
            className="w-full"
            value={tab}
            onChange={goToTab}
          />
          <div className="my-4 px-2">{forms[tab]}</div>
        </div>
      ) : null}
    </>
  );
};

export default CreateQuote;
