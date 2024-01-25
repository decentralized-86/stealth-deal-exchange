import React from "react";
import InfoIconImg from "@/assets/images/icons/info.svg";
import Image from "next/image";
const InfoIcon = () => {
  return <Image src={InfoIconImg} alt="info-icon" width={16} height={16} />;
};

export default InfoIcon;
