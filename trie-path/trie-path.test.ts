import { TriePath } from "./trie-path";

function assert(assertion: boolean, message?: string) {
	if (!assertion) {
		throw new Error(message ?? "Got false");
	}
}

function assertEqualArray(a: any[], b: any[]) {
	assert(
		a.length === b.length,
		`One array was of length ${a.length}, while the other was of length ${b.length}`
	);
	for (const [index] of a.entries()) {
		assert(a[index] === b[index], `${a[index]} !=== ${b[index]}`);
	}
}

const pathTrie = new TriePath();

pathTrie.registerPath("/", "root");
pathTrie.registerPath("/", "another");
pathTrie.registerPath("/haha", "haha");
pathTrie.registerPath("/something/another", "foo");
pathTrie.registerPath("/something/another", "another");
pathTrie.registerPath("/something/yet-another", "bar");
pathTrie.registerPath("/something/first/second/third", "third");
pathTrie.registerPath("/something/cool", "baz");
pathTrie.registerPath("/something/:something", "baz");
pathTrie.registerPath("/something/:something", "baz-another");
pathTrie.registerPath("/something/:no-matter", "no-matter");
pathTrie.registerPath("/something/:something/middle/:another", "cool");
pathTrie.registerPath("/something/:something/:middle", "middle");
pathTrie.registerPath("/something/:something/:middle/:third", "third");
pathTrie.registerPath("/something/:something/:middle/:third", "overloading");

assertEqualArray(pathTrie.getFromPath("/"), ["root", "another"]);
assertEqualArray(pathTrie.getFromPath("/haha"), ["haha"]);
assertEqualArray(pathTrie.getFromPath("/something/another"), [
	"foo",
	"another",
]);
assertEqualArray(pathTrie.getFromPath("/something/yet-another"), ["bar"]);
assertEqualArray(pathTrie.getFromPath("/something/first/second/third"), [
	"third",
]);
assertEqualArray(pathTrie.getFromPath("/something/cool"), ["baz"]);
assertEqualArray(pathTrie.getFromPath("/something/haha"), [
	"baz",
	"baz-another",
	"no-matter",
]);
assertEqualArray(pathTrie.getFromPath("/something/:something"), [
	"baz",
	"baz-another",
	"no-matter",
]);
assertEqualArray(pathTrie.getFromPath("/something/:no-matter"), [
	"baz",
	"baz-another",
	"no-matter",
]);
assertEqualArray(pathTrie.getFromPath("/something/:unrelated"), [
	"baz",
	"baz-another",
	"no-matter",
]);
assertEqualArray(pathTrie.getFromPath("/something/sweet/middle/foo"), ["cool"]);
assertEqualArray(pathTrie.getFromPath("/something/sweet/foo"), ["middle"]);
assertEqualArray(pathTrie.getFromPath("/something/sweet/foo/haha"), [
	"third",
	"overloading",
]);

export {};
