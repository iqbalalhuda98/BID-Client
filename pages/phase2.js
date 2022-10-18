/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import ProgressBar from "react-bootstrap/ProgressBar";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import UserProgressBar from "../components/progress-bar";
import axios from "axios";
import cookiesHandler from "../helpers/cookies";
import { auth, logout, unauthorized } from "../utils/auth";

const apiUrl = "http://localhost:8888/api";

export async function getServerSideProps(ctx) {
  const { token } = await auth(ctx);

  if (!token) {
    unauthorized(ctx);
    return { props: {} };
  } else {
    return {
      props: {
        token,
      },
    };
  }
}

export default function Phase2({ token }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [eventCapacity, setEventCapacity] = useState(0);
  const [currentUser, setCurrentUser] = useState(0);
  const [user, setUser] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [level, setLevel] = useState(null);
  const [userProgress, setUserProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const referralCodeRef = useRef(null);

  // Fungsi untuk mendapatkan data level
  const getLevel = async () => {
    try {
      const response = await axios.get(`${apiUrl}/level`);

      if (response?.data?.data) {
        setLevel(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fungsi untuk mendapatkan data event yang aktif
  const getActiveEvent = async () => {
    try {
      const getEvent = await axios.get(`${apiUrl}/ticket/by-user/${user?.id}`);
      const response = await axios.get(
        `${apiUrl}/event/${getEvent?.data.data.event}`
      );
      const nextResponse = await axios.get(
        `${apiUrl}/ticket/by-event/${getEvent?.data.data.event}`
      );

      setActiveEvent(response.data.data[0]);
      setEventCapacity(response.data.data[0].capacity ?? 0);
      setCurrentProgress(
        (nextResponse?.data?.data.count / response.data.data[0].capacity) * 100
      );
      setCurrentUser(nextResponse.data.data.count);

      // getTickets(getEvent?.data.data.event, response?.data.data[0].capacity);
    } catch (error) {
      console.log(
        error?.response?.data.message ??
          error?.message ??
          "Failed to get active event"
      );
    }
  };

  // Fungsi untuk menyalin referral code
  const copyReferralCode = () => {
    const text = referralCodeRef.current;

    if ("navigator" in window) {
      navigator.clipboard.writeText(text.value);
      setIsCopied(true);
    } else {
      text.select();
      document.execCommand("copy");
      setIsCopied(true);
    }

    setTimeout(() => setIsCopied(false), 2000);
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/participant/getData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);
      cookiesHandler.setCookie("user", JSON.stringify(response.data.data));
    } catch (error) {
      logout();
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const userData = cookiesHandler.getCookie("user");

    if (!userData) {
      getUser();
    } else {
      setUser(JSON.parse(userData));
      getUser();
    }

    getLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.id) {
      getActiveEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (level) {
      const getProgressRanges = (lvl) => lvl * 20;

      const userLevel = level?.find((item) => {
        const currentProgress = user?.used_by ?? 0;
        const range = item.range.split("-");
        const range1 = parseInt(range[0]);
        const range2 = parseInt(range[1]);

        if (range1 <= currentProgress && currentProgress <= range2) {
          return item;
        }

        return null;
      });

      if (userLevel) {
        const currentProgress = user?.used_by ?? 0;
        const progressRanges = getProgressRanges(userLevel.level);
        const progress =
          (currentProgress / parseInt(userLevel.range.split("-")[1])) *
          progressRanges;

        setCurrentLevel(userLevel);
        setUserProgress(progress);
      }
    }
  }, [user, level]);

  const progressMilestone = [
    {
      level: 0,
      title: "Account Registration",
      range: level?.find((item) => item.level === 0)?.range ?? "0-0",
    },
    {
      level: 1,
      title: "Get 10% off",
      range: level?.find((item) => item.level === 1)?.range ?? "0-0",
    },
    {
      level: 2,
      title: "Get 15% off",
      range: level?.find((item) => item.level === 2)?.range ?? "0-0",
    },
    {
      level: 3,
      title: "Get 20% off",
      range: level?.find((item) => item.level === 3)?.range ?? "0-0",
    },
    {
      level: 4,
      title: "Get 25% off",
      range: level?.find((item) => item.level === 4)?.range ?? "0-0",
    },
    {
      level: 5,
      title: "Get 30% off",
      range: level?.find((item) => item.level === 5)?.range ?? "0-0",
    },
    {
      level: 6,
      title: "Get 35% off",
      range: level?.find((item) => item.level === 6)?.range ?? "0-0",
    },
    {
      level: 7,
      title: "Get 40% off",
      range: level?.find((item) => item.level === 7)?.range ?? "0-0",
    },
    {
      level: 8,
      title: "Get 45% off",
      range: level?.find((item) => item.level === 8)?.range ?? "0-0",
    },
    {
      level: 9,
      title: "Get 50% off",
      range: level?.find((item) => item.level === 9)?.range ?? "0-0",
    },
  ];

  return (
    <>
      <Head>
        <title>Bisnis Indonesia ID</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="background">
        <header>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-md-4 col-6">
                {activeEvent && activeEvent.logo ? (
                  <Image
                    className="mx-auto d-block"
                    src={`http://localhost:8888/api/image/download/${activeEvent.logo}`}
                    alt="Logo Bisnis Indonesia"
                    width={237.92}
                    height={50}
                  />
                ) : (
                  <Image
                    className="mx-auto d-block"
                    src="/img/logo.png"
                    alt="Logo Bisnis Indonesia"
                    width={237.92}
                    height={50}
                  />
                )}
              </div>
              <div className="col-md-4 col-6">
                <div className="d-flex justify-content-end position-relative">
                  {/* <div className="position-relative"> */}
                  <div
                    className="col-md-auto me-4 text-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Image
                      src="/img/user.png"
                      className="mx-auto d-block"
                      alt=""
                      width={32}
                      height={32}
                    />
                    <div className="text-primary d-flex align-items-center">
                      <p className="text-center mt-3">{user?.name ?? ""}</p>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                        style={{
                          width: "18px",
                          height: "18px",
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {isDropdownOpen && (
                    <div
                      className="position-absolute border rounded-2 bg-white p-3"
                      style={{
                        width: "130px",
                        bottom: "-4rem",
                        right: ".75rem",
                        zIndex: "50",
                      }}
                    >
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </header>

        <section className="event">
          <div className="container">
            <div className="row justify-content-center position-relative">
              <div className="col-md-auto col-sm-auto col-auto px-0">
                {activeEvent && activeEvent?.image1 ? (
                  <Image
                    className="rounded-first"
                    src={`${apiUrl}/image/download/${activeEvent?.image1}`}
                    alt=""
                    width={275}
                    height={260}
                  />
                ) : (
                  <Image
                    className="rounded-first"
                    src="/img/1.png"
                    alt=""
                    width={275}
                    height={260}
                  />
                )}
              </div>
              <div className="col-md-auto col-sm-auto col-auto px-0">
                {activeEvent && activeEvent?.image2 ? (
                  <Image
                    className="rounded-second"
                    src={`${apiUrl}/image/download/${activeEvent?.image2}`}
                    alt=""
                    width={275}
                    height={260}
                  />
                ) : (
                  <Image src="/img/2.png" alt="" width={275} height={260} />
                )}
              </div>
              <div className="col-md-auto col-sm-auto col-auto px-0">
                {activeEvent && activeEvent?.image3 ? (
                  <Image
                    className="rounded-third"
                    src={`${apiUrl}/image/download/${activeEvent?.image3}`}
                    alt=""
                    width={275}
                    height={260}
                  />
                ) : (
                  <Image
                    className="rounded-third"
                    src="/img/3.png"
                    alt=""
                    width={275}
                    height={260}
                  />
                )}
              </div>
              <div className="col-md-auto col-sm-auto col-auto px-0">
                {activeEvent && activeEvent?.image4 ? (
                  <Image
                    className="rounded-last"
                    src={`${apiUrl}/image/download/${activeEvent?.image4}`}
                    alt=""
                    width={275}
                    height={260}
                  />
                ) : (
                  <Image
                    className="rounded-last"
                    src="/img/4.png"
                    alt=""
                    width={275}
                    height={260}
                  />
                )}
              </div>
              <div className="d-flex justify-content-center">
                <p className="prog-info position-absolute top-50 start-50 translate-middle">
                  {currentUser} of {eventCapacity} users have participated in
                  this event
                </p>
                <div className="prog-bar col-md-11 col-8 position-absolute top-50 start-50 translate-middle">
                  <ProgressBar
                    now={currentProgress}
                    variant={"YOU_PICK_A_NAME"}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="invite">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-auto">
                <h4 className="text-center">Invite &amp; Earn</h4>
                <p className="text-center mt-4">
                  Invite your friends and you’ll get access to read 5 premium
                  articles
                </p>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center mt-3">
              <div className="">
                <div className="input-group">
                  <input
                    ref={referralCodeRef}
                    type="text"
                    className="form-control form-refer"
                    value={`https://blablabla.com/${user?.referral_code}`}
                    readOnly
                  />
                  <button
                    className="btn btn-form-refer"
                    type="button"
                    onClick={copyReferralCode}
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      "Copied!"
                    ) : (
                      <>
                        <img src="/img/copy.png" alt="" />
                        <span className="ms-2">COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="ms-4">
                <p className="text-center or">OR</p>
              </div>
              <div className="ms-4">
                <button className="btn btn-refer">
                  <img src="/img/refer.png" alt="" />
                  <span className="ms-2">Refer friends now</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="my-progress mt-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-auto">
                <h4 className="text-center">My Progress</h4>
                <p className="text-center mt-4">
                  Complete your progress bar to get attractive offers such as
                  vouchers and promos during the event.
                </p>
              </div>
            </div>

            <UserProgressBar
              progress={userProgress}
              currentLevel={currentLevel}
              dataSlider={progressMilestone}
            />
          </div>
        </section>

        <section className="article mt-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-auto col-9">
                <p className="text-center title">Articles you can read</p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4 col-10">
                <div className="row">
                  <div className="col-md-auto col-auto mb-3">
                    <img
                      src="/img/article1.png"
                      alt=""
                      width="77px"
                      height="64px"
                    />
                  </div>
                  <div className="col-md-8 col-8 px-0">
                    <h5>Economics</h5>
                    <p>
                      Which economics have done best and worst during the
                      pandemic?
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-10">
                <div className="row">
                  <div className="col-md-auto col-auto mb-3">
                    <img
                      src="/img/article2.png"
                      alt=""
                      width="77px"
                      height="64px"
                    />
                  </div>
                  <div className="col-md-8 col-8 px-0">
                    <div className="d-flex flex-row">
                      <h5>Finance</h5>
                      <h4 className="bg-dark text-white ms-2">PREMIUM</h4>
                    </div>
                    <p>
                      Which economics have done best and worst during the
                      pandemic?
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-10">
                <div className="row">
                  <div className="col-md-auto col-auto mb-3">
                    <img
                      src="/img/article3.png"
                      alt=""
                      width="77px"
                      height="64px"
                    />
                  </div>
                  <div className="col-md-8 col-8 px-0">
                    <div className="d-flex flex-row">
                      <h5>Industry</h5>
                      <h4 className="bg-dark text-white ms-2">PREMIUM</h4>
                    </div>
                    <p>
                      Which economics have done best and worst during the
                      pandemic?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="package">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-5 col-10 mb-3">
                <div className="bronze">
                  <div className="row">
                    <div className="col-md-3 col-auto position-relative py-1">
                      <img
                        src="./img/B Bronze.png"
                        className="ms-3"
                        alt=""
                        width="55px"
                        height="69px"
                      />
                      <h2 className="text-white position-absolute top-50 start-50 translate-middle ms-2">
                        Bronze
                      </h2>
                    </div>
                    <div className="col-md-4 col-auto ps-0">
                      <ul>
                        <li className="mt-3">Lorem ipsum dolor sit</li>
                        <li className="mt-2">Lorem ipsum dolor sit</li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-auto pe-0">
                      <ul>
                        <li className="mt-3">Lorem ipsum dolor sit</li>
                        <li className="mt-2">Lorem ipsum dolor sit</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-10 mb-3">
                <div className="silver">
                  <div className="row">
                    <div className="col-md-3 col-auto position-relative py-1">
                      <img
                        src="./img/B Silver.png"
                        className="ms-3"
                        alt=""
                        width="55px"
                        height="69px"
                      />
                      <h2 className="text-white position-absolute top-50 start-50 translate-middle ms-1">
                        Silver
                      </h2>
                      {/* <br/><span className="text-white">Durasi 3 Bulan</span> */}
                    </div>
                    <div className="col-md-4 col-auto ps-0">
                      <ul>
                        <li className="mt-3">Lorem ipsum dolor sit</li>
                        <li className="mt-2">Lorem ipsum dolor sit</li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-auto pe-0">
                      <ul>
                        <li className="mt-3">Lorem ipsum dolor sit</li>
                        <li className="mt-2">Lorem ipsum dolor sit</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-10 mb-3">
                <div className="gold">
                  <div className="row">
                    <div className="col-md-3 col-auto position-relative py-1">
                      <img
                        src="./img/B Gold.png"
                        className="ms-3"
                        alt=""
                        width="55px"
                        height="69px"
                      />
                      <h2 className="text-white position-absolute top-50 start-50 translate-middle ms-0">
                        Gold
                      </h2>
                    </div>
                    <div className="col-md-4 col-auto ps-0">
                      <ul>
                        <li className="mt-3">Lorem ipsum dolor sit</li>
                        <li className="mt-2">Lorem ipsum dolor sit</li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-auto pe-0">
                      <ul>
                        <li className="mt-3">Lorem ipsum dolor sit</li>
                        <li className="mt-2">Lorem ipsum dolor sit</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-10 mb-3">
                <div className="platinum">
                  <div className="row">
                    <div className="col-md-3 col-auto position-relative py-1">
                      <img
                        src="./img/B Platinum.png"
                        className="ms-3"
                        alt=""
                        width="55px"
                        height="69px"
                      />
                      <h2 className="text-black position-absolute top-50 start-50 translate-middle ms-3">
                        Platinum
                      </h2>
                      {/* <br/><span>Durasi 12 Bulan</span> */}
                    </div>
                    <div className="col-md-4 col-auto ps-0">
                      <ul>
                        <li className="mt-3 text-black">
                          Lorem ipsum dolor sit
                        </li>
                        <li className="mt-2 text-black">
                          Lorem ipsum dolor sit
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-4 col-auto pe-0">
                      <ul>
                        <li className="mt-3 text-black">
                          Lorem ipsum dolor sit
                        </li>
                        <li className="mt-2 text-black">
                          Lorem ipsum dolor sit
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="d-flex flex-row justify-content-center">
              <div className="me-5 info">For more info</div>
              <div className="ms-0 d-flex align-items-center">
                <img
                  src="/img/vector.png"
                  alt=""
                  width="24px"
                  height="23.85px"
                />
              </div>
              <div className="ms-4 d-flex align-items-center">
                <img
                  src="/img/vector (1).png"
                  alt=""
                  width="24px"
                  height="19.51px"
                />
              </div>
              <div className="ms-4 d-flex align-items-center">
                <img
                  src="/img/vector (2).png"
                  alt=""
                  width="24px"
                  height="24px"
                />
              </div>
              <div className="ms-4 d-flex align-items-center">
                <img
                  src="/img/vector (3).png"
                  alt=""
                  width="24px"
                  height="24px"
                />
              </div>
              <div className="ms-4 d-flex align-items-center">
                <img
                  src="/img/vector (4).png"
                  alt=""
                  width="23.99px"
                  height="16.77px"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
