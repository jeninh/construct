<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import MarketTimer from './MarketTimer.svelte';

	let { data } = $props();
</script>

<Head title="Market" />

<h1 class="mt-5 mb-3 font-hero text-3xl font-medium">Market</h1>

{#if data.marketItems.length === 0}
	<MarketTimer />
{:else}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each data.marketItems as item (item.id)}
			<div class="themed-box p-4 flex flex-col gap-3">
				<img
					src={item.image}
					alt={item.name}
					class="w-full h-44 object-cover rounded-lg"
				/>
				<div>
					<h3 class="text-lg font-hc font-bold mb-1">{item.name}</h3>
					<p class="text-sm text-primary-300 leading-snug">{item.description}</p>
				</div>
			</div>
		{/each}
	</div>
{/if}

<!-- <p>Market score: {data.user.shopScore}</p> -->
