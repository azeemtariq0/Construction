import { Button, Input, Table, Tooltip } from "antd";
import { Asterisk, Copy, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addVariant,
  copyVariant,
  removeVariant,
  updateVariant,
} from "../../store/features/productSlice";

const VariantsTable = ({ onSubmit, mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    variantAttributes,
    variantList,
    isFormSubmitting,
    initialFormValues,
  } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isValid, setIsValid] = useState(false); // Validation state

  const getFieldValue = (id, record) => {
    const findField = record.attributes.find(
      (item) => item.attribute_id === id,
    );

    return findField?.value;
  };

  const updateFieldValue = (id, name, value) => {
    dispatch(
      updateVariant({
        id,
        name,
        value,
      }),
    );
  };

  // Validation function for variants
  const validateVariants = () => {
    if (variantList.length === 0) return false; // At least one variant

    const partNos = new Set();

    return variantList.every((variant) => {
      const partNo = getFieldValue("part_no", variant);
      const price = getFieldValue("price", variant);

      // Check for empty partNo or price and ensure price is a valid number
      if (!partNo?.trim() || (price && isNaN(price))) {
        return false;
      }

      // Check for duplicate part numbers
      if (partNos.has(partNo)) {
        return false;
      }

      // Add part number to the set
      partNos.add(partNo);

      return true;
    });
  };

  useEffect(() => {
    setIsValid(validateVariants()); // Check validation on component mount and whenever variantList changes
  }, [variantList]);

  const attributeColumns = variantAttributes.map((attribute) => {
    return {
      title: attribute.attribute_name,
      dataIndex: attribute.attribute_id,
      width: 100,
      render: (_, record) => {
        return (
          <Input
            size="small"
            value={getFieldValue(attribute.attribute_id, record)}
            disabled={mode === "view"}
            onChange={(e) =>
              updateFieldValue(
                record.id,
                attribute.attribute_id,
                e.target.value,
              )
            }
          />
        );
      },
    };
  });

  const onVariantAdd = () => dispatch(addVariant());
  const onVariantCopy = (id) => dispatch(copyVariant(id));
  const onVariantRemove = (id) => dispatch(removeVariant(id));

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "Enter" && mode !== "view") {
        event.preventDefault();
        onVariantAdd();
      }

      if (event.ctrlKey && event.key === "d" && mode !== "view") {
        event.preventDefault();
        if (selectedVariantId !== null) {
          onVariantCopy(selectedVariantId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVariantId]);

  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          <Asterisk size={14} className="text-red-500" />
          <span>Part No</span>
        </div>
      ),
      dataIndex: "part_no",
      width: 100,
      render: (_, record) => {
        return (
          <Input
            size="small"
            autoFocus
            disabled={mode === "view"}
            value={getFieldValue("part_no", record)}
            onChange={(e) =>
              updateFieldValue(record.id, "part_no", e.target.value)
            }
          />
        );
      },
    },
    ...attributeColumns,
    {
      title: "Price",
      dataIndex: "price",
      width: 100,
      render: (_, record) => {
        return (
          <Input
            size="small"
            disabled={mode === "view"}
            value={getFieldValue("price", record)}
            onChange={(e) =>
              updateFieldValue(record.id, "price", e.target.value)
            }
          />
        );
      },
    },
    {
      title: (
        <Tooltip title="Add (Ctrl + Enter)">
          <Button
            type="primary"
            size="small"
            disabled={mode === "view"}
            icon={<Plus size={18} />}
            onClick={onVariantAdd}
            className="min-w-16"
          />
        </Tooltip>
      ),
      dataIndex: "action",
      render: (_, { id }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title="Copy (Ctrl + D)">
              <Button
                size="small"
                disabled={mode === "view"}
                icon={<Copy size={12} />}
                onClick={() => onVariantCopy(id)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="small"
                disabled={mode === "view"}
                danger
                icon={<Trash2 size={12} />}
                onClick={() => onVariantRemove(id)}
              />
            </Tooltip>
          </div>
        );
      },
      width: 80,
      fixed: "right",
      align: "center",
    },
  ];

  const onSubmitHandler = (isPublish = false) => {
    const payload = {
      product_variants: variantList.map(({ id, isNew, ...variant }) => ({
        ...variant,
        id: isNew ? null : id,
      })),
      tab_no: 2,
      is_published: isPublish ? 1 : 0,
      user_id: user.user_id,
    };

    onSubmit(payload);
  };

  return (
    <div className="mx-4">
      <Table
        columns={columns}
        dataSource={variantList}
        rowKey="id"
        pagination={false}
        scroll={{ y: 240, x: "calc(100% - 200px)" }}
        size="small"
        onRow={(record) => {
          return {
            onClick: () => setSelectedVariantId(record.id),
            onKeyPress: () => setSelectedVariantId(record.id),
          };
        }}
      />

      <div className="mb-4 mt-8 flex flex-wrap justify-end gap-4">
        <Link to="/product" className="w-28">
          <Button htmlType="button" block>
            Cancel
          </Button>
        </Link>
        <Button
          type="primary"
          className="!bg-gray-1 w-28 !text-white"
          onClick={() => navigate("/product/preview")}
        >
          Preview
        </Button>
        {mode === "view" ? null : (
          <>
            {!initialFormValues?.isPublished && (
              <Button
                type="text"
                className="!bg-gray-1 w-28 !text-white hover:!bg-[#666666] disabled:!bg-gray-400"
                onClick={() => onSubmitHandler()}
                loading={isFormSubmitting === "Drafting"}
                disabled={!isValid}
              >
                Save
              </Button>
            )}
            {initialFormValues?.status === 1 && (
              <Button
                type="primary"
                className="w-28"
                onClick={() => onSubmitHandler(true)}
                loading={isFormSubmitting === "Publishing"}
                disabled={!isValid}
              >
                Publish
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VariantsTable;
