<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<template>
    <h1 class="uppercase font-semibold text-xl">
        {{ title }}
    </h1>
</template>