import { Button, Modal, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { CircleEllipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useError from "../../hooks/useError";
import { getQuoteLogs, setLogParams } from "../../store/features/quoteSlice";

const FirstRow = ({ data }) => {
  const getData = (data, isNew = false) => {
    if (Array.isArray(data)) {
      return (
        <span>
          {data.map((item) => (
            <Tag key={item} color={isNew ? "green" : "red"}>
              {item}
            </Tag>
          ))}
        </span>
      );
    }
    return (
      <span className={isNew ? "text-green-500" : "text-red-500"}>{data}</span>
    );
  };

  return (
    <div>
      The <span className="font-bold text-gray-500">{data.title}</span> field
      changed from {getData(data.old_data)} to {getData(data.new_data, true)}
    </div>
  );
};

function isValidDate(dateString) {
  return dayjs(dateString, "YYYY-MM-DD", true).isValid();
}

const DescriptionItem = ({ json, tab }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const parsedJSON = JSON.parse(json).map((item) => {
    if (isValidDate(item.old_data) || isValidDate(item.new_data)) {
      return {
        title: item.title,
        old_data: isValidDate(item.old_data)
          ? dayjs(item.old_data).format("DD-MM-YYYY")
          : item.old_data,
        new_data: isValidDate(item.new_data)
          ? dayjs(item.new_data).format("DD-MM-YYYY")
          : item.new_data,
      };
    }

    if (item.title === "Vision Herd Management Extras") {
      const getLabel = (value) => {
        return value && Array.isArray(value)
          ? value.map((item) =>
              item === "performance_monitor_bimodal_milking"
                ? "Performance monitor / Bimodal Milking"
                : item,
            )
          : null;
      };

      return {
        title: item.title,
        old_data: getLabel(item.old_data),
        new_data: getLabel(item.new_data),
      };
    }

    return item;
  });

  const columns = [
    {
      title: "Field",
      dataIndex: "title",
    },
    {
      title: "Old Record",
      dataIndex: "old_data",
      className: "text-red-500",
      render: (value) => {
        if (Array.isArray(value)) {
          return (
            <div>
              {value.map((item) => (
                <Tag key={item} color="red">
                  {item}
                </Tag>
              ))}
            </div>
          );
        }
        return value;
      },
    },
    {
      title: "New Record",
      dataIndex: "new_data",
      className: "text-green-500",
      render: (value) => {
        if (Array.isArray(value)) {
          return (
            <div>
              {value.map((item) => (
                <Tag key={item} color="green">
                  {item}
                </Tag>
              ))}
            </div>
          );
        }
        return value;
      },
    },
  ];

  const firstRecord = parsedJSON[0];

  return (
    <div className="flex items-center gap-2">
      <FirstRow data={firstRecord} />
      <Tooltip title="View Details" className="w-20">
        <CircleEllipsis
          size={22}
          color="#808080"
          className="cursor-pointer"
          onClick={showModal}
        />
      </Tooltip>
      <Modal
        title={`Description of ${tab}`}
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        footer={null}
        width={800}
      >
        <Table
          columns={columns}
          rowKey="title"
          dataSource={parsedJSON}
          scroll={{ x: "calc(100% - 200px)" }}
          size="small"
          rowHoverable={false}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

const LogTable = () => {
  const { logs, logParams, isLogsGetting, logPaginationInfo } = useSelector(
    (state) => state.quote,
  );
  const dispatch = useDispatch();
  const handleError = useError();
  const { id } = useParams();

  const columns = [
    {
      title: "Step Name",
      dataIndex: "tab",
      key: "tab",
      sorter: true,
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "json",
      key: "json",
      sorter: true,
      render: (json, { tab }) => <DescriptionItem json={json} tab={tab} />,
      width: 400,
    },
    {
      title: "Updated By",
      dataIndex: "perform_by",
      key: "perform_by",
      sorter: true,
      width: 200,
    },
    {
      title: "Updated At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 200,
      render: (created_at) =>
        created_at ? dayjs(created_at).format("DD-MM-YYYY hh:mm A") : null,
    },
  ];

  useEffect(() => {
    dispatch(
      getQuoteLogs({
        ...logParams,
        request_id: id,
      }),
    )
      .unwrap()
      .catch(handleError);
  }, [
    logParams.page,
    logParams.limit,
    logParams.sort_column,
    logParams.sort_direction,
  ]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-medium">Change Logs</h2>
        <Link to="/quote">
          <Button>Back to List</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        loading={isLogsGetting}
        dataSource={logs}
        rowKey="id"
        showSorterTooltip={false}
        size="small"
        scroll={{ y: 240, x: "calc(100% - 200px)" }}
        pagination={{
          total: logPaginationInfo.total_records,
          pageSize: logParams.limit,
          current: logParams.page,
          showTotal: (total) => `Total ${total} records`,
        }}
        onChange={(e, b, c, d) => {
          dispatch(
            setLogParams({
              page: e.current,
              limit: e.pageSize,
              sort_column: c.field,
              sort_direction: c.order,
            }),
          );
        }}
        sortDirections={["ascend", "descend"]}
      />
    </div>
  );
};

export default LogTable;
