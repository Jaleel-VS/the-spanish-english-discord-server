import { Link } from "@tanstack/react-router";

export interface FilterOption {
	value: string | undefined;
	label: string;
}

/**
 * One row of filter links. Each option is a real link to the same page with
 * one search param changed, so filtering works before (and without) hydration.
 */
export function FilterGroup({
	label,
	param,
	current,
	options,
}: {
	label: string;
	param: string;
	current: string | undefined;
	options: FilterOption[];
}) {
	return (
		<nav
			className="flex flex-wrap items-baseline gap-x-5 gap-y-2"
			aria-label={label}
		>
			<span className="w-full shrink-0 text-muted sm:w-24">{label}</span>
			{options.map((option) => {
				const active = option.value === current;
				return (
					<Link
						key={option.label}
						to="."
						search={(prev: Record<string, unknown>) => ({
							...prev,
							[param]: option.value,
							page: undefined,
						})}
						resetScroll={false}
						aria-current={active ? "true" : undefined}
						className={
							active
								? "bg-ink px-2 py-0.5 text-ground"
								: "px-2 py-0.5 underline-offset-[0.2em] transition-colors duration-150 hover:bg-surface"
						}
					>
						{option.label}
					</Link>
				);
			})}
		</nav>
	);
}
