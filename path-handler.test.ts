import { PathHandler } from "./path-handler";

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

async function run() {
	{
		const pathHandler = new PathHandler<string>();

		const invocations: (string | number)[] = [];

		const expectedInvocations = ["request", 1, 3, 5, 6, 4, 2];

		pathHandler.registerPath("/sweet", async (req, next) => {
			invocations.push(req.subject);
			invocations.push(1);
			await next();
			invocations.push(2);
		});

		pathHandler.registerPath("/sweet", async (req, next) => {
			invocations.push(3);
			await next();
			invocations.push(4);
		});

		pathHandler.registerPath("/sweet", async (req, next) => {
			invocations.push(5);
			await next();
			invocations.push(6);
		});

		pathHandler.registerPath("/sweet/sub", async (req, next) => {
			invocations.push(req.subject);
			invocations.push(7);
			await next();
			invocations.push(8);
		});

		await pathHandler.signalPath("/sweet", "request");

		assertEqualArray(invocations, expectedInvocations);
	}

	{
		const pathHandler = new PathHandler<string>();

		const invocations: (string | number)[] = [];

		const expectedInvocations = ["another request", 7, 8];

		pathHandler.registerPath("/sweet", async (req, next) => {
			invocations.push(req.subject);
			invocations.push(1);
			await next();
			invocations.push(2);
		});

		pathHandler.registerPath("/sweet", async (req, next) => {
			invocations.push(3);
			await next();
			invocations.push(4);
		});

		pathHandler.registerPath("/sweet", async (req, next) => {
			invocations.push(5);
			await next();
			invocations.push(6);
		});

		pathHandler.registerPath("/sweet/sub", async (req, next) => {
			invocations.push(req.subject);
			invocations.push(7);
			await next();
			invocations.push(8);
		});

		await pathHandler.signalPath("/sweet/sub", "another request");

		assertEqualArray(invocations, expectedInvocations);
	}

	{
		const pathHandler = new PathHandler<string>();

		const invocations: (string | number | undefined | null)[] = [];

		const expectedInvocations = [
			"param",
			"another request",
			"search",
			1,
			"param",
			"another request",
			"search",
			3,
			4,
			2,
		];

		pathHandler.registerPath("/sweet/:cool", async (req, next) => {
			invocations.push(req.params.get("cool"));
			invocations.push(req.subject);
			invocations.push(req.params.get("query_param"));
			invocations.push(1);
			await next();
			invocations.push(2);
		});

		pathHandler.registerPath("/sweet/:cool", async (req, next) => {
			invocations.push(req.params.get("cool"));
			invocations.push(req.subject);
			invocations.push(req.params.get("query_param"));
			invocations.push(3);
			await next();
			invocations.push(4);
		});

		pathHandler.registerPath("/sweet/:cool/haha", async (req, next) => {
			invocations.push(req.params.get("cool"));
			invocations.push(req.subject);
			invocations.push(req.params.get("query_param"));
			invocations.push(3);
			await next();
			invocations.push(4);
		});

		await pathHandler.signalPath(
			"/sweet/param?query_param=search",
			"another request"
		);

		assertEqualArray(invocations, expectedInvocations);
	}
}

run().catch(console.error);
