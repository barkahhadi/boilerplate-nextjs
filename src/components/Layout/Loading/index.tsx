/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Thu Jul 13 2023 3:10:56 AM
 * File: index.tsx
 * Description: Loading Component
 */

import React from "react";
import ReactDOM from "react-dom";
import { Spin } from "antd";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = (props) => {
  const { loading = false } = props;

  if (!loading || typeof window === "undefined") {
    return null;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Spin size="large" />
        </div>,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default Loading;
