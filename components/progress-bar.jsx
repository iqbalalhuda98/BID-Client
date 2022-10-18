import { useRef, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";

export default function UserProgressBar({
  progress,
  currentLevel,
  dataSlider,
}) {
  const [scrollLeft, setScrollLeft] = useState(0);

  const progressRef = useRef(null);
  const widthPerItem = progressRef?.current?.scrollWidth / dataSlider.length;
  const scrollPosition = widthPerItem * (dataSlider.length - 5 ?? 1) - 50;

  const next = () => {
    if (scrollLeft < widthPerItem * (dataSlider.length - 5)) {
      setScrollLeft((prevState) => prevState + widthPerItem);
    }
  };

  const prev = () => {
    if (scrollLeft > 50) {
      setScrollLeft((prevState) => prevState - widthPerItem);
    }
  };

  useEffect(() => {
    progressRef.current?.scrollTo({
      left: scrollLeft,
    });
  }, [scrollLeft]);

  return (
    <div
      className="d-flex mx-auto align-items-center justify-content-center position-relative"
      style={{
        height: "175px",
        width: "100%",
      }}
    >
      <div
        onClick={() => next()}
        className={`position-absolute d-flex align-items-center justify-content-center ${
          scrollPosition <= scrollLeft ? "cursor-disabled" : ""
        }`}
        style={{
          right: "-5%",
          zIndex: "5",
          opacity: scrollPosition <= scrollLeft ? 0.5 : 1,
        }}
      >
        <Image src="/img/next.png" alt="" width={32} height={32} />
      </div>

      <div
        onClick={() => prev()}
        className={`position-absolute d-flex align-items-center justify-content-center ${
          scrollLeft <= 50 ? "cursor-disabled" : ""
        }`}
        style={{
          left: "-5%",
          zIndex: "5",
          transform: "rotate(180deg)",
          opacity: scrollLeft <= 50 ? 0.5 : 1,
        }}
      >
        <Image src="/img/next.png" alt="" width={32} height={32} />
      </div>

      <div
        className="position-relative row align-items-center justify-content-center"
        style={{
          height: "175px",
          overflow: "hidden",
          width: "100%",
          scrollBehavior: "smooth",
        }}
        ref={progressRef}
      >
        <div
          className="position-absolute"
          style={{
            left: "10%",
          }}
        >
          <div className="custom-progress-bar-container">
            <div
              className="custom-progress-bar-bg"
              style={{
                width: `${dataSlider.length * 20 - 20}%`,
              }}
            ></div>
            <div
              className="custom-progress-bar w-0"
              style={{
                transition: "width 3s ease-linear",
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="custom-progress-images">
          {dataSlider.map((item) => {
            if (item.level === 0 || item.title === "Account Registration") {
              return (
                <div
                  className="custom-progress-image"
                  key={Math.floor(Math.random() * 1298319203)}
                >
                  <Image src="/img/aa.png" alt="" width={100} height={100} />
                  <span className="">{item.title}</span>
                </div>
              );
            }

            return (
              <div className="custom-progress-image" key={item.level}>
                <Image
                  src={
                    currentLevel?.level > item.level
                      ? "/img/aa.png"
                      : currentLevel?.level === item.level
                      ? "/img/aaa.png"
                      : "/img/aaaa.png"
                  }
                  alt=""
                  width={100}
                  height={100}
                />
                <span className="">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
