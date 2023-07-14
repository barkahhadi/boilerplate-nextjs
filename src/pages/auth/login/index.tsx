import { NextPage } from "next";
import BlankLayout from "@/components/Layout/BlankLayout";
import { ReactElement } from "react";
import { Layout } from "antd";
import Login from "@/components/Login";

const LoginPage: NextPage | any = () => {
  return (
    <>
      <Layout>
        <Login />
      </Layout>
    </>
  );
};

LoginPage.getLayout = (page: ReactElement) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export default LoginPage;
