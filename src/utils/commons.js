function compareDates(dateToCompare) {
	let currentDate = new Date();

	if (dateToCompare > currentDate) {
		return 'VENCIDO';
	} else {
		return 'AGUARDANDO';
	}
}

module.exports = { compareDates };
