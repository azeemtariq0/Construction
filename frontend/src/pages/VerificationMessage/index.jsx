import { Button } from "antd";
import { Link, useParams } from "react-router-dom";
import EmailLogo from "../../assets/images/email-logo.png";

const VerificationMessage = () => {
  const { email } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#808080]">
      <div className="relative mx-4 w-full overflow-hidden rounded-lg bg-[#C0C0C0] shadow-lg sm:w-[450px] md:w-[450px]">
        <div className="flex h-20 justify-center rounded-lg bg-white">
          <div className="absolute top-9 h-24 w-24">
            <img
              src={EmailLogo}
              alt="Email Logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-14 px-8 py-4">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold">Check your inbox, please!</h1>
          </div>

          <p className="mb-4 text-center text-[14px]">
            To reset password. We need to verify your email.we’ve already sent
            out the verification link. Please check it!
          </p>

          <div className="flex justify-center">
            <Link to="https://mail.google.com/" target="_blank">
              <Button type="primary" className="!h-9 !w-[125px]" size="large">
                CHECK
              </Button>
            </Link>
          </div>

          <p className="py-4 text-sm">
            Didn’t get email?{" "}
            <Link
              to={`/email-verification?email=${email}`}
              className="text-red-1 cursor-pointer font-semibold hover:underline"
            >
              Send it again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationMessage;
