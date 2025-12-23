<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let publicItems = $derived(
		data.marketItems
			.filter((item) => item.isPublic)
			.sort((a, b) => a.minPrice - b.minPrice)
	);

	let draftItems = $derived(
		data.marketItems
			.filter((item) => !item.isPublic)
			.sort((a, b) => a.minPrice - b.minPrice)
	);

	let showForm = $state(false);
	let editingId: number | null = $state(null);
	let formData = $state({
		name: '',
		description: '',
		image: '',
		minRequiredShopScore: '0',
		minShopScore: '0',
		maxShopScore: '10000',
		minPrice: '0',
		maxPrice: '0',
		isPublic: false
	});

	function openEditForm(item: typeof data.marketItems[0]) {
		editingId = item.id;
		formData = {
			name: item.name,
			description: item.description,
			image: item.image,
			minRequiredShopScore: item.minRequiredShopScore.toString(),
			minShopScore: item.minShopScore.toString(),
			maxShopScore: item.maxShopScore.toString(),
			minPrice: item.minPrice.toString(),
			maxPrice: item.maxPrice.toString(),
			isPublic: item.isPublic
		};
		showForm = true;
	}

	function openNewForm() {
		editingId = null;
		formData = {
			name: '',
			description: '',
			image: '',
			minRequiredShopScore: '0',
			minShopScore: '0',
			maxShopScore: '10000',
			minPrice: '0',
			maxPrice: '0',
			isPublic: false
		};
		showForm = true;
	}

	function closeForm() {
		showForm = false;
	}
</script>

<Head title="Market" />

<h1 class="mt-5 mb-6 font-hero text-3xl font-medium">Market</h1>

<button onclick={openNewForm} class="button primary md mb-6">+ Add Item</button>

