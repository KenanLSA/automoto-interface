<script setup lang="ts">
import { api } from '@/api/api';
import Heading from '@/components/ui/heading/heading.vue';

import Label from '@/components/ui/label/Label.vue';
import useAuthStore from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, Form, useField } from 'vee-validate';

const route = useRoute()
const router = useRouter()

const loginSchema = toTypedSchema(
    z.object({
        username: z.string({ message: 'This field cannot be empty' })
            .min(1, { message: 'Too short' })
            .nonempty({ message: 'This field cannot be empty' }),
        password: z.string({ message: 'This field cannot be empty' })
            .min(8, { message: 'Too short' })
            .nonempty({ message: 'This field cannot be empty' })
    })
)

const invalidCredentials = ref<boolean>(false)

const handleLogin = async (values: any) => {
    const authStore = useAuthStore()
    const { accessToken } = storeToRefs(authStore)

    const { data } = await api.post('/auth/login', values);

    if (!data.accessToken) {
        invalidCredentials.value = true
        return
    }

    accessToken.value = data.accessToken

    if (route.query._next) router.replace(String(route.query._next))
    else router.push('/')
}
</script>

<template>
    <div class="w-full h-dvh flex items-center justify-center">
        <Form @submit="handleLogin" :validation-schema="loginSchema"
            class=" w-4/5 max-w-96 aspect-5/4 flex flex-col items-center justify-between">
            <Heading title="Log into your account" />

            <div class="w-full space-y-4">
                <div class="form-group">
                    <Label>Username</Label>
                    <Field name="username" type="text" placeholder="john.doe" />
                    <ErrorMessage name="username" />
                </div>

                <div class="form-group">
                    <Label>Password</Label>
                    <Field name="password" type="password" placeholder="********" />
                    <ErrorMessage name="password" />
                </div>
            </div>

            <p v-if="invalidCredentials">Invalid Credentials</p>

            <button class="w-full" type="submit">Login</button>
        </Form>
    </div>
</template>