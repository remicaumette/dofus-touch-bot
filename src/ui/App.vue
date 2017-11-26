<style>
    body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        font-weight: 200;
        background: #EEE;
    }
</style>

<template>
    <div>
        <p v-text="this.window.client.state"></p>
        <router-view/>
    </div>
</template>

<script>

</script>
