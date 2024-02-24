<script>
	export let time;

	const is_time = time.length > 11;
	const day_name = is_time
		? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
		: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

	$: if (time) {
		const ago = new Date(time);
		const now = new Date();

		const age = (now.getTime() - ago.getTime()) / 86400000;

		if (age < 1 && ago.getDay() === now.getDay()) {
			time = is_time ? time.substring(11, 16) : 'Сегодня';
		} else if (age < 2) {
			time = 'Вчера';
		} else if (age < 7) {
			time = day_name[ago.getDay()];
		} else {
			time = time.substring(8, 10) + '.' + time.substring(5, 7) + '.' + time.substring(2, 4);
		}
	}
</script>

<span class="center font-16 line-2">{time}</span>

<style>
	span {
		white-space: nowrap;
		color: var(--color-75);
	}
</style>
