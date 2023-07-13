<template>
    <div class='container detail-form'>
        <BButton variant='success' @click="addDetail">Add detail</BButton>
        <input v-model="detail.name" placeholder='name'>
        <input v-model.number="detail.price" placeholder='price'>
        <input v-model.number="detail.amount" placeholder='amount'>
    </div>
</template>

<script lang='ts'>
import Detail from '@/types/Detail'

interface Data {
  detail: Detail
}
export default {
    data() {
        const data: Data = {
            detail: {
                id: 0,
                name: '',
                price: 0,
                amount: 0,
                subdetails: null
            }
        }
        return data
    },
    methods: {
        addDetail() {
            this.detail.id = Date.now()
            this.$emit('addDetail', this.detail)
        }
    }
}
</script>

<style scoped>
.detail-form {
    background-color: #4C4C6D;
    display: flex;
    padding: 1em;
    justify-content: space-around;
    border: 2px solid #1B9C85; 
}

@media only screen and (max-width: 770px) {
    .detail-form {
        flex-direction: column;
    }
    input {
        margin-top: 1em;
    }
}
</style>