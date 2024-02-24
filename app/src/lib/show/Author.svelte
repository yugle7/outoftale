<script>
	import { getColor } from './data';
	export let author;

	const { username, position } = author;
	const style = `color: ${getColor(position)}`;
</script>

<span {style}>{username}</span>
