<script lang="ts">
	import { enhance } from '$app/forms';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
	import Head from '$lib/components/Head.svelte';
	import Project from '$lib/components/Project.svelte';
	import type { PageProps } from './$types';
	import { Ship, SquarePen } from '@lucide/svelte';

	let { data, form }: PageProps = $props();

	let formPending = $state(false);

	let printablesUrl = $state(form?.fields?.url ?? data.project.url);
</script>

<Head title="Ship project" />

<h1 class="mt-5 mb-3 font-hero text-2xl font-medium">Ship project</h1>
<Project
	id={data.project.id}
	name={data.project.name}
	description={data.project.description}
	url={data.project.url}
	timeSpent={data.project.timeSpent}
	createdAt={data.project.createdAt}
	status={data.project.status}
	clickable={false}
/>
<div class="mt-3 flex flex-row">
	<a href="edit" class="button sm primary">
		<SquarePen />
		Edit
	</a>
</div>

<form
	method="POST"
	class="mt-2 flex flex-col gap-1"
	use:enhance={() => {
		formPending = true;
		return async ({ update }) => {
			await update();
			formPending = false;
		};
	}}
>
	<div>
		<label class="flex flex-col gap-1">
			Printables URL
			<input
				type="text"
				name="url"
				placeholder="A link to your design"
				bind:value={printablesUrl}
				class="themed-box ring-primary-900 placeholder:text-primary-900 active:ring-3"
			/>
		</label>
		{#if form?.invalid_url}
			<p class="text-sm">Invalid URL</p>
		{/if}
	</div>

	<div class="mt-2">
		<h2 class="text-xl font-bold">Requirements</h2>
		<ChecklistItem completed={data.project.timeSpent >= 120}
			>At least 120 minutes spent</ChecklistItem
		>
		<ChecklistItem completed={data.project.description != ''}>
			Project has a description
		</ChecklistItem>
		<ChecklistItem completed={printablesUrl}>Project has a Printables URL</ChecklistItem>

		<p class="mt-1">
			Make sure that your project has a license that <span class="font-bold">allows remixes</span>
			and <span class="font-bold">meets the open definition</span> or Orpheus will come after you with
			a stick. I'd recommend using CC-BY-SA!
		</p>
		<div class="mt-2">
			{#if data.project.timeSpent >= 120 && data.project.description != '' && data.project.url != ''}
				<p class="text-primary-300">
					Are you sure you want to ship "{data.project.name}"?
					<span class="font-bold">You won't be able to edit it or journal again</span> unless it gets
					rejected.
				</p>
			{/if}
		</div>
	</div>
	<div class="flex flex-row gap-2">
		<div>
			<a href="./" class="button sm primary">Cancel</a>
		</div>
		<button
			class="button sm orange"
			disabled={formPending || data.project.timeSpent < 120 || data.project.description == ''}
		>
			<Ship />
			Ship
		</button>
	</div>
</form>
