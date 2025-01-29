import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChewTable from "@/components/Chews";

export const metadata: Metadata = {
  title: "CHEW | Market Doctors",
  description: "Market Doctor Registered CHEWs",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="CHEWs List" />

      <div className="flex flex-col gap-10">
        <ChewTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
