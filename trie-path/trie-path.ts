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

const pathSeparator = "/";

export class TriePath<T> {
	private values: T[] = [];
	private paths: Map<string, TriePath<T>> = new Map();
	private param: TriePath<T> | null = null;

	private getSubPath(prefix: string): TriePath<T> {
		const path = this.paths.get(prefix) ?? new TriePath();
		if (!this.paths.has(prefix)) {
			this.paths.set(prefix, path);
		}
		return path;
	}

	private getParamPath(): TriePath<T> {
		const path = this.param ?? new TriePath();
		if (!this.param) {
			this.param = path;
		}
		return path;
	}

	registerPath(path: string, value: T) {
		const parts = path.split(pathSeparator);
		const [first, ...remainder] = parts;
		if (typeof first !== "string") {
			throw new Error("An unknown error occurred");
		}
		const subPath =
			first[0] === ":" ? this.getParamPath() : this.getSubPath(first);
		if (remainder.length === 0) {
			subPath.values.push(value);
		} else {
			subPath.registerPath(remainder.join(pathSeparator), value);
		}
	}

	getFromPath(path: string): T[] {
		const parts = path.split(pathSeparator);
		const [first, ...remainder] = parts;
		if (typeof first !== "string") {
			throw new Error("An unknown error occurred");
		}
		const subPath = this.paths.get(first) ?? this.param;
		if (remainder.length === 0 && subPath) {
			return [...subPath.values];
		} else {
			if (!subPath) {
				return [];
			} else {
				return subPath.getFromPath(remainder.join(pathSeparator));
			}
		}
	}
}
