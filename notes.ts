/* eslint-disable antfu/top-level-function */
/* eslint-disable no-console */

// 1. it's when i pass a type to another type
type MyGenericType<TData> = {
  data: TData
}

type Example1 = MyGenericType<{
  firstName: string
}>

type Example2 = MyGenericType<number>

// 2. can be use in fetch
function makeFetch<TData1>(url: string): Promise<TData1> {
  return fetch(url).then(res => res.json() as TData1)
}

makeFetch<{ firstName: string, lastName: string }>('app').then((res) => {
  console.log(res.firstName)
})

// 3. can be use to extend standard libraries
const set = new Set<number>()
set.add(1)

// @ts-expect-error
set.add('Hi')

// 4. you don't always need to pass the types to a generic function. Same for the response
const addIdToObject = <TObj>(obj: TObj): TObj & { id: string } /* not need to specify */ => {
  return {
    ...obj,
    id: '123',
  }
}

const result = addIdToObject<{ firstName: string, lastName: string }>({
  firstName: 'Matt',
  lastName: 'Poe',
})

const result1 = addIdToObject({
  firstName: 'Matt',
  lastName: 'Poe',
})

console.log(result, result1) // they are the same, i do not need to specify the type

// 5
type GetPromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>

type Result1 = Awaited<Promise<string>> // what is awaited? tells em that it return a string promise.
type Result2 = ReturnType<() => string>// return type does the same but for function

// I can combine the two
type ResultCombines = GetPromiseReturnType<
    () => Promise<{
      firstName: string
      lastName: string
    }>
>

// I cannot pass anything to return type. if you check the definition type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any; there is a constraint. that is why we added the extension.
// @ts-expect-error
type Result3 = ReturnType<number>
