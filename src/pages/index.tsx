import { ProCard } from "@ant-design/pro-components";
import React, { useState } from "react";

const App: React.FC = () => {
  return (
    <>
      <ProCard
        style={{
          height: "200vh",
          minHeight: 800,
        }}
      >
        Hello World
      </ProCard>
    </>
  );
};

export default App;
