import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
	CommandView,
	CommandReference as Reference,
} from "@/lib/bot-commands";

/**
 * A bot's commands: a search box, category tabs with counts, one row per
 * command, and a dialog with the full details. The open command and the tab
 * live in the URL (`?cmd=`, `?cat=`), so a command can be linked to directly
 * and everything works before hydration; the search box filters in place.
 */
export function CommandReference({ reference }: { reference: Reference }) {
	const { t } = useTranslation("bots");
	const { cmd, cat } = useSearch({ from: "/bots/$slug" });
	const navigate = useNavigate({ from: "/bots/$slug" });
	const [query, setQuery] = useState("");

	const needle = query.trim().toLocaleLowerCase();
	const matching = reference.commands.filter(
		(c) =>
			!needle ||
			[c.name, ...c.aliases, c.summary].some((text) =>
				text.toLocaleLowerCase().includes(needle),
			),
	);
	const tab = reference.categories.some((c) => c.id === cat) ? cat : undefined;
	const shown = matching.filter((c) => !tab || c.category === tab);
	const open = reference.commands.find((c) => c.id === cmd);
	const label = (id: string) =>
		reference.categories.find((c) => c.id === id)?.label ?? id;

	return (
		<section aria-labelledby="commands" className="frame mt-20 md:mt-24">
			<h2
				id="commands"
				className="col-span-12 text-lead font-semibold tracking-[-0.02em]"
			>
				{t("commands.heading")}
			</h2>
			<div className="col-span-12 mt-6 flex flex-col gap-3">
				<search>
					<label className="flex items-center gap-3 bg-surface px-4 focus-within:outline-2 focus-within:outline-ink">
						<span className="sr-only">{t("commands.search")}</span>
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
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder={t("commands.search")}
							autoComplete="off"
							className="w-full bg-transparent py-3 outline-none placeholder:text-muted"
						/>
					</label>
				</search>
				<nav
					aria-label={t("commands.heading")}
					className="flex flex-wrap gap-2"
				>
					<Tab active={!tab} category={undefined} count={matching.length}>
						{t("commands.all")}
					</Tab>
					{reference.categories.map((c) => (
						<Tab
							key={c.id}
							active={tab === c.id}
							category={c.id}
							count={matching.filter((x) => x.category === c.id).length}
						>
							{c.label}
						</Tab>
					))}
				</nav>
			</div>

			{shown.length === 0 && (
				<p className="col-span-12 mt-10 text-muted">{t("commands.empty")}</p>
			)}

			{reference.categories
				.filter((c) => shown.some((x) => x.category === c.id))
				.map((c) => (
					<div key={c.id} className="col-span-12 mt-10">
						<h3 className="mb-3 text-small font-semibold text-muted">
							{c.label}
						</h3>
						<ul className="border-t border-ink/15">
							{shown
								.filter((x) => x.category === c.id)
								.map((x) => (
									<li key={x.id} className="border-b border-ink/15">
										<CommandRow command={x} />
									</li>
								))}
						</ul>
					</div>
				))}

			<p className="col-span-12 mt-6 text-small text-muted">
				{t("commands.modsLeftOut")}
			</p>

			{open && (
				<CommandDialog
					command={open}
					category={label(open.category)}
					onClose={() =>
						navigate({
							search: (prev) => ({ ...prev, cmd: undefined }),
							replace: true,
							resetScroll: false,
						})
					}
				/>
			)}
		</section>
	);
}

function CommandRow({ command }: { command: CommandView }) {
	const { t } = useTranslation("bots");
	return (
		<Link
			to="."
			search={(prev: Record<string, unknown>) => ({ ...prev, cmd: command.id })}
			resetScroll={false}
			className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 px-2 py-3.5 transition-colors duration-150 hover:bg-surface md:grid-cols-[13rem_1fr_10rem_6rem]"
		>
			<span className="col-start-1 row-start-1 flex flex-wrap items-baseline gap-x-2">
				<Command>{command.name}</Command>
				{command.aliases.map((alias) => (
					<span key={alias} className="text-small text-muted">
						{alias}
					</span>
				))}
			</span>
			<span className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
				{command.summary}
			</span>
			<span className="hidden text-small text-muted md:col-start-3 md:row-start-1 md:block">
				{t(`commands.who.${command.who}`)}
			</span>
			<span
				aria-hidden="true"
				className="col-start-2 row-start-1 text-right text-muted group-hover:text-ink md:col-start-4"
			>
				{command.detailsHtml ? `${t("commands.details")} →` : "→"}
			</span>
		</Link>
	);
}

