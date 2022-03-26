import React, { useEffect, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Time = ({
  startDate,
  startTime,
  endDate,
  endTime,
  auction,
  setStatus,
  purchaseStatus,
  setWinnerStatus,
  resPurchaseStatus,
}) => {
  let navigate = useNavigate();
  const start_date = new Date(startDate + " " + startTime);
  const end_date = new Date(endDate + " " + endTime);
  const [now, setNow] = useState(new Date());

  const tzNowDate = now.toLocaleString("en-CA", {
    timeZone: "Europe/Kiev",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const tzNowTime = now.toLocaleString("en-GB", {
    timeZone: "Europe/Kiev",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const tz_now_date = new Date(tzNowDate + " " + tzNowTime);

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  const isTimeUp = isBefore(start_date, tz_now_date);
  const isTimeDown = isBefore(tz_now_date, end_date);

  if (!isTimeUp) {
    let refresh = start_date.getTime() - tz_now_date.getTime();
    setTimeout(function () {
      window.location.reload(true);
    }, refresh);
  }

  if (!isTimeDown || resPurchaseStatus) {
    setTimeout(function () {
      return navigate("/");
    }, 10000);
  }

  useEffect(() => {
    if (isTimeDown && isTimeUp && !purchaseStatus) {
      setStatus(true);
      const interval = setInterval(() => {
        setNow(new Date());
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else if (
      (!isTimeDown && isTimeUp) ||
      (isTimeDown && isTimeUp && purchaseStatus)
    ) {
      setStatus(false);
      setWinnerStatus(true);
      const updateAuction = async () => {
        try {
          const res = await axios.put(
            `http://localhost:5000/auction/find/${auction._id}`
          );
        } catch (error) {
          console.log(error);
        }
      };
      updateAuction();
    }
  }, [
    isTimeUp,
    isTimeDown,
    auction._id,
    purchaseStatus,
    setStatus,
    setWinnerStatus,
  ]);

  if (isTimeUp) {
    const duration = intervalToDuration({
      start: tz_now_date,
      end: end_date,
    });
    days = duration.days;
    hours = duration.hours;
    minutes = duration.minutes;
    seconds = duration.seconds;
  }

  return (
    <>
      {!isTimeUp ? (
        <>
          <span className="auctionTime">Upcoming Auction</span>
        </>
      ) : !isTimeDown || purchaseStatus || resPurchaseStatus ? (
        <>
          <span className="auctionTime">Auction Is Over</span>
        </>
      ) : (
        <span className="auctionTime">
          {days +
            " days: " +
            hours +
            " hours: " +
            minutes +
            " minutes: " +
            seconds +
            " seconds"}
        </span>
      )}
    </>
  );
};

export default Time;
