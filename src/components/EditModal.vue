<template>
  <div v-if="showModal" class="modal-mask">
    <div class="detail-form edit-modal">
      <h3>Edit modal</h3>
      <label>Name</label>
      <input v-model="detail.name" placeholder="name" />
      <label v-if="child">Price</label>
      <input v-if="child" v-model.number="detail.price" placeholder="price" />
      <label>Amount</label>
      <input v-model.number="detail.amount" placeholder="amount" />
      <BButtonGroup>
        <BButton variant="success" @click="update">Apply</BButton>
        <BButton variant="danger" @click="close">Discard</BButton>
      </BButtonGroup>
    </div>
  </div>
</template>

<script lang="ts">
import Detail from "@/types/Detail";

interface Data {
  detail: Detail;
}
export default {
  data() {
    const data: Data = {
      detail: {
        id: 0,
        name: "",
        price: 0,
        amount: 0,
        subdetails: null,
      },
    };
    return data;
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    child: {
      type: Boolean,
      required: true,
    },
    pId: {
      type: Number,
      required: true,
    },
    pName: {
      type: String,
      required: true,
    },
    pAmount: {
      type: Number,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
  },
  methods: {
    addDetail() {
      this.detail.id = Date.now();
      this.$emit("addDetail", this.detail);
    },
    close() {
      this.$emit("close");
    },
    update() {
      this.$emit("update", this.detail);
    },
  },
  mounted() {
    this.detail.id = this.pId;
    this.detail.name = this.pName;
    this.detail.amount = this.pAmount;
    this.detail.price = this.pPrice;
  },
  watch: {
    pId: function (value) {
      this.detail.id = value;
    },
    pName: function (value) {
      this.detail.name = value;
    },
    pAmount: function (value) {
      this.detail.amount = value;
    },
    pPrice: function (value) {
      this.detail.price = value;
    },
  },
};
</script>

<style scoped>
.detail-form {
  background-color: #4c4c6d;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 300px;
  padding: 1em;
  justify-content: space-around;
  border: 2px solid #1b9c85;
}

input {
  margin-bottom: 1em;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
</style>
