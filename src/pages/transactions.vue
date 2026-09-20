<script setup lang="ts">
import { api } from '@/api/api';
import TransactionCard from '@/components/transactions/transaction-card.vue';
import TransactionForm from '@/components/transactions/transaction-form.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import Heading from '@/components/ui/heading/heading.vue';
import type { Transaction } from '@/types/transactions.types';
import { calculateSubtotal } from '@/utils/calculators';
import { formatDate } from '@/utils/formatters';
import { onMounted, ref, watch } from 'vue';

const transactions = ref<Transaction[]>([])

const loadTransactions = async () => {
    transactions.value = (await api.get('/transactions')).data
}

const open = ref<boolean>(false)

watch(open, (state) => {
    if (!state) selectedTransaction.value = null
}, { immediate: false })

const selectedTransaction = ref<Transaction | null>(null)

const selectTransaction = (transaction: Transaction) => {
    selectedTransaction.value = selectedTransaction.value === transaction ? null : transaction
    open.value = true
}

onMounted(loadTransactions)

</script>

<template>
    <Heading title="Transactions" />

    <div class="h-8"></div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <TransactionCard v-for="transaction in transactions" :key="transaction.id" :transaction
            @click="selectTransaction(transaction)" />
    </div>

    <Dialog v-model:open="open">
        <DialogContent v-if="selectedTransaction" class="bg-white border-none">
            <DialogHeader>
                <DialogTitle>{{ selectedTransaction.customerName }}</DialogTitle>
                <DialogDescription v-if="selectedTransaction?.date">
                    {{ formatDate(selectedTransaction.date) }}
                </DialogDescription>
            </DialogHeader>

            <ul>
                <li v-for="(item, idx) in selectedTransaction.items"
                    :key="`${selectedTransaction.id}-${item.itemId}-${idx}`">
                    {{ `${item.name}(${item.quantity}) - Rs ${item.unitPrice * item.quantity}` }}
                </li>
            </ul>

            <p>Subtotal: Rs {{ calculateSubtotal(selectedTransaction.items) }}</p>
        </DialogContent>
    </Dialog>

    <!-- <TransactionForm /> -->

</template>