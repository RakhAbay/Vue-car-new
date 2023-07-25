<template>
    <div :class="{'selected': selectedDetailId === detail.id}" class='row' @click="setSelectedDetailId">
        <div class='col'>
            {{ detail.number }}
        </div>
        <div class='col'>
            {{ detail.name }}
        </div>
        <div class='col'>
            {{ detail.price }}
        </div>
        <div class='col'>
            {{ detail.amount }}
        </div>
        <div class='col'>
            {{ detail.price * detail.amount }}
        </div>
        <div class='col'>
            <BButtonGroup>
                <BButton variant='success' @click.stop="addAmount">Add</BButton>
                <BButton variant='danger' @click.stop="removeAmount">Remove</BButton>
                <BButton variant='dark' @click.stop="edit">Edit</BButton>
            </BButtonGroup>
        </div>
    </div>
</template>

<script lang='ts'>
import Detail from '@/types/Detail'
import { PropType } from 'vue'
import { BButtonGroup, BButton } from 'bootstrap-vue-next'

export default {
    components: {
        BButtonGroup,
        BButton
    },
    props: {
        detail: {
            type: Object as PropType<Detail>,
            required: true
        },
        selectedDetailId: {
            type: Number
        }
    },
    methods: {
        setSelectedDetailId() {
            this.$emit('select', this.detail.id)
        },
        addAmount() {
            this.$emit('addAmount', this.detail.id)
        },
        removeAmount() {
            this.$emit('removeAmount', this.detail.id)
        },
        edit() {
            let child = false
            if (this.detail.subdetails === null) {
                child = true
            }
            this.$emit('edit', this.detail.id, this.detail.name, this.detail.price, this.detail.amount, child)
        }
    }
}
</script>

<style scoped>
.row {
    margin: 1em 0 1em 0;
    border: 1px solid black;
    padding: 1em;
}
.selected {
    background-color: #1B9C85;
}
</style>
