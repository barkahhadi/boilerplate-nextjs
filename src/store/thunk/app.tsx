/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Fri Jul 28 2023 7:51:22 PM
 * File: app.tsx
 * Description: App Thunk
 */

import { NotificationPlacement } from "antd/es/notification/interface";
import { AppDispatch } from "..";
import { NotificationType, appActions } from "../slice/app";

interface NotificationParams {
  type?: NotificationType;
  message: string;
  description?: string;
  placement?: NotificationPlacement;
}

export const openNotification = ({
  type = "warning",
  message = "",
  description = "",
  placement = "bottomRight",
}: NotificationParams) => {
  return (dispatch: AppDispatch) => {
    dispatch(
      appActions.openNotification({
        type,
        message,
        description,
        placement,
        open: true,
      })
    );

    setTimeout(() => {
      dispatch(appActions.closeNotification(null));
    }, 3000);
  };
};
