<script lang="ts">
	let { version } = $props();
</script>

<footer
	class="flex w-full flex-col items-center justify-center px-10 pt-5 pb-3 md:mt-8 lg:mt-8"
>
	<div class="">
		<p class="text-center">
			A <a href="https://hackclub.com" class="underline">Hack Club</a> program. Made by teens, for teens!
		</p>
		<p class="text-center text-xs mt-1">
			v{version}
		</p>
	</div>
</footer>
