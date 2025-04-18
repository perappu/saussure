<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}</h1>
{page.error?.message}