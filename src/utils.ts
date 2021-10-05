// https://stackoverflow.com/a/66685726
// It does not support Map nor Set
// - a Set could be converted to an array: [...Set()]
// - a Map will need another workaround using a revival function in JSON.parse()
//   https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
export const stringifySort = (_: any, value: any) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  return Object.keys(value)
    .sort()
    .reduce((obj: any, key: any) => ((obj[key] = value[key]), obj), {})
}

{
  // Other functions that could be used to order the object keys:
  const iterations = 1000000
  const example = {
    c: [{a: 1}, {b: 2}, {c: 3}],
    a: 3,
    j: ['something', true, {z: 3, f: false, b: {k: 4, e: 'more'}}],
    f: [{b: 2}, {a: 1}, {c: 3}],
    f2: {b: {b: 2}, a: {a: 1}, c: {c: 3}},
    n: {
      b: {
        c: {d: false, a: true},
        a: {r1: '', r0: []},
      },
      a: 4,
    },
  }

  const replacer = (key, value) =>
    value instanceof Object && !(value instanceof Array)
      ? Object.keys(value)
          .sort()
          .reduce((sorted, key) => {
            sorted[key] = value[key]
            return sorted
          }, {})
      : value

  function normalize(sortingFunction?: any) {
    return function (key: any, value: any) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        return Object.entries(value)
          .sort(sortingFunction || undefined)
          .reduce((acc, entry) => {
            acc[entry[0]] = entry[1]
            return acc
          }, {})
      }
      return value
    }
  }

  function sortObject(obj, arraySorter = undefined) {
    if (typeof obj !== 'object') return obj
    if (Array.isArray(obj)) {
      if (arraySorter) {
        obj.sort(arraySorter)
      }
      for (var i = 0; i < obj.length; i++) {
        obj[i] = sortObject(obj[i], arraySorter)
      }
      return obj
    }
    var temp = {}
    var keys = []
    for (var key in obj) keys.push(key)
    keys.sort()
    for (var index in keys) temp[keys[index]] = sortObject(obj[keys[index]], arraySorter)
    return temp
  }

  function JSONstringifyOrder(obj, space = undefined) {
    var allKeys = []
    var seen = {}
    JSON.stringify(obj, function (key, value) {
      if (!(key in seen)) {
        allKeys.push(key)
        seen[key] = null
      }
      return value
    })
    allKeys.sort()
    return JSON.stringify(obj, allKeys, space)
  }

  function sort(o: any): any {
    if (null === o) return o
    if (undefined === o) return o
    if (typeof o !== 'object') return o
    if (Array.isArray(o)) {
      return o.map(item => sort(item))
    }
    const keys = Object.keys(o).sort()
    const result = <any>{}
    keys.forEach(k => (result[k] = sort(o[k])))
    return result
  }

  /*
  console.time('Function: replacer')
  for (let i = 0; i < iterations; i++) {
    JSON.stringify(example, replacer, 2)
  }
  console.timeEnd('Function: replacer')


  console.time('Function: normalize')
  for (let i = 0; i < iterations; i++) {
    JSON.stringify(example, normalize(), 2)
  }
  console.timeEnd('Function: normalize')


  console.time('Function: sortObject')
  for (let i = 0; i < iterations; i++) {
    JSON.stringify(sortObject(example), null, 2)
  }
  console.timeEnd('Function: sortObject')


  console.time('Function: JSONstringifyOrder')
  for (let i = 0; i < iterations; i++) {
    JSONstringifyOrder(example, 2)
  }
  console.timeEnd('Function: JSONstringifyOrder')


  console.time('Function: ')
  for (let i = 0; i < iterations; i++) {
    JSON.stringify(sort(example), null, 2)
  }
  console.timeEnd('Function: ')
  */
}