{#if showForm}
	<div class="themed-box mb-6 p-6">
		<h2 class="text-xl font-hc font-bold mb-4">
			{editingId ? 'Edit' : 'Create'} Item
		</h2>
		<form
			method="POST"
			action={editingId ? '?/update' : '?/create'}
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					closeForm();
				};
			}}
		>
			{#if editingId}
				<input type="hidden" name="id" value={editingId} />
			{/if}

			<div class="mb-4">
				<label for="marketName" class="block text-sm font-medium mb-2">Name</label>
				<input
					id="marketName"
					type="text"
					name="name"
					bind:value={formData.name}
					required
					class="themed-input w-full px-3 py-2"
				/>
			</div>

			<div class="mb-4">
				<label for="marketDescription" class="block text-sm font-medium mb-2">Description</label>
				<textarea
					id="marketDescription"
					name="description"
					bind:value={formData.description}
					required
					class="themed-input w-full px-3 py-2"
				></textarea>
			</div>

			<div class="mb-4">
				<label for="marketImage" class="block text-sm font-medium mb-2">Image URL</label>
				<input
					id="marketImage"
					type="text"
					name="image"
					bind:value={formData.image}
					required
					class="themed-input w-full px-3 py-2"
				/>
			</div>

			<div class="mb-4">
				<label for="marketMinRequiredShopScore" class="block text-sm font-medium mb-2">Min Required Shop Score</label>
				<input
					id="marketMinRequiredShopScore"
					type="number"
					name="minRequiredShopScore"
					bind:value={formData.minRequiredShopScore}
					class="themed-input w-full px-3 py-2"
				/>
			</div>

			<div class="mb-6">
				<div class="block text-sm font-medium mb-3">Shop Score Range</div>
				<div class="themed-box p-4">
					<div class="flex items-center gap-4 mb-4">
						<div class="flex-1">
							<label for="minShopScoreInput" class="text-xs text-primary-300 mb-1 block">Min Score</label>
							<input
								id="minShopScoreInput"
								type="number"
								min="0"
								max="1000"
								bind:value={formData.minShopScore}
								class="themed-input w-full px-3 py-2 text-center"
							/>
						</div>
						<span class="text-primary-400 mt-5">—</span>
						<div class="flex-1">
							<label for="maxShopScoreInput" class="text-xs text-primary-300 mb-1 block">Max Score</label>
							<input
								id="maxShopScoreInput"
								type="number"
								min={formData.minShopScore}
								max="10000"
								bind:value={formData.maxShopScore}
								class="themed-input w-full px-3 py-2 text-center"
							/>
						</div>
					</div>
					<div class="relative pt-4 pb-2">
						<div class="w-full h-3 bg-primary-800/50 rounded-full relative shadow-inner overflow-hidden">
							<div 
								class="absolute h-3 bg-hc-orange-500 rounded-full transition-all duration-200"
								style="left: {(Math.max(0, Math.min(10000, parseInt(formData.minShopScore))) / 10000) * 100}%; right: {100 - (Math.max(0, Math.min(10000, parseInt(formData.maxShopScore))) / 10000) * 100}%"
							></div>
						</div>
					</div>
				</div>
				<input type="hidden" name="minShopScore" value={formData.minShopScore} />
				<input type="hidden" name="maxShopScore" value={formData.maxShopScore} />
			</div>

			<div class="mb-6">
				<div class="block text-sm font-medium mb-3">Price Range</div>
				<div class="themed-box p-4">
					<div class="flex items-center gap-4 mb-4">
						<div class="flex-1">
							<label for="minPriceInput" class="text-xs text-primary-300 mb-1 block">Min Price</label>
							<input
								id="minPriceInput"
								type="number"
								min="0"
								max="10000"
								bind:value={formData.minPrice}
								class="themed-input w-full px-3 py-2 text-center"
							/>
						</div>
						<span class="text-primary-400 mt-5">—</span>
						<div class="flex-1">
							<label for="maxPriceInput" class="text-xs text-primary-300 mb-1 block">Max Price</label>
							<input
								id="maxPriceInput"
								type="number"
								min={formData.minPrice}
								max="10000"
								bind:value={formData.maxPrice}
								class="themed-input w-full px-3 py-2 text-center"
							/>
						</div>
					</div>
					<div class="relative pt-4 pb-2">
						<div class="w-full h-3 bg-primary-800/50 rounded-full relative shadow-inner overflow-hidden">
							<div 
								class="absolute h-3 bg-hc-orange-500 rounded-full transition-all duration-200"
								style="left: {(parseInt(formData.minPrice) / 10000) * 100}%; right: {100 - (parseInt(formData.maxPrice) / 10000) * 100}%"
							></div>
						</div>
					</div>
				</div>
				<input type="hidden" name="minPrice" value={formData.minPrice} />
				<input type="hidden" name="maxPrice" value={formData.maxPrice} />
			</div>

			<div class="mb-4">
				<label for="isPublic" class="flex items-center">
					<input
						id="isPublic"
						type="checkbox"
						name="isPublic"
						bind:checked={formData.isPublic}
						class="checkbox"
					/>
					<span class="text-sm font-medium ml-2">Public</span>
				</label>
			</div>

			<div class="flex gap-2">
				<button type="submit" class="button primary md">Save</button>
				<button type="button" onclick={closeForm} class="button dark-red md">Cancel</button>
			</div>
		</form>
	</div>
{/if}

<div class="flex flex-col gap-8">
	<section>
		<h2 class="text-xl font-hc font-bold mb-3">Public</h2>
		{#if publicItems.length === 0}
			<p class="text-sm text-primary-300">No public items yet.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each publicItems as item (item.id)}
					<div class="themed-box p-4">
					<div class="aspect-square rounded-lg overflow-hidden mb-3 bg-primary-800/10">
						<img src={item.image} alt={item.name} class="w-full h-full object-contain object-center" />
					</div>
						<h3 class="text-lg font-hc font-bold mb-2">{item.name}</h3>
						<p class="text-sm text-primary-300 mb-2">{item.description}</p>
						<p class="text-sm text-primary-200 mb-1">Price: {item.minPrice} - {item.maxPrice}</p>
						<p class="text-sm text-primary-200 mb-2">Score: {item.minShopScore} - {item.maxShopScore}</p>

						<div class="flex gap-2">
							<button onclick={() => openEditForm(item)} class="button primary md flex-1">Edit</button>
							<form method="POST" action="?/delete" class="flex-1">
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class="button red md w-full">Delete</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section>
		<h2 class="text-xl font-hc font-bold mb-3">Drafts</h2>
		{#if draftItems.length === 0}
			<p class="text-sm text-primary-300">No drafts yet.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each draftItems as item (item.id)}
					<div class="themed-box p-4">
					<div class="aspect-square rounded-lg overflow-hidden mb-3 bg-primary-800/10">
						<img src={item.image} alt={item.name} class="w-full h-full object-contain object-center" />
					</div>
						<h3 class="text-lg font-hc font-bold mb-2">{item.name}</h3>
						<p class="text-sm text-primary-300 mb-2">{item.description}</p>
						<p class="text-sm text-primary-200 mb-1">Price: {item.minPrice} - {item.maxPrice}</p>
						<p class="text-sm text-primary-200 mb-2">Score: {item.minShopScore} - {item.maxShopScore}</p>
						<p class="text-xs font-semibold text-primary-400 mb-3">Draft (not public)</p>

						<div class="flex gap-2">
							<button onclick={() => openEditForm(item)} class="button primary md flex-1">Edit</button>
							<form method="POST" action="?/delete" class="flex-1">
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class="button red md w-full">Delete</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
