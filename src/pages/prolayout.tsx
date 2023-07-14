import { NextPage } from "next";
import BlankLayout from "@/components/Layout/BlankLayout";
import { ReactElement } from "react";
import { Layout } from "antd";
import ProLayout from "@/components/Layout/ProLayout";

const NewProLayout: NextPage | any = () => {
  return (
    <>
      <ProLayout />
    </>
  );
};

NewProLayout.getLayout = (page: ReactElement) => {
  return <>{page}</>;
};

export default NewProLayout;
