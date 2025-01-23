import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Advertisement from "@/components/Advertisements";

export const metadata: Metadata = {
  title: "Doctor | Market Advertisement",
  description: "Market Doctor Advertisement",
};

const AdvertisementsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Market Doctor Articles" />

      <div className="flex flex-col gap-10">
        <Advertisement />
      </div>
    </DefaultLayout>
  );
};

export default AdvertisementsPage;
