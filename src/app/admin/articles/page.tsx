import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Articles from "@/components/Articles";

export const metadata: Metadata = {
  title: "Doctor | Market Articles",
  description: "Market Doctor Articles",
};

const ArticlesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Market Doctor Articles" />

      <div className="flex flex-col gap-10">
        <Articles />
      </div>
    </DefaultLayout>
  );
};

export default ArticlesPage;
