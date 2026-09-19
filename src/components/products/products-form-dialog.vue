<script setup lang="ts">
import { api } from '@/api/api'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toTypedSchema } from '@vee-validate/zod'
import { Field, Form } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

const emits = defineEmits(['saved'])

const productSchema = toTypedSchema(
    z.object({
        name: z.string().nonempty(),
        unitCost: z.number().nonnegative(),
        unitPrice: z.number().nonnegative(),
        inStock: z.number().nonnegative()
    })
)

const open = ref<boolean>(false)

const handleSave = async (values: any) => {
    try {
        await api.post('/products', values)
        emits('saved')
        open.value = false
    } catch (e: any) {
        console.log(e)
    }
}

</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger as-child>
            <Button>Add New Product</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-106.25 bg-white text-slate-950">
            <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                    Fill in the product details below. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <!-- Form container with proper vertical spacing -->
            <Form @submit="handleSave" :validation-schema="productSchema" class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Field name="name" id="name" type="text" placeholder="e.g. Wiper 150" />
                </div>

                <div class="grid gap-2">
                    <Label for="cost">Buying Price(Rs)</Label>
                    <Field name="unitCost" id="cost" type="number" placeholder="200" />
                </div>

                <div class="grid gap-2">
                    <Label for="price">Selling Price(Rs)</Label>
                    <Field name="unitPrice" id="price" type="number" placeholder="0.00" />
                </div>

                <div class="grid gap-2">
                    <Label for="stock">In Stock</Label>
                    <Field name="inStock" id="stock" type="number" placeholder="5" />
                </div>

                <DialogFooter>
                    <DialogClose as-child>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    </Dialog>
</template>s