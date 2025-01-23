import { Breadcrumb, Segmented, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Step1Form from "../../components/Forms/Quote/Step1Form";
import Step2Form from "../../components/Forms/Quote/Step2Form";
import Step3Form from "../../components/Forms/Quote/Step3Form";
import Step4Form from "../../components/Forms/Quote/Step4Form";
import Step5Form from "../../components/Forms/Quote/Step5Form";
import Step6Form from "../../components/Forms/Quote/Step6Form";
import Step7Form from "../../components/Forms/Quote/Step7Form";
import ChatModal from "../../components/Modals/ChatModal";
import LogTable from "../../components/Tables/LogTable";
import useError from "../../hooks/useError";
import { getQuote } from "../../store/features/quoteSlice";
import Step8Form from "../../components/Forms/Quote/Step8Form";
import Step9Form from "../../components/Forms/Quote/Step9Form";
const { Title } = Typography;

const ViewQuote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const handleError = useError();
  const { isQuoteGetting, initialFormValues, selectedRequestType } =
    useSelector((state) => state.quote);
  let [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "1";

  const goToTab = (key) => {
    setSearchParams({ tab: key });
    window.scrollTo(0, 0);
  };

  const forms = {
    1: (
      <Step1Form
        onSubmit={() => goToTab("2")}
        initialValues={initialFormValues?.step1}
        mode="view"
      />
    ),
    2: (
      <Step2Form
        onBack={() => goToTab("1")}
        onSubmit={() => goToTab("3")}
        initialValues={initialFormValues?.step2}
        mode="view"
      />
    ),
    3: (
      <Step3Form
        onBack={() => goToTab("2")}
        onSubmit={() => goToTab("4")}
        initialValues={initialFormValues?.step3}
        mode="view"
      />
    ),
    4: (
      <Step4Form
        onBack={() => goToTab("3")}
        onSubmit={() => goToTab("5")}
        initialValues={initialFormValues?.step4}
        mode="view"
      />
    ),
    5: (
      <Step5Form
        onBack={() => goToTab("4")}
        onSubmit={() => goToTab("6")}
        initialValues={initialFormValues?.step5}
        mode="view"
      />
    ),
    6: (
      <Step6Form
        onBack={() => goToTab("5")}
        onSubmit={() => goToTab("7")}
        initialValues={initialFormValues?.step6}
        mode="view"
      />
    ),
    7: (
      <Step7Form
        onBack={() => goToTab("6")}
        onSubmit={() => goToTab("8")}
        mode="view"
        initialValues={initialFormValues?.step7}
      />
    ),
    8: (
      <Step8Form
        onBack={() => goToTab("7")}
        onSubmit={() => goToTab("9")}
        mode="view"
        initialValues={initialFormValues?.step8}
      />
    ),
    9: <Step9Form onBack={() => goToTab("8")} mode="view" />,
    10: <LogTable />,
  };

  useEffect(() => {
    dispatch(getQuote(id)).unwrap().catch(handleError);
  }, [id]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>
          VIEW QUOTE REQUEST
          {selectedRequestType &&
            ` - (${selectedRequestType === 1 ? "Herringbone" : "Rotary"})`}
        </Title>
        <Breadcrumb
          items={[
            {
              title: "View Request",
            },

            {
              title: "View",
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

      {!isQuoteGetting && initialFormValues ? (
        <>
          <div className="mt-2 min-h-96 rounded-lg bg-white p-2">
            <Segmented
              options={[
                { value: "1", label: "Details" },
                { value: "2", label: "Stallwork" },
                { value: "3", label: "Equipment" },
                { value: "4", label: "Milk Delivery" },
                { value: "5", label: "Automation" },
                { value: "6", label: "Washing" },
                { value: "7", label: "Herd Management" },
                { value: "8", label: "Feeding" },
                { value: "9", label: "Submit" },
                { value: "10", label: "Logs" },
              ]}
              className="w-full"
              value={tab}
              onChange={goToTab}
            />
            <div className="my-4 px-2">{forms[tab]}</div>
          </div>
          {initialFormValues?.status !== "Draft" && (
            <ChatModal quoteNo={initialFormValues?.step1?.document_no} />
          )}
        </>
      ) : null}
    </>
  );
};

export default ViewQuote;
