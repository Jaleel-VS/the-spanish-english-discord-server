import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * The search field of a kind's page. Without JavaScript it is a plain GET form
 * that keeps the active filters as hidden fields; once hydrated it updates the
 * URL as you type (debounced), replacing the history entry.
 */
export function SearchBox({
	current,
	keep,
}: {
	current: string | undefined;
	/** Active filters to carry over on a plain form submit. */
	keep: Record<string, string | undefined>;
}) {
	const { t } = useTranslation("resources");
	const navigate = useNavigate();
	const [value, setValue] = useState(current ?? "");
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	/** Queries this box has put in the URL that the route has not caught up with yet, oldest first. */
	const pending = useRef<(string | undefined)[]>([]);

	// Our own updates arrive late, so they must not undo newer typing: drop
	// them (and any older ones) from the queue. Anything else came from
	// elsewhere (Clear filters, back button), so the box follows the URL.
	useEffect(() => {
		const own = pending.current.indexOf(current);
		if (own === -1) {
			pending.current = [];
			setValue(current ?? "");
		} else {
			pending.current = pending.current.slice(own + 1);
		}
	}, [current]);
	useEffect(() => () => clearTimeout(timer.current), []);

	const go = (typed: string) => {
		const q = typed.trim() || undefined;
		pending.current.push(q);
		return navigate({
			to: ".",
			search: (prev: Record<string, unknown>) => ({
				...prev,
				q,
				page: undefined,
			}),
			replace: true,
			resetScroll: false,
		});
	};

	return (
		<search>
			<form
				method="get"
				onSubmit={(event) => {
					event.preventDefault();
					clearTimeout(timer.current);
					go(value);
				}}
			>
				<label className="flex items-center gap-3 bg-surface px-4 focus-within:outline-2 focus-within:outline-ink">
					<span className="sr-only">{t("search.label")}</span>
					<svg
						aria-hidden="true"
						viewBox="0 0 16 16"
						className="size-4 shrink-0 text-muted"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
					>
						<circle cx="7" cy="7" r="4.75" />
						<path d="m10.5 10.5 3.5 3.5" />
					</svg>
					<input
						type="search"
						name="q"
						value={value}
						maxLength={100}
						placeholder={t("search.placeholder")}
						autoComplete="off"
						onChange={(event) => {
							const next = event.target.value;
							setValue(next);
							clearTimeout(timer.current);
							timer.current = setTimeout(() => go(next), 300);
						}}
						className="w-full bg-transparent py-3 outline-none placeholder:text-muted"
					/>
				</label>
				{Object.entries(keep).map(([name, kept]) =>
					kept ? (
						<input key={name} type="hidden" name={name} value={kept} />
					) : null,
				)}
				<button type="submit" className="sr-only">
					{t("search.submit")}
				</button>
			</form>
		</search>
	);
}
