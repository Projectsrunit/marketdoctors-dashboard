import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CasesTable from "@/components/Cases";

export const metadata: Metadata = {
  title: "Cases | Market Doctors",
  description: "Market Doctor Registered Cases",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cases" />

      <div className="flex flex-col gap-10">
        <CasesTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
