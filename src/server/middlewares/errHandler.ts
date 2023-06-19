import {
	SystemPandaError,
	logfile,
	logger,
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "../../util/index.js";
import { ErrorRequestHandler } from "express";

const errHandler: ErrorRequestHandler = async (err, req, res) => {
	const isPrismaErr = [
		PrismaClientInitializationError,
		PrismaClientKnownRequestError,
		PrismaClientRustPanicError,
		PrismaClientUnknownRequestError,
		PrismaClientValidationError,
	].some(x => err.constructor.name === x.name);

	if (!res.headersSent) {
		if (isPrismaErr) {
			const error: PrismaClientValidationError = err;
			res.status(500).json({ success: false, message: error.message });
		} else {
			res.status(500).json({
				success: false,
				message:
					err instanceof Error || err instanceof SystemPandaError ? err.message : err,
			});
		}
	}

	await logger(logfile, err as SystemPandaError | Error);
	console.log(err);
};

export { errHandler };
