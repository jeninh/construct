<script lang="ts">
	import Head from '$lib/components/Head.svelte';

	let { data } = $props();
</script>

<Head title="Admin" />

<div class="flex h-full flex-col">
	<h1 class="mt-5 mb-3 font-hero text-3xl font-medium">Admin</h1>

	<a href="/dashboard/admin/admin/users" class="underline">Users</a>
</div>
