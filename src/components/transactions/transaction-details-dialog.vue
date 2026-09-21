<script setup lang="ts">
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import type { Transaction } from '@/types/transactions.types';
import { calculateSubtotal } from '@/utils/calculators';
import { formatDate } from '@/utils/formatters';

defineProps<{
    transaction: Transaction | null
}>()

</script>

<template>
    <Dialog>
        <DialogContent v-if="transaction" class="bg-white border-none">
            <DialogHeader>
                <DialogTitle>{{ transaction.customerName }}</DialogTitle>
                <DialogDescription v-if="transaction?.date">
                    {{ formatDate(transaction.date) }}
                </DialogDescription>
            </DialogHeader>

            <ul>
                <li v-for="(item, idx) in transaction.items" :key="`${transaction.id}-${item.itemId}-${idx}`">
                    {{ `${item.name}(${item.quantity}) - Rs ${item.unitPrice * item.quantity}` }}
                </li>
            </ul>

            <p>Subtotal: Rs {{ calculateSubtotal(transaction.items) }}</p>
        </DialogContent>
    </Dialog>
</template>