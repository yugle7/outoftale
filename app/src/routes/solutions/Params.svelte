<script>
	import { problem_category, problem_weight } from '../problems/data';
	import { solution_sort, solution_progress } from './data';

	import Click from '$lib/view/Click.svelte';
	import Radio from '$lib/view/Radio.svelte';
	import Select from '$lib/view/Select.svelte';
	import Flag from '$lib/view/Flag.svelte';
</script>

<div class="col gap-40">
	<Click key="weight" values={problem_weight} title="Вес" />

	<Select key="category" labels={problem_category} />
	<Radio key="progress" labels={solution_progress} />

	<Flag key="reviewed" title="Взята на проверку" />

	<Radio key="sort" labels={solution_sort} />
</div>
