import { Button, Col, Form, Image, Input, Row, Select } from "antd";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import userImagePlaceholder from "../../assets/images/user-placeholder.jpg";
import AsyncSelect from "../AsyncSelect";
import CountrySelect from "../AsyncSelect/CountrySelect";

function generateRandomPassword() {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*";

  // Ensure that the password meets all the requirements
  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)]; // Add at least one number
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Fill the rest of the password length with random characters from all categories
  const allCharacters = lowercase + uppercase + numbers + specialCharacters;
  for (let i = 4; i < 8; i++) {
    // Start from index 4 since 4 characters are already added
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the characters in the password
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}

const UserForm = ({ mode = "create", onSubmit }) => {
  const [form] = Form.useForm();
  const userType = Form.useWatch("user_type", form);
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.user,
  );
  const [imageSrc, setImageSrc] = useState(
    initialFormValues?.user_image || null,
  );
  const fileInputRef = useRef(null);
  const [countryCode, setCountryCode] = useState(
    mode === "edit" ? initialFormValues.dial_code : null,
  );

  const onFinish = (formValues) => {
    const data = {
      ...formValues,
      permission_id: formValues.permission_id.value,
      country_id: formValues.country_id
        ? formValues.country_id.value.split(",")[0]
        : null,
      phone_no: formValues.phone_no
        ? `${countryCode || ""}${formValues.phone_no}`
        : null,
      username: formValues.name,
      image: initialFormValues?.user_image === imageSrc ? null : imageSrc,
    };

    if (
      mode === "edit" &&
      initialFormValues?.user_image &&
      initialFormValues?.user_image !== imageSrc
    ) {
      data.delete_image = initialFormValues?.user_image;
    }

    console.log(data);
    onSubmit(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const setRandomPassword = () => {
    form.setFieldsValue({ password: generateRandomPassword() });
  };

  return (
    <Form
      name="user"
      onFinish={onFinish}
      form={form}
      autoComplete="off"
      layout="vertical"
      initialValues={
        mode === "edit"
          ? initialFormValues
          : {
              user_type: "Partner",
            }
      }
    >
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items-start">
        <Row gutter={16}>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="User Type"
              name="user_type"
              rules={[
                {
                  required: true,
                  message: "User Type is required!",
                },
              ]}
            >
              <Select
                optionFilterProp="label"
                showSearch
                options={[
                  { value: "Partner", label: "Partner" },
                  { value: "Internal", label: "Internal" },
                ]}
              />
            </Form.Item>
          </Col>

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Partner ID"
                name="dealer_id"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Partner ID is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Partner Name"
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Partner Name is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Organization"
                name="organization"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Organization is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          {userType === "Internal" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Full Name is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="Phone Number"
              name="phone_no"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Phone Number is required!",
                },
              ]}
            >
              <Input addonBefore={countryCode} />
            </Form.Item>
          </Col>

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Postal Code"
                name="postal_code"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Postal Code is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Country"
                name="country_id"
                rules={[{ required: true, message: "Country is required!" }]}
              >
                <CountrySelect
                  onChange={({ value }) => {
                    const code = value ? value.split(",")[1] : null;
                    setCountryCode(code);
                  }}
                  labelInValue
                />
              </Form.Item>
            </Col>
          )}

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Address is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}

          {userType === "Partner" && (
            <Col span={24} md={12} lg={8}>
              <Form.Item label="Website or Social URLS" name="site_url">
                <Input />
              </Form.Item>
            </Col>
          )}

          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="User Permission"
              name="permission_id"
              rules={[
                {
                  required: true,
                  message: "User Permission is required!",
                },
              ]}
            >
              <AsyncSelect
                endpoint="/permission"
                valueKey="user_permission_id"
                labelKey="name"
                labelInValue
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Status is required!",
                },
              ]}
            >
              <Select
                optionFilterProp="label"
                showSearch
                options={[
                  { value: 1, label: "Active" },
                  { value: 0, label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: mode === "create",
                  whitespace: true,
                  message: "Password is required!",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters!",
                },
                {
                  pattern: /(?=.*[a-z])/,
                  message: "Password must contain lowercase letter!",
                },
                {
                  pattern: /(?=.*[A-Z])/,
                  message: "Password must contain uppercase letter!",
                },
                {
                  pattern: /(?=.*[!@#$%^&*])/,
                  message: "Password must contain special character!",
                },
                {
                  pattern: /(?=.*[0-9])/,
                  message: "Password must contain a number!",
                },
              ]}
              validateFirst
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Button
              type="primary"
              className="md:mt-[30px]"
              onClick={setRandomPassword}
            >
              Generate
            </Button>
          </Col>
        </Row>

        <div className="mb-4 mt-6 flex w-[200px] flex-col gap-4">
          <Image
            alt="User Image"
            width={200}
            height={200}
            src={imageSrc || userImagePlaceholder}
            loading="lazy"
            className="h-full w-full rounded-md object-cover"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />

          <div className="mt-2 flex gap-2">
            <Button block onClick={() => setImageSrc(null)}>
              Clear
            </Button>
            <Button
              block
              type="primary"
              onClick={() => fileInputRef.current.click()}
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Link to="/user-management" className="w-20">
          <Button htmlType="button" block>
            Cancel
          </Button>
        </Link>
        <Button
          type="primary"
          htmlType="submit"
          className="w-20"
          loading={isFormSubmitting}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};
export default UserForm;
