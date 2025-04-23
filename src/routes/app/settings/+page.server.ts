import { s3Test } from "$lib/backends/s3.svelte";

export async function load() {
    return { test : s3Test() };
  }