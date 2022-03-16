import React, { useEffect, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import axios from "axios";

const Time = ({
  startDate,
  startTime,
  endDate,
  endTime,
  auction,
  setStatus,
  purchaseStatus,
  setWinnerStatus,
}) => {
  const start_date = new Date(startDate + " " + startTime);
  const end_date = new Date(endDate + " " + endTime);
  const [now, setNow] = useState(new Date());

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  const isTimeUp = isBefore(start_date, now);
  const isTimeDown = isBefore(now, end_date);

  if (!isTimeUp) {
    let refresh = start_date.getTime() - now.getTime();
    console.log(start_date.getTime(), now.getTime());
    setTimeout(function () {
      window.location.reload(true);
    }, refresh);
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
      start: now,
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
      ) : !isTimeDown || purchaseStatus ? (
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
