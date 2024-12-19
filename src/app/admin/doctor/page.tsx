import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChewTable from "@/components/Chews";

export const metadata: Metadata = {
  title: "Doctor | Market Documents",
  description: "Market Doctor Registered Doctor",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Market Doctor Doctor" />

      <div className="flex flex-col gap-10">
        <ChewTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
