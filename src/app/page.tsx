import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignInPage from "@/components/SignIn";
export const metadata: Metadata = {
  title: "Market Doctor",
  description: "Market Doctor Sign In User",
};

const SignIn = () => {
  return (
    <div >
      <SignInPage />
    </div>
  );
};

export default SignIn;
