"use client";

import { Button } from "@askgovmy/ui";
import { FunctionComponent } from "react";
import { cn, paramsToRecord } from "@askgovmy/utils";
import { route, routes } from "@/lib/routes";
import { useParams, useSearchParams } from "next/navigation";
import { PageResult, DeepKeys } from "@/types/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/i18n";

interface PaginatorProps {
  route: DeepKeys<typeof routes>;
  data: PageResult<unknown>["page"];
}

export const Paginator: FunctionComponent<PaginatorProps> = ({
  route: _route,
  data,
}) => {
  const { push } = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const getVisiblePageNumber = () => {
    if (data.max <= 4) return createRange(1, data.max);

    if (data.current <= 3) {
      const ellipsis_start = 4;
      return [...createRange(1, ellipsis_start), "...", data.max];
    }

    if (data.current >= data.max - 3)
      return [1, "...", ...createRange(data.max - 3, data.max)];

    return [1, "...", ...createMiddlePages(), "...", data.max];
  };

  const createRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  };

  const createMiddlePages = () => {
    const mid_start = Math.max(2, data.current - 1);
    const mid_end = Math.min(data.current + 1, data.max - 1);
    return createRange(mid_start, mid_end);
  };

  const navigate = (page: number) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", page.toString());
    push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-center h-10">
      {/* Pagination */}
      <div className="flex items-center space-x-3">
        <Button
          variant="secondary"
          className="h-10 w-10"
          disabled={data.current <= 1}
          onClick={() => navigate(data.current - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <ol className="flex">
          {getVisiblePageNumber().map((page, index) =>
            typeof page === "number" ? (
              <Link
                key={index}
                href={route(_route, params, {
                  ...paramsToRecord(searchParams),
                  page,
                })}
                scroll={false}
                className={cn(
                  "rounded-lg text-sm",
                  page === data.current &&
                    "bg-askmygovbrand-50 text-askmygovtextbrand-600"
                )}
              >
                <li
                  key={page}
                  className="h-10 w-10 flex items-center justify-center"
                >
                  {page}
                </li>
              </Link>
            ) : (
              <span
                key={`ellipsis-${index}`}
                className="h-10 w-10 flex items-center justify-center"
              >
                {page}
              </span>
            )
          )}
        </ol>
        <Button
          variant="secondary"
          className="h-10 w-10"
          disabled={data.current >= data.max}
          onClick={() => navigate(data.current + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
