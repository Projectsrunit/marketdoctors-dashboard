import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChewTable from "@/components/Chews";
import DoctorTable from "@/components/Doctors";

export const metadata: Metadata = {
  title: "Doctor | Market Documents",
  description: "Market Doctor Registered Doctor",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Market Doctor" />

      <div className="flex flex-col gap-10">
        <DoctorTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
