<template>
  <div class='app'>
    <h4 class='help'>*Click on a row to (un)select it</h4>
    <DetailForm @addDetail='addDetail' />
    <DetailList :details='flatDetails' :selectedDetailId='selectedDetailId' @select='setSelectedDetailId'
      @addAmount='addAmount' @removeAmount='removeAmount' />
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
  </div>
</template>

<script lang='ts'>
import Detail from '@/types/Detail'
import DetailList from '@/components/DetailList.vue'
import DetailForm from '@/components/DetailForm.vue'

interface Data {
  details: Array<Detail>,
  name: string,
  price: number,
  amount: number,
  selectedDetailId: number
}

export default {
  components: {
    DetailList,
    DetailForm
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
      selectedDetailId: 0
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
