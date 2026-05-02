import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useId } from "react";
import { useTranslation } from "react-i18next";

function Pagination({
  className,
  totalPages,
  onPageChange,
  currentPage,
  pageSize,
  onPageSizeChange,
  ...props
}: React.ComponentProps<"nav"> & {
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const go = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const selectId = useId();
  const { t } = useTranslation("common");

  const isSelectedPageSize = (value: string) => {
    return value === String(pageSize);
  };

  return (
    <nav
      role="navigation"
      aria-label={t("pagination.navAriaLabel")}
      data-slot="pagination"
      className={cn(
        "mx-auto flex w-full flex-wrap items-center justify-center gap-4 rounded-lg border border-border bg-transparent p-4",
        className,
      )}
      {...props}
    >
      <div className="flex shrink-0 items-center gap-3">
        <Label htmlFor={selectId}>{t("pagination.rowsPerPage")}</Label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger id={selectId} className="w-fit whitespace-nowrap">
            <SelectValue placeholder={t("pagination.selectPageSize")} />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto">
            <SelectItem value="10" className={cn(isSelectedPageSize("10") && "bg-orange-400")}>{t("pagination.pageSize.10")}</SelectItem>
            <SelectItem value="20" className={cn(isSelectedPageSize("20") && "bg-orange-400")}>{t("pagination.pageSize.20")}</SelectItem>
            <SelectItem value="25" className={cn(isSelectedPageSize("25") && "bg-orange-400")}>{t("pagination.pageSize.25")}</SelectItem>
            <SelectItem value="50" className={cn(isSelectedPageSize("50") && "bg-orange-400")}>{t("pagination.pageSize.50")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            label={t("pagination.previous")}
            ariaLabel={t("pagination.previousAria")}
            aria-disabled={currentPage <= 1}
            className={cn(
              currentPage <= 1 && "pointer-events-none opacity-40",
            )}
            onClick={(e) => go(currentPage - 1, e)}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={currentPage === page}
              onClick={(e) => go(page, e)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            label={t("pagination.next")}
            ariaLabel={t("pagination.nextAria")}
            aria-disabled={currentPage >= totalPages}
            className={cn(
              currentPage >= totalPages && "pointer-events-none opacity-40",
            )}
            onClick={(e) => go(currentPage + 1, e)}
          />
        </PaginationItem>
      </PaginationContent>
    </nav>
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row flex-wrap items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  label = "Previous",
  ariaLabel = "Go to previous page",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <PaginationLink
      {...props}
      aria-label={ariaLabel}
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">{label}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  label = "Next",
  ariaLabel = "Go to next page",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <PaginationLink
      {...props}
      aria-label={ariaLabel}
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
    >
      <span className="hidden sm:block">{label}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { t } = useTranslation("common");
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">{t("pagination.morePages")}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
