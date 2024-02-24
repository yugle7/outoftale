<script>
	import { getColor } from '../data';

	export let user;

	const { position, username } = user;
	const style = `color: ${getColor(position)}`;
</script>

<h1 class="center" {style}>{username}</h1>
