import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ChewTable from "@/components/Chews";

export const metadata: Metadata = {
  title: "CHEW | Market Documents",
  description: "Market Doctor Registered CHEWs",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Market Doctor CHEWs" />

      <div className="flex flex-col gap-10">
        <ChewTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
