/**
 * Author: Barkah Hadi
 * Description: The main app component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import type { AppProps } from "next/app";
import MainLayout from "@components/Layout/MainLayout";
import wrapper, { useAppDispatch } from "@/store";
import type { Page } from "@/types/page";
import "@/styles/globals.css";
import { withCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import AuthCookie from "@utils/cookies/auth";
import { me } from "@store/thunk/auth";
import { useRouter } from "next/router";
import { PUBLIC_URL } from "@/constants";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/store";
import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import { ApplicationState, NotificationType } from "@/store/slice/app";

const Loading = dynamic(() => import("@components/Layout/Loading"), {
  ssr: false,
});

type Props = AppProps & {
  Component: Page;
};

let isInitialRender: boolean = true;

const App = ({ Component, pageProps }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { notification: notifState }: ApplicationState = useAppSelector(
    (state) => state.app
  );

  const [notif, notificationContext] = notification.useNotification();

  useAsync(async () => {
    if (AuthCookie.isAuthenticated) {
      try {
        if (isInitialRender) dispatch(me());

        isInitialRender = false;
      } catch (err: unknown) {
        if (err instanceof Error) throw new Error(err.message);
      }
    }
  }, [AuthCookie.isAuthenticated]);

  useAsync(async () => {
    if (!AuthCookie.isAuthenticated && !PUBLIC_URL.includes(router.pathname)) {
      router.push("/auth/login");
      setLoading(false);
    } else if (isAuthenticated && PUBLIC_URL.includes(router.pathname)) {
      router.push("/");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (isAuthenticated && PUBLIC_URL.includes(router.pathname)) {
      router.push("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (notifState.open) {
      notif[notifState.type]({
        message: notifState.message,
        description:
          notifState.description !== undefined ? notifState.description : "",
        placement: notifState.placement,
      });
    }
  }, [notifState]);

  // If your page has a layout defined, use it. Otherwise, use the default layout.
  let getLayout =
    Component.getLayout || ((page: any) => <MainLayout>{page}</MainLayout>);

  return getLayout(
    <div>
      <Component {...pageProps} />
      <Loading loading={isLoading} />
      {notificationContext}
    </div>
  );
};

// Attaches the Redux store to the app.
export default withCookies(wrapper.withRedux(App));
