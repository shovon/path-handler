/**
 * Copyright 2022 Sal Rahman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

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
