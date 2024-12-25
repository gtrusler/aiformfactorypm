/* eslint-disable @next/next/no-img-element */
import HeroLottie from "./HeroLottie";
import { GetStartedButton2 } from "@/components/landing-components";

const Hero2 = () => {
  return (
    <section className="w-full rounded-xl bg-gradient-to-br from-surface-brand to-[#6FA0FF] flex justify-center p-xl mt-[76px]">
      <div className="flex pl-xl max-lg:pl-0 justify-center items-center gap-[64px] flex-1 w-full max-lg:flex-col">
        <div
          id="left-side"
          className="flex justify-center items-center gap-[12px] pl-xl flex-1 max-lg:pl-0"
        >
          <div className="flex flex-col items-start justify-center flex-1 w-full gap-2xs max-lg:items-center">
            <div className="h-[48px] bg-white"></div>
            {/** PRODUCT HUNT SVG START */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="157"
              height="48"
              viewBox="0 0 157 48"
              fill="none"
            >
              <g clipPath="url(#clip0_1540_40731)">
                <path
                  d="M1440 0H0V900H1440V0Z"
                  fill="url(#paint0_radial_1540_40731)"
                  fillOpacity="0.75"
                />
              </g>
              <defs>
                <clipPath id="clip0_1540_40731">
                  <rect width="156.59" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {/** PRODUCT HUNT SVG END */}
            <h1 className="text-[60px] font-bold text-white max-lg:text-center max-sm:text-xl">
              Officia occaecat mollit consect,{" "}
              <span className="hidden max-sm:inline">not weeks</span>
              <span className="bg-white">
                <div className="text-[60px] max-sm:hidden font-bold bg-gradient-to-br  from-surface-brand to-[#6FA0FF] inline-block text-transparent bg-clip-text">
                  not weeks.
                </div>
              </span>
            </h1>
            <h3 className="text-xl font-medium text-white max-lg:text-center max-sm:text-sm">
              Non enim ut magna sunt officia ea cillum ex. online
            </h3>
            <div className="flex p-2xs justify-center items-start gap-[10px] rounded-sm bg-[#635BFF]">
              <h3 className="text-lg font-normal text-white max-lg:text-center max-sm:text-sm">
                Eiusmod aliqua consequat do cillum reprehenderit laboris
                consequat excepteur et adipisicing.
              </h3>
            </div>
            <div className="flex flex-col items-start justify-center gap-2xs max-lg:items-center">
              <GetStartedButton2 />
              <div className="text-white text-[14px] font-normal flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    opacity="0.2"
                    d="M19.5 12V18.75C19.5 18.9489 19.421 19.1397 19.2803 19.2803C19.1397 19.421 18.9489 19.5 18.75 19.5H5.25C5.05109 19.5 4.86032 19.421 4.71967 19.2803C4.57902 19.1397 4.5 18.9489 4.5 18.75V12H19.5Z"
                    fill="#7DFFA2"
                  />
                  <path
                    d="M20.25 6.75H16.9613C16.9978 6.71906 17.0353 6.68906 17.0709 6.65625C17.3557 6.40329 17.5851 6.0943 17.745 5.74861C17.9049 5.40292 17.9917 5.02796 18 4.64718C18.0123 4.23063 17.9394 3.81595 17.7856 3.42861C17.6319 3.04127 17.4006 2.68944 17.106 2.39471C16.8113 2.09999 16.4596 1.8686 16.0723 1.71474C15.685 1.56088 15.2703 1.48781 14.8538 1.5C14.4728 1.5082 14.0977 1.59495 13.7518 1.75482C13.406 1.91468 13.0968 2.14422 12.8438 2.42906C12.4936 2.8349 12.2089 3.29291 12 3.78656C11.7911 3.29291 11.5064 2.8349 11.1562 2.42906C10.9032 2.14422 10.594 1.91468 10.2482 1.75482C9.90232 1.59495 9.52718 1.5082 9.14625 1.5C8.72969 1.48781 8.31503 1.56088 7.92774 1.71474C7.54044 1.8686 7.18868 2.09999 6.89405 2.39471C6.59941 2.68944 6.36812 3.04127 6.21438 3.42861C6.06064 3.81595 5.98768 4.23063 6 4.64718C6.00833 5.02796 6.09514 5.40292 6.255 5.74861C6.41486 6.0943 6.64434 6.40329 6.92906 6.65625C6.96469 6.68718 7.00219 6.71718 7.03875 6.75H3.75C3.35218 6.75 2.97064 6.90803 2.68934 7.18934C2.40804 7.47064 2.25 7.85217 2.25 8.25V11.25C2.25 11.6478 2.40804 12.0294 2.68934 12.3107C2.97064 12.592 3.35218 12.75 3.75 12.75V18.75C3.75 19.1478 3.90804 19.5294 4.18934 19.8107C4.47064 20.092 4.85218 20.25 5.25 20.25H18.75C19.1478 20.25 19.5294 20.092 19.8107 19.8107C20.092 19.5294 20.25 19.1478 20.25 18.75V12.75C20.6478 12.75 21.0294 12.592 21.3107 12.3107C21.592 12.0294 21.75 11.6478 21.75 11.25V8.25C21.75 7.85217 21.592 7.47064 21.3107 7.18934C21.0294 6.90803 20.6478 6.75 20.25 6.75ZM13.9688 3.42281C14.0875 3.29167 14.2321 3.1865 14.3934 3.1139C14.5547 3.0413 14.7293 3.00284 14.9062 3.00093H14.9522C15.1595 3.00223 15.3645 3.0449 15.5552 3.12644C15.7458 3.20798 15.9183 3.32675 16.0624 3.47579C16.2066 3.62483 16.3195 3.80115 16.3947 3.99441C16.4698 4.18766 16.5056 4.39397 16.5 4.60125C16.4981 4.77815 16.4596 4.95275 16.387 5.11408C16.3144 5.27541 16.2093 5.42 16.0781 5.53875C15.1884 6.32625 13.7119 6.60375 12.7969 6.70125C12.9094 5.70843 13.2188 4.26562 13.9688 3.42281ZM7.96031 3.45656C8.25088 3.16602 8.64441 3.00194 9.05531 3H9.10125C9.27815 3.0019 9.45275 3.04037 9.61409 3.11297C9.77542 3.18556 9.92 3.29073 10.0388 3.42187C10.8253 4.31062 11.1028 5.78437 11.2003 6.69562C10.2891 6.60187 8.81531 6.32062 7.92656 5.53406C7.79543 5.41531 7.69026 5.27073 7.61766 5.1094C7.54506 4.94806 7.5066 4.77346 7.50469 4.59656C7.49887 4.38584 7.53593 4.17614 7.61361 3.98018C7.69128 3.78421 7.80796 3.60607 7.95656 3.45656H7.96031ZM3.75 8.25H11.25V11.25H3.75V8.25ZM5.25 12.75H11.25V18.75H5.25V12.75ZM18.75 18.75H12.75V12.75H18.75V18.75ZM20.25 11.25H12.75V8.25H20.25V11.25Z"
                    fill="#7DFFA2"
                  />
                </svg>
                <div>
                  <span className="text-[16px] max-sm:text-sm font-bold text-[#7DFFA2]">
                    {" "}
                    100$ off
                  </span>

                  {"  "}
                  <span className="text-[16px] max-sm:text-sm font-normal">
                    Amet id enim deserunt irure consequat ex sint irure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="lottie"
          className="flex-1 height-[680px] rounded-[32px] overflow-hidden "
        >
          <HeroLottie className="h-full rounded-[32px]" />
        </div>
      </div>
    </section>
  );
};

export default Hero2;
