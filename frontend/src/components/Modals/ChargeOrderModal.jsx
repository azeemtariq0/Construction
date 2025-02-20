import { Button, Form, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiRefresh } from 'react-icons/hi';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useError from '../../hooks/useError';
import { createChargeOrder } from '../../store/features/chargeOrderSlice';

const ChargeOrderModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();

  const { user } = useSelector((state) => state.auth);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);



  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      width: 60,
      render: (_, __, index) => `${index + 1}.`
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 200,
      render: (_, { product_id }) => product_id.label
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 240,
      ellipsis: true
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      fixed: 'right',
      render: (_, { quantity }, index) => {
        return (
          <Form.Item
            className="m-0"
            initialValue={quantity}
            name={`markup-${uuidv4()}`}
            rules={[
              {
                required: true,
                message: 'Quantity required'
              }
            ]}>
         
          </Form.Item>
        );
      }
    }
  ];

  const onChargeCreate = async () => {
    const selectedDetails = quotationDetails.filter((detail) =>
      selectedRowKeys.includes(detail.id)
    );

    const data = {
      ref_document_identity: initialFormValues.document_identity,
      ref_document_type_id: initialFormValues.document_type_id,
      document_date: initialFormValues.document_date,
      salesman_id: initialFormValues.salesman_id ? initialFormValues.salesman_id.value : null,
      event_id: initialFormValues.event_id ? initialFormValues.event_id.value : null,
      vessel_id: initialFormValues.vessel_id ? initialFormValues.vessel_id.value : null,
      customer_id: initialFormValues.customer_id ? initialFormValues.customer_id.value : null,
      class1_id: initialFormValues.class1_id ? initialFormValues.class1_id.value : null,
      class2_id: initialFormValues.class2_id ? initialFormValues.class2_id.value : null,
      flag_id: initialFormValues.flag_id ? initialFormValues.flag_id.value : null,
      agent_id: initialFormValues.agent_id ? initialFormValues.agent_id.value : null,
      charge_order_detail: selectedDetails.map((detail, index) => ({
        product_code: detail.product_code,
        product_id: detail.product_id ? detail.product_id.value : null,
        product_name: detail.product_id ? detail.product_id.label : null,
        description: detail.description,
        quantity: detail.quantity,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        supplier_id: detail.supplier_id ? detail.supplier_id.value : null,
        sort_order: index
      }))
    };

    try {
      const res = await dispatch(createChargeOrder(data)).unwrap();
      const chargeOrderID = res.data.data.charge_order_id;
      closeModal();

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}>
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <IoCheckmarkDoneCircleSharp size={40} className="text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Charge order has been created.
                  </p>
                  {permissions.edit ? (
                    <p
                      className="mt-1 cursor-pointer text-sm text-blue-500 hover:underline"
                      onClick={() => {
                        toast.dismiss(t.id);
                        navigate(`/charge-order/edit/${chargeOrderID}`);
                      }}>
                      View Details
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 8000
        }
      );
    } catch (error) {
      handleError(error);
    }
  };



};

export default ChargeOrderModal;
