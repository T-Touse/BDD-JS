export function format(str, values,idx) {
	let index = 0;
	return str.replaceAll(/\%p|\%s|\%i|\%f|\%j|\%o|\%\#|\%\%/g, (type) => {
		if (index >= values.length) {
			throw new Error("Not enough values provided");
		}
		const value = values[index++];
		switch (type) {
			case "%p":
				return String(value);
			case "%s": // String
				return String(value);
			case "%i": // Integer
			case "%d": // Decimal (équivalent à %i)
				return parseInt(value, 10).toString();
			case "%f": // Float
				return parseFloat(value).toString();
			case "%j": // JSON
				return JSON.stringify(value);
			case "%o": // Object
				return value.toString();
			case "%#": 
				return idx;
			case "%%": // Pour insérer un pourcentage littéral
				return "%";
			default:
				throw new Error(`Unsupported format type: ${type}`);
		}
	});
}