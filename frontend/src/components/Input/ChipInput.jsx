import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ChipInput = ({
  value = [],
  onChange,
  placeholder = "New Tag",
  inputStyle,
  className,
  disabled = false,
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Handle removing a chip
  const handleClose = (removedTag) => {
    if (disabled) return;
    const newTags = value.filter((tag) => tag !== removedTag);
    onChange(newTags); // Update parent component state via onChange
  };

  // Handle adding a new chip
  const handleInputConfirm = () => {
    if (inputValue.includes("_")) {
      return toast.error("Tags cannot contain underscores");
    }

    if (inputValue && !value.includes(inputValue)) {
      onChange([...value, inputValue]); // Add new tag to parent component's state
    }

    setInputVisible(false);
    setInputValue("");
  };

  const showInput = () => {
    !disabled && setInputVisible(true);
  };

  return (
    <div className={className}>
      {value.map((tag, index) => (
        <Tag key={index} closable={!disabled} onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}
      {inputVisible ? (
        <Input
          size="small"
          autoFocus
          style={inputStyle || { width: 100 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : disabled ? null : (
        <Tag onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> {placeholder}
        </Tag>
      )}
    </div>
  );
};

export default ChipInput;
