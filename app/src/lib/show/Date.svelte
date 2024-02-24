<script>
	export let time;

	$: date = time.substring(8, 10) + '.' + time.substring(5, 7) + '.' + time.substring(2, 4);
</script>

<span class="font-16 line-2">{date}</span>

<style>
	span {
		white-space: nowrap;
		color: var(--color-75);
	}
</style>
