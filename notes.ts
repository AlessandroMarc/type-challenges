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

class Human {
  name: string = 'Alessandro'
}

// 6 using record to specify type extension
const getKeyWithHighestValue = <TObj extends Record<string, number>>(
  obj: TObj,
): {
  key: keyof TObj
  value: number
} => {
  const keys = Object.keys(obj) as Array<keyof TObj>

  let highestKey: keyof TObj = keys[0]
  let highestValue = obj[highestKey]

  for (const key of keys) {
    if (obj[key] > highestValue) {
      highestKey = key
      highestValue = obj[key]
    }
  }

  return {
    key: highestKey,
    value: highestValue,
  }
}

const resultKey = getKeyWithHighestValue({ a: 1, b: 2, c: 3 })

const key = resultKey.key
const value = resultKey.value

// 7 sometimes you'll need to override the types inside the generic function with an assertion.
const typedObjectKeys = <TObj extends object>(
  obj: TObj,
): Array<keyof TObj> => {
  // @ts-expect-error: I know that it is going to be an array, i convert it as below
  return Object.keys(obj)
}

const correctTypedObjectKeys = <TObj extends object>(
  obj: TObj,
) => {
  return Object.keys(obj) as Array<keyof TObj>
}

const typedResult1 = typedObjectKeys({ name: 'Alessandro', age: 14 })
const typedResult2 = correctTypedObjectKeys({ name: 'Alessandro', age: 14 })

// 8 it is actually returning the type of the value of the specified key. arument key is not treated as a type level but as "a" or "b". We need multiple generics.
const getValue = <TObj>(obj: TObj, key: keyof TObj) => {
  return obj[key]
}

const getValueCorrect = <TObj, TKey extends keyof TObj>(obj: TObj, key: TKey) => {
  return obj[key]
}

const resultingValue = getValue(
  {
    a: 1,
    b: 'some-string',
  },
  'a',
)

const resultingValueCorrect = getValueCorrect(
  {
    a: 1,
    b: 'some-string',
  },
  'a',
)

// 9 default generics
export const createSet = <T = string>() => {
  return new Set<T>()
}

const numberSet = createSet<number>()
const otherStringSet = createSet() // if i do not pass anything it is string

// 10 use generics to link from external libraries
import { z } from 'zod'

const makeZodSafeFetch = <TData>(
  url: string,
  schema: z.Schema<TData>,
): Promise<TData> => {
  return fetch(url).then(res => res.json()).then((res) => {
    return schema.parse(res)
  })
}

// i am repeating, how to improve?
const resultZod = makeZodSafeFetch('/api/endpoint', z.object(
  {
    firstName: z.string(),
    lastName: z.string(),
  },
)).then((res) => {
  console.log(res)
})

export { }
