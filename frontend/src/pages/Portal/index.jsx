import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import { ChevronsRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import PortalCard from "../../components/Cards/PortalCard";
import useError from "../../hooks/useError";
import {
  createPortal,
  getPortalList,
  setSearch,
} from "../../store/features/portalSlice";
const { Title } = Typography;

const Portal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const { portalList, isPortalListGetting, isPortalFormSubmitting, search } =
    useSelector((state) => state.portal);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const permission = user.permission.portal;

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);

  const onPortalCreate = async (values) => {
    const payload = {
      ...values,
      user_id: user.user_id,
    };

    try {
      await dispatch(createPortal(payload)).unwrap();
      form.resetFields();
      toggleModal();
      toast.success("Portal created successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getPortalList()).unwrap().catch(handleError);
  }, []);

  const list = portalList
    ? search
      ? portalList.filter((p) =>
          p.name.trim().toLowerCase().includes(search.trim().toLowerCase()),
        )
      : portalList
    : [];

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>PORTALS</Title>
        <Breadcrumb
          items={[
            {
              title: "Portals",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-2 sm:p-4">
        <div className="mb-4 flex flex-col justify-end gap-2 sm:flex-row">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full focus:w-full sm:w-48"
          />
          {permission.add ? (
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={toggleModal}
            >
              Create Portal
            </Button>
          ) : null}
        </div>

        {isPortalListGetting ? (
          <div className="flex min-h-52 items-center justify-center">
            <ThreeDots color="#ce0105" />
          </div>
        ) : null}

        {list.length > 0 && !isPortalListGetting ? (
          <Row gutter={[16, 16]}>
            {list.map((portal) => (
              <Col span={12} md={8} lg={6} key={portal.id}>
                <PortalCard title={portal.name} id={portal.id} />
              </Col>
            ))}
          </Row>
        ) : null}

        {list.length === 0 && !isPortalListGetting ? (
          <div className="flex min-h-52 items-center justify-center">
            <p className="text-lg font-semibold">No portals found.</p>
          </div>
        ) : null}
      </div>

      <Modal
        title="Create Portal"
        open={isModalOpen}
        onCancel={toggleModal}
        footer={null}
      >
        <Form
          name="create-portal"
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onPortalCreate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <div className="flex items-center justify-end gap-2">
            <Button htmlType="reset" onClick={toggleModal} className="w-20">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="w-20"
              loading={isPortalFormSubmitting}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Portal;