/**
 * The open command, in a native modal <dialog>. Server-rendered as a plain
 * open dialog (so it shows without JavaScript), then promoted to a modal on
 * hydration; Escape, the backdrop and the close link all drop `?cmd`.
 */
function CommandDialog({
	command,
	category,
	onClose,
}: {
	command: CommandView;
	category: string;
	onClose: () => void;
}) {
	const { t } = useTranslation("bots");
	const ref = useRef<HTMLDialogElement>(null);
	// Closing the server-rendered dialog to reopen it as a modal fires one `close` event to ignore.
	const promoting = useRef(false);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog || dialog.matches(":modal")) return;
		if (dialog.open) {
			promoting.current = true;
			dialog.close();
		}
		dialog.showModal();
	}, []);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: the click is only for the backdrop; keyboard users close with Escape, which <dialog> handles.
		<dialog
			ref={ref}
			open
			aria-labelledby="command-title"
			onClose={() => {
				if (promoting.current) promoting.current = false;
				else onClose();
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) event.currentTarget.close();
			}}
			className="m-auto mb-0 max-h-[88svh] w-full max-w-none overflow-y-auto bg-ground p-0 outline-1 outline-ink/20 text-ink backdrop:bg-[#0d1730]/60 sm:mb-auto sm:max-w-[44rem]"
		>
			<div className="relative px-6 pt-6 pb-8 sm:px-10 sm:pt-9 sm:pb-10">
				<Link
					to="."
					search={(prev: Record<string, unknown>) => ({
						...prev,
						cmd: undefined,
					})}
					replace
					resetScroll={false}
					className="absolute top-3 right-3 flex size-11 items-center justify-center text-lead transition-colors duration-150 hover:bg-surface"
				>
					<span aria-hidden="true">×</span>
					<span className="sr-only">{t("commands.close")}</span>
				</Link>
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pr-10">
					<h2 id="command-title" className="text-head leading-none">
						{command.name}
					</h2>
					{command.aliases.map((alias) => (
						<span key={alias} className="text-lead text-muted">
							{t("commands.alias", { alias })}
						</span>
					))}
				</div>
				<p className="mt-4 max-w-[48ch] text-lead leading-[1.3]">
					{command.summary}
				</p>
				<p className="mt-3 flex flex-wrap gap-2 text-small">
					<span className="bg-ink px-2 py-0.5 text-ground">
						{t(`commands.whoLong.${command.who}`)}
					</span>
					<span className="bg-surface px-2 py-0.5">{category}</span>
				</p>
				{command.usage.length > 0 && (
					<>
						<h3 className="mt-8 mb-3 font-semibold">{t("commands.use")}</h3>
						<dl className="flex flex-col divide-y divide-ink/15 border-y border-ink/15">
							{command.usage.map((u) => (
								<div
									key={u.syntax}
									className="grid gap-x-6 gap-y-1 py-2.5 sm:grid-cols-[13rem_1fr]"
								>
									<dt>
										<Command>{u.syntax}</Command>
									</dt>
									<dd>{u.does}</dd>
								</div>
							))}
						</dl>
					</>
				)}
				{command.detailsHtml && (
					<div
						className="prose mt-2"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown from content/bots/*.commands.ts in this repository, rendered on the server; no user input.
						dangerouslySetInnerHTML={{ __html: command.detailsHtml }}
					/>
				)}
			</div>
		</dialog>
	);
}

function Tab({
	active,
	category,
	count,
	children,
}: {
	active: boolean;
	category: string | undefined;
	count: number;
	children: React.ReactNode;
}) {
	return (
		<Link
			to="."
			search={(prev: Record<string, unknown>) => ({
				...prev,
				cat: category,
				cmd: undefined,
			})}
			replace
			resetScroll={false}
			aria-current={active ? "true" : undefined}
			className={`flex items-baseline gap-2 px-3 py-1.5 transition-colors duration-150 ${active ? "bg-ink text-ground" : "bg-surface hover:bg-ink/10"}`}
		>
			{children}
			<span
				className={`text-small tabular-nums ${active ? "text-ground/70" : "text-muted"}`}
			>
				{count}
			</span>
		</Link>
	);
}

/** A command as typed, set like the prefix fact: semibold on the surface colour, no monospace. */
function Command({ children }: { children: React.ReactNode }) {
	return (
		<span className="bg-surface px-1.5 py-0.5 font-semibold">{children}</span>
	);
}
