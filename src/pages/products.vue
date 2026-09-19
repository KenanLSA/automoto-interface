<script setup lang="ts">
import { api } from '@/api/api';
import ProductsFormDialog from '@/components/products/products-form-dialog.vue';
import ProductsTable from '@/components/products/products-table.vue';
import Heading from '@/components/ui/heading/heading.vue';
import type { Product } from '@/types/products.types';
import { onMounted, ref } from 'vue';

const products = ref<Product[]>([])
const loading = ref<boolean>(true)

const load = async () => {
    try {
        const response = await api.get('/products')

        products.value = response.data
    } catch (e: any) {
        console.log(e)
    } finally {
        loading.value = false
    }

}
onMounted(load)
</script>

<template>
    <div class="flex justify-between items-center">
        <Heading title="Products" />
        <ProductsFormDialog @saved="load" />
    </div>

    <div class="h-8"></div>

    <div v-if="loading">
        <p>Loading Products...</p>
    </div>
    <ProductsTable v-else :products />
</template>