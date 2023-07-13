interface Detail {
    id: number,
    number?: string
    name: string,
    price: number,
    amount: number,
    subdetails: Array<Detail> | null
}

export default Detail
