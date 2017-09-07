
export default function forAll(values, invoke) {
	if (Array.isArray(values) && typeof (invoke) === 'function') {
		values.forEach(invoke);
	}
}
