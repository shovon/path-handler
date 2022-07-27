import { TriePath } from "./trie-path/trie-path";
import { parsePath } from "./path-parser/path-parser";

type MapLike<K, V> = {
	get(key: K): V | null | undefined;
	has(key: K): boolean;
};

export type Signal<T> = { subject: T };

type Handler<T> = (
	req: Signal<T> & {
		params: MapLike<string, string>;
		searchParams: MapLike<string, string>;
	},
	next: () => Promise<void>
) => Promise<void>;

export class PathHandler<T> {
	private triePath: TriePath<
		(path: string) => (subject: T, next: () => Promise<void>) => Promise<void>
	> = new TriePath();

	registerPath(pattern: string, handler: Handler<T>) {
		this.triePath.registerPath(pattern, (path) => {
			const url = `no-care://nomatter${path}`;

			const urlObj = new URL(url);

			const parsed = parsePath(pattern, urlObj.pathname);

			return (subject, next) =>
				handler(
					{
						subject,
						params: new Map<string, string>(Object.entries(parsed)),
						searchParams: urlObj.searchParams,
					},
					next
				);
		});
	}

	async signalPath(path: string, subject: T): Promise<boolean> {
		const url = `no-care://nomatter${path}`;
		const urlObj = new URL(url);

		const handlers = this.triePath.getFromPath(urlObj.pathname);

		if (handlers.length === 0) {
			return false;
		}

		const handler = handlers[0];
		if (!handler) {
			return false;
		}

		const next = (index: number) => {
			return async () => {
				const handler = handlers[index];
				if (!handler) {
					return;
				}
				await handler(urlObj.pathname)(subject, next(index + 1));
			};
		};

		await handler(urlObj.pathname)(subject, next(1));

		return true;
	}
}
