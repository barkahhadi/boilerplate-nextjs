import { useState, useEffect } from "react";
import moment from "moment";

const DateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{moment(dateTime).format("MMM, Do YYYY, h:mm:ss a")}</span>;
};

export default DateTime;
