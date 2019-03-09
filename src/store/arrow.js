import { predicate, Table } from '@apache-arrow/es2015-esm'

const names = [
  'eu_bbmri_eric_collections#4dc023e6',
  'eu_bbmri_eric_collecti#4dc023e6_materials',
  'eu_bbmri_eric_biobanks#f23d3e53'
]

const getTable = (name) => fetch(`/data/${encodeURIComponent(name)}/arrow`)
  .then(res => res.arrayBuffer())
  .then(buffer => Table.from(new Uint8Array(buffer)))

let tables
export const loadingPromise = Promise.all(names.map(getTable)).then(resolvedTables => {
  tables = resolvedTables
  return false
})

const getCollectionIds = (materialIds, matsTable) => {
  if (materialIds.length === 0) {
    return null
  }
  const matPred = predicate.or(
    materialIds.map(id => predicate.col('materials').eq(id)))
  const filteredTable = matsTable.filter(matPred)
  const result = []
  let id
  filteredTable.scan((idx) => {
    result.push(id(idx))
  }, (batch) => {
    id = predicate.col('id').bind(batch)
  })
  return result
}

const collectionTableToJson = (table) => {
  const result = []
  let name, acronym, country
  table.scan((idx) => result.push({
    name: name(idx),
    acronym: acronym(idx),
    country: country(idx)
  }), (batch) => {
    name = predicate.col('name').bind(batch)
    acronym = predicate.col('acronym').bind(batch)
    country = predicate.col('country').bind(batch)
  })
  return result
}

const getCollections = (tableParam, collectionIds, countries) => {
  let filters = []
  if (collectionIds !== null) {
    filters.push(predicate.or(collectionIds.map(id => predicate.col('id').eq(id))))
  }
  if (countries.length > 0) {
    filters.push(predicate.or(countries.map(country => predicate.col('country').eq(country))))
  }
  let table = tableParam
  if (filters.length > 0) {
    table = table.filter(predicate.and(...filters))
  }
  return collectionTableToJson(table)
}

export const filteredCollections = (materialIds, countries) => {
  const [cols, mats] = tables
  const collectionIds = getCollectionIds(materialIds, mats)
  return getCollections(cols, collectionIds, countries)
}
