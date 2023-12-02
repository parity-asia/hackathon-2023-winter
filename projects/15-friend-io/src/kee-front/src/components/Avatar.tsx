import { FC, ImgHTMLAttributes, useState } from "react";

import { getInitials } from "../utils";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  // className?: string;
  // alt?: string;
  // src?: string;
  width: number;
  height: number;
  name?: string;
  type?: "user" | "channel";
}

function getFontSize(width: number): number {
  if (width <= 16) return 8;
  if (width <= 24) return 12;
  if (width <= 32) return 16;
  if (width <= 40) return 18;
  if (width <= 56) return 22;
  if (width <= 80) return 48;
  return 64;
}

const Avatar: FC<Props> = ({
  src = "",
  name = "Deleted User",
  type = "user",
  width,
  height,
  ...rest
}) => {
  const [error, setError] = useState(false);
  const handleError = () => {
    setError(true);
  };
  if (!error && src) {
    return <img width={width} height={height} src={src} onError={handleError} {...rest} />;
  }
  // 长度限制在六个字符
  let initials = getInitials(name).substring(0, 6);
  const len = initials.length;
  const scaleVal = len > 2 ? (11 - len) / 10 : 1;
  return (
    <div
      className={`rounded-full flex-center ${rest.className || ""}`}
      style={{
        width,
        height,
        fontSize: getFontSize(width),
        fontWeight: 400,
        fontFamily: "'Lato', 'Lato-Regular', 'Helvetica Neue'",
        background: type === "channel" ? "#EAECF0" : "#4c99e9",
        color: type === "channel" ? "#475467" : "#FFFFFF"
      }}
    >
      <span className="whitespace-nowrap" style={{ transform: `scale(${scaleVal})` }}>
        {initials}
      </span>
    </div>
  );
};

export default Avatar;
