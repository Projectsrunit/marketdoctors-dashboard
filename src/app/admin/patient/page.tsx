import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import PatientsTable from "@/components/Patients";

export const metadata: Metadata = {
  title: "Patient | Market Doctor",
  description: "Market Doctor Registered Patient",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Market Doctor" />

      <div className="flex flex-col gap-10">
        <PatientsTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
