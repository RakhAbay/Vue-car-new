<template>
    <div class='container detail-list'>
        <div class='row'>
            <div class='col'>
                Number
            </div>
            <div class='col'>
                Name
            </div>
            <div class='col'>
                Price
            </div>
            <div class='col'>
                Amount
            </div>
            <div class='col'>
                total
            </div>
            <div class='col'>
                Actions
            </div>
        </div>
        <TransitionGroup name="detail-list">
            <DetailItem @select='setSelectedDetailId' @addAmount='addAmount' @removeAmount='removeAmount'
                v-for='detail in details' :detail='detail' :selectedDetailId='selectedDetailId' :key="detail.id" />
        </TransitionGroup>
    </div>
</template>

<script lang='ts'>
import Detail from '@/types/Detail'
import { PropType } from 'vue'
import { BButtonGroup, BButton } from 'bootstrap-vue-next'
import DetailItem from '@/components/DetailItem.vue'

export default {
    components: {
        BButtonGroup,
        BButton,
        DetailItem
    },
    props: {
        details: {
            type: Object as PropType<Array<Detail>>,
            required: true
        },
        selectedDetailId: {
            type: Number
        }
    },
    methods: {
        setSelectedDetailId(id: number) {
            this.$emit('select', id)
        },
        addAmount(id: number) {
            this.$emit('addAmount', id)
        },
        removeAmount(id: number) {
            this.$emit('removeAmount', id)
        }
    }
}
</script>

<style scoped>
.detail-list {
    background-color: #E8F6EF;
    border: 2px solid black;
    border-top: 1px solid #1B9C85;
}

.row {
    margin: 1em 0 1em 0;
    border: 1px solid black;
    padding: 1em;
}

.detail-list-leave-active {
  transition: all 0.5s ease;
}
.detail-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
