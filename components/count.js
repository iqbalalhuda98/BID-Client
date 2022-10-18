import React, { useEffect, useState } from "react";

function CountDown({ time }) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");

  useEffect(() => {
    const refresherOrb = setInterval(() => {
      const date = new Date(time);
      const now = new Date();
      const onSeconds = Math.floor(
        date.getTime() / 1000 - now.getTime() / 1000
      );

      let hours = Math.floor(onSeconds / 3600); // get hours
      let minutes = Math.floor((onSeconds - hours * 3600) / 60); // get minutes
      let seconds = onSeconds - hours * 3600 - minutes * 60; //  get seconds
      // tambahkan 0 jika value < 10; Contoh: 2 => 02
      if (hours < 10 && hours >= 0) {
        hours = `0${hours}`;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      if (hours) setHour(hours);
      if (minutes) setMinute(minutes);
      if (seconds) setSecond(seconds);
    }, 1000);

    return () => {
      clearInterval(refresherOrb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, second, time]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-auto col-9">
          <p className="text-center">Offers end up to :</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-2 col-3">
          <h1 className="text-center">{hour}</h1>
          <h4 className="text-center">HOURS</h4>
        </div>
        <div className="col-md-2 col-3 mx-3">
          <h1 className="text-center">{minute}</h1>
          <h4 className="text-center">MINUTES</h4>
        </div>
        <div className="col-md-2 col-3">
          <h1 className="text-center">{second}</h1>
          <h4 className="text-center">SECONDS</h4>
        </div>
      </div>
    </div>
  );
}

export default CountDown;
