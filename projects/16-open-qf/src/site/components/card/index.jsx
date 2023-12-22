import { cn } from "@/utils";
import { Card as CardBase } from "@osn/common-ui";

export default function Card({
  cover,
  coverPosition = "auto",
  prefix,
  className = "",
  children,
  hoverable = false,
  size = "default",
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        "border border-stroke-border-default",
        "bg-fill-bg-primary",
        "shadow-shadow-card-default",
        hoverable && "hover:shadow-shadow-card-hover",
        "[&_.osn-card]:shadow-none [&_.osn-card]:bg-transparent [&_.osn-card]:h-full [&_.osn-card]:w-full [&_.osn-card]:flex-1",
        "[&_.osn-card-body]:w-full [&_.osn-card-body]:h-full [&_.osn-card-body]:flex [&_.osn-card-body]:flex-col",
        // padding
        "[&_.osn-card]:max-sm:p-6",
        className,
      )}
    >
      {cover && (
        <div
          className={cn(
            "h-[120px] w-full bg-fill-bg-quaternary",
            coverPosition === "auto" && "sm:hidden",
            coverPosition === "top" && "block",
          )}
        >
          {cover}
        </div>
      )}
      <CardBase
        bordered={false}
        hoverable={false}
        size={size}
        {...props}
        prefix={
          prefix ||
          (cover && (
            <>
              <div
                className={cn(
                  "osn-card-prefix",
                  coverPosition === "auto" && "max-sm:hidden",
                  coverPosition === "top" && "hidden",
                )}
              >
                <div className="w-[216px] h-[216px] bg-fill-bg-quaternary">
                  {cover}
                </div>
              </div>
            </>
          ))
        }
      >
        {children}
      </CardBase>
    </div>
  );
}
