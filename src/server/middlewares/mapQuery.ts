import { ContentKittyError } from "../../util/index.js";

const mapQuery = (query: object) =>
	Object.fromEntries(
		Object.entries(query).map(([key, value]) => {
			let newValue = value;

			if (key === "where") {
				try {
					newValue = JSON.parse(newValue);
				} catch (error) {
					throw new ContentKittyError({
						level: "informative",
						message: "Malformed JSON in the WHERE clause.",
						status: 400,
					});
				}
			} else if (newValue.includes(",")) {
				if (key === "distinct") {
					newValue = newValue.split(",");
				} else {
					newValue = Object.fromEntries(
						newValue.split(",").map((subPair: string) => subPair.split("-"))
					);
				}
			} else if (newValue.includes("-")) {
				const [subKey, subValue] = newValue.split("-");
				newValue = { [subKey]: subValue };
			}

			newValue = isNaN(newValue) ? newValue : Number(newValue);

			return [key, newValue];
		})
	);

export { mapQuery };
