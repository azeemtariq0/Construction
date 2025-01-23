import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-white p-4 antialiased shadow">
      <p className="mb-4 text-center text-sm text-gray-500 sm:mb-0">
        Developed By{" "}
        <Link
          to="https://h53.ie/"
          className="font-semibold hover:text-gray-500 hover:underline"
          target="_blank"
        >
          H53 Solutions Ltd
        </Link>{" "}
        &copy; 2006-{new Date().getFullYear()}
      </p>
    </footer>
  );
};
export default Footer;
