import { Select } from "antd";

const StatusSelect = (props) => {
  return (
    <Select
      options={[
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ]}
      optionRender={({ value, label }) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${value === 1 ? "bg-green-400" : "bg-red-400"}`}
          />
          <span>{label}</span>
        </div>
      )}
      labelRender={({ value, label }) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${value === 1 ? "bg-green-400" : "bg-red-400"}`}
          />
          <span>{label}</span>
        </div>
      )}
      {...props}
    />
  );
};

export default StatusSelect;
