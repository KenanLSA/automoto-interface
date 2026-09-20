<script setup lang="ts">
import { api } from '@/api/api'
import type { Product } from '@/types/products.types'
import { onMounted, reactive, ref } from 'vue'

import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';

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

const products = ref<Product[]>([])

const loadProducts = async () => {
    products.value = (await api.get('/products')).data
}

const payload = ref<{
    customerName: string,
    transactionItems: {
        itemId: number,
        name: string,
        unitCost: number,
        unitPrice: number,
        quantity: number
    }[]
}>({
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
}

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
</script>

<template>

    <form class=" w-4/5 max-w-96 aspect-5/4" @submit.prevent="handleSave">
        <Input v-model="transactionForm.customerName" name="customerName" placeholder="e.g. John Doe" />

        <template v-for="(item, idx) in transactionForm.transactionItems" :key="item.itemId">
            <div class="w-full flex flex-col">
                <select v-model="transactionForm.transactionItems[idx]!.itemId">
                    <option value="0">Select a product</option>
                    <option v-for="(product) in products" :key="product.id" :value="product.id">
                        {{ product.name }}
                    </option>
                </select>
                <div class="flex gap-2">
                    <input type="number" class="flex-1" v-model="transactionForm.transactionItems[idx]!.quantity" />

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

        <Button type="submit">Save</Button>
    </form>
</template>