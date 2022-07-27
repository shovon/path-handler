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

export const parsePath = (pattern: string, path: string): object => {
	const patternParts = pattern.split("/");
	const pathParts = path.split("/");

	if (patternParts.length !== pathParts.length) {
		throw new Error(`Unable to match ${pathParts} with ${patternParts}`);
	}

	const result: any = {};

	for (const [index] of patternParts.entries()) {
		const part = patternParts[index];
		if (typeof part !== "string") {
			throw new Error("An unknown error occurred");
		}
		if (part[0] === ":") {
			result[part.slice(1)] = pathParts[index];
		} else if (patternParts[index] !== pathParts[index]) {
			throw new Error(`Unable to match ${pathParts} with ${patternParts}`);
		}
	}

	return result;
};
