import Card from "@/components/card";
import { Button } from "@/components/button";
import { RoundCardMetadata } from "@/components/card/round";
import { cn } from "@/utils";
import Link from "next/link";
import LocaleSymbol from "../common/localeSymbol";

export default function RoundProjectInfo({ data }) {
  return (
    <div
      className={cn("grid grid-cols-3 gap-5", "max-sm:flex max-sm:flex-col")}
    >
      <Card
        className="col-span-2"
        head={
          <div>
            <RoundCardMetadata data={data} linkTitle={false} />

            <p className="mt-4 text-text-secondary text14medium">
              {data.description}
            </p>
          </div>
        }
      >
        <div className={cn("flex justify-between gap-4", "max-sm:flex-col")}>
          <div className="space-y-1">
            <div className="text14medium text-text-tertiary">
              Program Funders
            </div>
            <div className="text16semibold text-text-primary">
              {data.founders?.[0]}
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Link href="/apply" className="max-sm:w-full">
              <Button className="w-full">Apply</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="col-span-1">
        <Card className="text-center h-full">
          <div className="w-full h-full flex gap-5 flex-col items-center justify-center">
            <div className="">
              <div className="text14medium text-text-tertiary">
                Matching Pool
              </div>
              <div className="text24bold text-text-primary">
                <LocaleSymbol value={data.asset.amount} />
              </div>
            </div>
            <div>
              <div className="text14medium text-text-tertiary">
                Total Contributors
              </div>
              <div className="text24bold text-text-primary">
                {data.contributorsCount || 0}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
