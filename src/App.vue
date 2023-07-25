<template>
  <div class='app'>
    <h4 class='help'>*Click on a row to (un)select it</h4>
    <DetailForm @addDetail='addDetail' />
    <DetailList :details='flatDetails' :selectedDetailId='selectedDetailId' @select='setSelectedDetailId'
      @addAmount='addAmount' @removeAmount='removeAmount' @edit="edit" />
    <div class='download-button download-button--spacing'>
      <BButton variant='success'>
        <download-excel :data='flatDetails' :fields='{
          Number: "number",
          Name: "name",
          Price: "price",
          Amount: "amount",
          "Total Cost": {
            callback: (value: any) => {
              return value.amount * value.price
            }
          }
        }'>
          Download
        </download-excel>
      </BButton>
    </div>
    <EditModal :child="child" :show-modal="showModal" :p-id="pid" :p-name="pname" :p-price="pprice" :p-amount="pamount" @close="showModal = false" @update="update" />
  </div>
</template>

<script lang='ts'>
import Detail from '@/types/Detail'
import DetailList from '@/components/DetailList.vue'
import DetailForm from '@/components/DetailForm.vue'
import EditModal from '@/components/EditModal.vue'

interface Data {
  details: Array<Detail>,
  name: string,
  price: number,
  amount: number,
  selectedDetailId: number,
  showModal: boolean,
  pid: number,
  pname: string,
  pprice: number,
  pamount: number,
  child: boolean
}

export default {
  components: {
    DetailList,
    DetailForm,
    EditModal
  },
  data() {
    const data: Data = {
      details: [
        {
          id: 1,
          name: 'Body',
          price: 0,
          amount: 1,
          subdetails: [
            {
              id: 2,
              name: 'Door',
              price: 0,
              amount: 3,
              subdetails: [
                {
                  id: 3,
                  name: 'Locker',
                  price: 5000,
                  amount: 4,
                  subdetails: null
                },
                {
                  id: 4,
                  name: 'Hand',
                  price: 6000,
                  amount: 6,
                  subdetails: null
                }
              ]
            }
          ]
        },
        {
          id: 5,
          name: 'Engine',
          price: 0,
          amount: 1,
          subdetails: [
            {
              id: 6,
              name: 'Piston',
              price: 10000,
              amount: 5,
              subdetails: null
            },
            {
              id: 7,
              name: 'Ring',
              price: 2000,
              amount: 3,
              subdetails: null
            }
          ]
        }
      ],
      name: '',
      price: 0,
      amount: 0,
      selectedDetailId: 0,
      showModal: false,
      pid: 0,
      pname: '',
      pprice: 0,
      pamount: 0,
      child: false
    }
    return data
  },
  methods: {
    addDetail(detail: Detail) {
      if (this.selectedDetailId === 0) {
        this.details.push(JSON.parse(JSON.stringify(detail)))
        return
      }
      const addDetailToSelected = (arr: Array<Detail>) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === this.selectedDetailId) {
            if (arr[i].subdetails === null) {
              arr[i].subdetails = []
            }
            arr[i].subdetails?.push(JSON.parse(JSON.stringify(detail)))
            return
          } else if (arr[i].subdetails !== null) {
            addDetailToSelected(arr[i].subdetails!)
          }
        }
      }
      addDetailToSelected(this.details)
    },
    addAmount(id: number) {
      const incrementAmount = (arr: Array<Detail>) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            arr[i].amount++
            return
          } else if (arr[i].subdetails !== null) {
            incrementAmount(arr[i].subdetails!)
          }
        }
      }
      incrementAmount(this.details)
    },
    removeAmount(id: number) {
      const decrementAmount = (arr: Array<Detail>) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            arr[i].amount--
            if (arr[i].amount <= 0) {
              arr.splice(i, 1)
            }
            return
          } else if (arr[i].subdetails !== null) {
            decrementAmount(arr[i].subdetails!)
          }
        }
      }
      decrementAmount(this.details)
    },
    setSelectedDetailId(id: number) {
      if (this.selectedDetailId === id) {
        this.selectedDetailId = 0
      } else {
        this.selectedDetailId = id
      }
    },
    edit(id: number, name: string, price: number, amount: number, child: boolean) {
      this.showModal = true
      this.pid = id
      this.pname = name
      this.pprice = price
      this.pamount = amount
      this.child = child
    },
    update(detail: Detail) {
      const updateDetail = (arr: Array<Detail>) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === detail.id) {
            arr[i].name = detail.name
            arr[i].amount = detail.amount
            arr[i].price = detail.price
            return
          } else if (arr[i].subdetails !== null) {
            updateDetail(arr[i].subdetails!)
          }
        }
      }
      updateDetail(this.details)
      this.showModal = false
      this.priceBeenUpdated = true
    },
    offloadToExcel() {
      console.log('Offloading...')
    }
  },
  computed: {
    flatDetails(): Array<Detail> {
      let detailsCopy = JSON.parse(JSON.stringify(this.details))

      const flattenDetailsArray = (arr: Array<Detail>, number: string, isRoot: boolean): Array<Detail> => {
        let newArr: Array<Detail> = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].subdetails !== null) {
            let temp
            if (isRoot) {
              temp = flattenDetailsArray(arr[i].subdetails!, (i + 1).toString(), false)
              arr[i].number = (i + 1).toString()
            } else {
              temp = flattenDetailsArray(arr[i].subdetails!, number + '.' + (i + 1), false)
              arr[i].number = number + '.' + (i + 1)
            }
              // summing up price to parent detail from child details
              arr[i].price = 0
              for (let j = 0; j < temp.length; j++) {
                // if a child detail is a direct child to the parent detail 
                if (temp[j].number?.length === (arr[i].number?.length! + 2)) {
                  arr[i].price += temp[j].price
              }
            }
            newArr.push(arr[i])
            newArr = newArr.concat(temp)
          } else {
            arr[i].number = number + '.' + (i + 1)
            if (isRoot) {
              arr[i].number = (i + 1).toString()
            }
            newArr.push(JSON.parse(JSON.stringify(arr[i])))
          }
        }

        return newArr
      }

      return flattenDetailsArray(detailsCopy, '', true)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  padding: 2em;
  background-color: #FFE194;
  min-height: 100vh;
  height: 100%;
}

.download-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.download-button--spacing {
  margin-top: 1em;
}

.help {
  text-align: center;
}
</style>
