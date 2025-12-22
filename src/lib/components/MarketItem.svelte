<script lang="ts">
	import { page } from '$app/state';

	let { marketItem, url = null } = $props();
</script>

<div
	class={`themed-box relative flex flex-col p-3 shadow-lg/20 transition-all ${url ? 'hover:scale-102' : ''}`}
>
	{#if url}
		<a class="absolute inset-0 z-1" href={url} aria-label="Market item"></a>
	{/if}
	<div>
		
	</div>
</div>
