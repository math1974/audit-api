import moment from 'moment-timezone';

moment.fn.isToday = function() {
	const today = moment();

	return this.isSame(today, 'day');
};

moment.fn.isYesterday = function() {
	const yesterday = moment().subtract(1, 'day');

	return this.isSame(yesterday, 'day');
};

const DEFAULT_FORMAT = 'DD/MM/YYYY';

export const getDateInstance = date => moment(date);

export const now = () => moment();

export const toISOString = date => moment(date).toISOString();

export const fromNow = date => moment().to(date);

export const formatDate = (date, targetFormat = DEFAULT_FORMAT, sourceFormat) => (
	date ? moment(date, sourceFormat).format(targetFormat) : ''
);

export const getDateLabel = (date, format = DEFAULT_FORMAT) => {
	const dateInstance = moment(date);

	return dateInstance.isToday() ? 'Hoje' : dateInstance.format(format);
};

export const isValid = (date, format, strict) => moment(date, format, strict).isValid();

export const isSame = (firstDate, secondDate, unit) => moment(firstDate).isSame(secondDate, unit);

export const isBefore = (firstDate, secondDate, unit) => moment(firstDate).isBefore(secondDate, unit);

export const isAfter = (firstDate, secondDate, unit) => moment(firstDate).isAfter(moment(secondDate), unit);

export const diff = (firstDate, secondDate, unit = 'seconds') => moment(firstDate).diff(moment(secondDate), unit);

export const isExpired = date => {
	const dateInstance = moment(date);

	return !dateInstance.isValid() || dateInstance.isSameOrBefore(now());
};

export const getDurationBetweenDates = (startDate, endDate) => {
	const startDateInstance = moment(startDate);
	const endDateInstance = moment(endDate);
	const duration = moment.duration(endDateInstance.diff(startDateInstance));

	const days = duration.days();

	duration.subtract(days, 'days');

	const hours = duration.hours();

	duration.subtract(hours, 'hours');

	const minutes = duration.minutes();

	duration.subtract(minutes, 'minutes');

	return {
		days: days < 10 ? `0${days} ` : days,
		hours: hours < 10 ? `0${hours} ` : hours,
		minutes: minutes < 10 ? `0${minutes}` : minutes
	};
};
