<script setup lang="ts">
import { api } from '@/api/api'
import type { Product } from '@/types/products.types'
import { onMounted, reactive, ref, watch } from 'vue'

import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import Select from '../ui/select/Select.vue';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';
import type { Transaction } from '@/types/transactions.types.ts';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogFooter from '../ui/dialog/DialogFooter.vue';
import DialogClose from '../ui/dialog/DialogClose.vue';
import Label from '../ui/label/Label.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';

const emits = defineEmits(['refresh'])

const transactionForm = reactive<{
    customerName: string,
    transactionItems: {
        itemId: number,
        quantity: number,
        errorMessage: string[]
    }[]
}>({
    customerName: '',
    transactionItems: []
})

const initializeForm = () => {
    transactionForm.customerName = '';
    transactionForm.transactionItems = []
}

const products = ref<Product[]>([])

const loadProducts = async () => {
    products.value = (await api.get('/products')).data
}

type RenameProperty<T, OldKey extends keyof T, NewKey extends string> = {
    [K in keyof T as K extends OldKey ? NewKey : K]: T[K];
};

type TransactionPayload = RenameProperty<Omit<Transaction, 'id' | 'date'>, 'items', 'transactionItems'>

const payload = ref<TransactionPayload>({
    customerName: '',
    transactionItems: []
})

const generatePayload = () => {
    payload.value.customerName = transactionForm.customerName
    payload.value.transactionItems = transactionForm.transactionItems.map(item => {
        const product = products.value.find(p => p.id === item.itemId)

        return {
            itemId: item.itemId,
            name: product!.name,
            unitCost: product!.unitCost,
            unitPrice: product!.unitPrice,
            quantity: item.quantity
        }
    })
}

onMounted(loadProducts)

const validateForm = (): boolean => {
    let isValid: boolean = true

    for (let item of transactionForm.transactionItems) {
        item.errorMessage = []

        if (item.itemId === 0) {
            item.errorMessage.push('No product selected')
            continue
        }

        const product = products.value.find(p => p.id === item.itemId)

        if (item.quantity > product!.inStock) {
            item.errorMessage.push('Quantity cannot be greater than amount in stock')
            isValid = false
        }
        if (item.quantity < 0) {
            item.errorMessage.push('Quantity cannot be less than 1')
            isValid = false
        }
    }

    return isValid
}

const handleSave = async () => {
    const isValid = validateForm()

    if (!isValid) return

    generatePayload()

    await api.post('/transactions', payload.value)
    emits('refresh')
    initializeForm()
}

// Transaction items
const addItem = () => {
    transactionForm.transactionItems.push({
        itemId: 0,
        quantity: 1,
        errorMessage: []
    })
}
const remove = (index: number) => {
    transactionForm.transactionItems = transactionForm.transactionItems.filter((_, idx) => idx !== index)
}

const open = ref<boolean>(false)
watch(open, (state) => {
    if (!state) {
        initializeForm()
    }
})
</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <Button>New Transaction</Button>
        </DialogTrigger>

        <DialogContent class="bg-white border-none">
            <DialogHeader>
                <DialogTitle>Add a new Transaction</DialogTitle>
            </DialogHeader>
            <form class="space-y-6" @submit.prevent="handleSave">
                <div class="form-group">
                    <Label>Customer Name</Label>
                    <Input v-model="transactionForm.customerName" name="customerName" placeholder="e.g. John Doe" />
                </div>

                <template v-for="(item, idx) in transactionForm.transactionItems" :key="item.itemId">
                    <div class="w-full flex flex-col gap-2">
                        <Select v-model:model-value="transactionForm.transactionItems[idx]!.itemId">
                            <SelectTrigger class="border-gray-300">
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent class="bg-white border-none drop-shadow-lg drop-shadow-indigo-100">
                                <SelectItem v-for="(product) in products" :key="product.id" :value="product.id"
                                    class="hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed"
                                    :disabled="product.inStock === 0">
                                    <span :class="product.inStock === 0 ? 'text-red-400' : ''">
                                        {{ `${product.name} (in stock: ${product.inStock})` }}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div class="flex gap-2">
                            <input type="number" class="flex-1"
                                v-model="transactionForm.transactionItems[idx]!.quantity" />
                            <Button type="button" @click="remove(idx)">Remove</Button>
                        </div>
                    </div>

                    <ul>
                        <li v-for="(message, idx2) in transactionForm.transactionItems[idx]!.errorMessage"
                            :key="`${message}-${idx}-${idx2}`">
                            {{ message }}
                        </li>
                    </ul>

                </template>

                <Button variant="outline" type="button" @click="addItem">Add Item</Button>
            </form>

            <DialogFooter>
                <DialogClose as-child><Button variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

</template>