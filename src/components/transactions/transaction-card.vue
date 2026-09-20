<script setup lang="ts">
import type { Transaction } from '@/types/transactions.types';
import { calculateSubtotal } from '@/utils/calculators';
import { formatDate } from '@/utils/formatters';

defineProps<{
    transaction: Transaction
}>()
</script>

<template>
    <div
        class="flex bg-white hover:bg-gray-50/50 active:bg-gray-100 hover:scale-102 cursor-pointer transition-scale duration-300 drop-shadow-lg drop-shadow-indigo-50 border border-gray-100 rounded-xl px-4 py-6 aspect-4/1 items-center">
        <div class="flex flex-col flex-1">
            <p class="font-semibold">{{ transaction.customerName }}</p>
            <p class="text-gray-400 text-xs italic">{{ formatDate(transaction.date) }}</p>
        </div>
        <p class="text-primary">Rs {{ calculateSubtotal(transaction.items) }}</p>
    </div>
</template>