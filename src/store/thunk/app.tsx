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
