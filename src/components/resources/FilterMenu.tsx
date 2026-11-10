import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export interface FilterOption {
	value: string;
	label: string;
	/** Entries this option would show, given the other filters. */
	count: number;
}

/**
 * One filter as a compact dropdown: a `<details>` whose options are real links
 * to the same page with one search param changed, so it opens and filters
 * before (and without) hydration. Menus share a `name`, so opening one closes
 * the others; once hydrated, a click outside or Escape closes it too.
 */
export function FilterMenu({
	label,
	param,
	current,
	allLabel,
	options,
}: {
	label: string;
	param: string;
	current: string | undefined;
	allLabel: string;
	options: FilterOption[];
}) {
	const ref = useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		const details = ref.current;
		if (!details) return;
		const close = (event: Event) => {
			if (!details.open) return;
			if (
				event instanceof KeyboardEvent
					? event.key === "Escape"
					: !details.contains(event.target as Node)
			) {
				details.open = false;
				if (event instanceof KeyboardEvent)
					details.querySelector("summary")?.focus();
			}
		};
		document.addEventListener("pointerdown", close);
		document.addEventListener("keydown", close);
		return () => {
			document.removeEventListener("pointerdown", close);
			document.removeEventListener("keydown", close);
		};
	}, []);

	const selected = options.find((option) => option.value === current);
	const choices: {
		value: string | undefined;
		label: string;
		count?: number;
	}[] = [{ value: undefined, label: allLabel }, ...options];

	return (
		<details ref={ref} name="filters" className="group/menu relative">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-surface px-4 py-2.5 transition-colors duration-150 hover:bg-ink/10 [&::-webkit-details-marker]:hidden">
				<span className="truncate">
					<span className="text-muted">{label}:</span>{" "}
					<span className="font-semibold">{selected?.label ?? allLabel}</span>
				</span>
				<span
					aria-hidden="true"
					className="text-small text-muted transition-transform duration-150 group-open/menu:rotate-180"
				>
					▾
				</span>
			</summary>
			<ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-[60svh] overflow-y-auto border border-ink/15 bg-ground py-1 lg:min-w-[16rem]">
				{choices.map((choice) => {
					const active = choice.value === current;
					const empty = choice.count === 0 && !active;
					const content = (
						<>
							<span>{choice.label}</span>
							{choice.count !== undefined && (
								<span className="tabular-nums text-muted">{choice.count}</span>
							)}
						</>
					);
					const row = "flex items-baseline justify-between gap-4 px-4 py-2";
					return (
						<li key={choice.label}>
							{empty ? (
								<span className={`${row} text-muted/60`}>{content}</span>
							) : (
								<Link
									to="."
									search={(prev: Record<string, unknown>) => ({
										...prev,
										[param]: choice.value,
										page: undefined,
									})}
									resetScroll={false}
									onClick={() => {
										if (ref.current) ref.current.open = false;
									}}
									aria-current={active ? "true" : undefined}
									className={`${row} ${active ? "bg-surface font-semibold" : "hover:bg-surface"}`}
								>
									{content}
								</Link>
							)}
						</li>
					);
				})}
			</ul>
		</details>
	);
}
