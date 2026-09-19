<template>
    <div class="w-full h-dvh relative *:w-full grid grid-cols-1 grid-rows-[4rem_auto]">
        <header class="drop-shadow-xl drop-shadow-gray-100 bg-white flex items-center justify-between px-8">
            <RouterLink to="/" class="uppercase font-semibold">Automoto Gear</RouterLink>

            <nav class="*:hover:underline space-x-4 text-sm">
                <RouterLink to="/products">Products</RouterLink>
                <RouterLink to="/transactions">Transactions</RouterLink>
            </nav>
        </header>

        <div class="w-full pt-12 px-8">
            <RouterView />
        </div>
    </div>
</template>