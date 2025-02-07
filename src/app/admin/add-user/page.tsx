import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddUserForm from "@/components/AddUsers";

export const metadata: Metadata = {
  title: "Add User | Market Doctor",
  description: "Add User",
};

const AddUserPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Doctor / CHEW" />

      <div className="flex flex-col gap-10">
        <AddUserForm />
      </div>
    </DefaultLayout>
  );
};

export default AddUserPage;
