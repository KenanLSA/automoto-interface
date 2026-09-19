<script setup lang="ts">
import type { Product } from '@/types/products.types';
import Table from '../ui/table/Table.vue';
import TableHeader from '../ui/table/TableHeader.vue';
import TableRow from '../ui/table/TableRow.vue';
import TableHead from '../ui/table/TableHead.vue';
import TableBody from '../ui/table/TableBody.vue';
import TableCell from '../ui/table/TableCell.vue';

defineProps<{
    products: Product[]
}>()
</script>

<template>
    <div v-if="products.length === 0">
        No Products To Display
    </div>
    <Table v-else>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit Cost(BP)</TableHead>
                <TableHead>Unit Price(SP)</TableHead>
                <TableHead>In Stock</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="product in products" :key="product.id">
                <TableCell>{{ product.name }}</TableCell>
                <TableCell>{{ product.unitCost }}</TableCell>
                <TableCell>{{ product.unitPrice }}</TableCell>
                <TableCell>{{ product.inStock }}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>