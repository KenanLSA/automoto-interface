<script setup lang="ts">
import { api } from '@/api/api';
import TransactionCard from '@/components/transactions/transaction-card.vue';
import TransactionDetailsDialog from '@/components/transactions/transaction-details-dialog.vue';
import TransactionForm from '@/components/transactions/transaction-form.vue';
import Heading from '@/components/ui/heading/heading.vue';
import type { Transaction } from '@/types/transactions.types';

import { onMounted, ref, watch } from 'vue';

const transactions = ref<Transaction[]>([])

const loadTransactions = async () => {
    transactions.value = (await api.get('/transactions')).data
}

// Manage transaction selection

const showDetails = ref<boolean>(false)

watch(showDetails, (state) => {
    if (!state) selectedTransaction.value = null
}, { immediate: false })

const selectedTransaction = ref<Transaction | null>(null)

const selectTransaction = (transaction: Transaction) => {
    selectedTransaction.value = selectedTransaction.value === transaction ? null : transaction
    showDetails.value = true
}

onMounted(loadTransactions)

</script>

<template>
    <div class="flex justify-between items-center">
        <Heading title="Transactions" />
        <TransactionForm @refresh="loadTransactions" />
    </div>

    <div class="h-8"></div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <TransactionCard v-for="transaction in transactions" :key="transaction.id" :transaction
            @click="selectTransaction(transaction)" />
    </div>

    <TransactionDetailsDialog :transaction="selectedTransaction" v-model:open="showDetails" />

</template>