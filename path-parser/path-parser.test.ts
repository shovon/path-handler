import { parsePath } from "./path-parser";

function assert(assertion: boolean, message?: string) {
	if (!assertion) {
		throw new Error(message ?? "Got false");
	}
}

function assertEqual(a: any, b: any, message?: string) {
	assert(a === b, message ?? `Expected ${a} === ${b}`);
}

function assertObjectProperties(subset: any, superset: any) {
	for (const [key] of Object.entries(subset)) {
		assertEqual(subset[key], superset[key]);
	}
}

function assertExactObjectProperties(a: object, b: object) {
	const aLength = Object.entries(a).length;
	const bLength = Object.entries(b).length;
	assertEqual(
		Object.entries(a).length,
		Object.entries(b).length,
		`Expected ${aLength} === ${bLength}. a = ${JSON.stringify(
			a
		)}, b = ${JSON.stringify(b)}`
	);

	assertObjectProperties(a, b);
}

function assertShouldThrow(cb: () => void) {
	let thrown = false;
	try {
		cb();
	} catch {
		thrown = true;
	}
	assert(thrown, "Should have thrown an exception");
}

assertExactObjectProperties(parsePath("/something", "/something"), {});
assertExactObjectProperties(
	parsePath("/something/another", "/something/another"),
	{}
);
assertExactObjectProperties(
	parsePath("/something/:another", "/something/another"),
	{
		another: "another",
	}
);
assertExactObjectProperties(
	parsePath("/something/:another", "/something/foo"),
	{
		another: "foo",
	}
);
assertExactObjectProperties(
	parsePath("/something/:another/:a", "/something/foo/:a"),
	{
		another: "foo",
		a: ":a",
	}
);
assertExactObjectProperties(parsePath("/:foo/:bar", "/baz/bar"), {
	foo: "baz",
	bar: "bar",
});
assertShouldThrow(() => {
	parsePath("/something", "/another");
});
