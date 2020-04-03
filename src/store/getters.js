import { createRSQLQuery, filterCollectionTree } from './helpers'
import _ from 'lodash'

export default {
  loading: state => !(state.allBiobanks && state.collectionIds),
  biobanks: (state, getters) => getters.loading ? [] : _.sortBy(
    state.allBiobanks
      .map(biobank => ({...biobank}))
      .map((biobank) => {
        biobank.collections = filterCollectionTree(state.collectionIds, biobank.collections)
        return biobank
      })
      .filter(biobank => biobank.collections.length > 0),
    'name'),
  rsql: createRSQLQuery,
  getCountryOptions: state => state.country.options,
  getMaterialOptions: state => state.materials.options,
  getCollectionQualityOptions: state => state.collection_quality.options,
  getBiobankQualityOptions: state => state.biobank_quality.options,
  getTypesOptions: state => state.type.options,
  getDataTypeOptions: state => state.dataType.options,
  getDiagnosisAvailableOptions: state => state.diagnosis_available.options,
  showCountryFacet: state => state.showCountryFacet,
  getCovid19Options: state => state.covid19.options,
  /**
   * Get map of active filters
   */
  getActiveFilters: state => {
    const activeFilters = {}
    if (state.diagnosis_available.filters.length > 0) {
      activeFilters.diagnosis_available = state.diagnosis_available.filters
    }

    if (state.materials.filters.length > 0) {
      activeFilters.materials = state.materials.options.filter(option => state.materials.filters.includes(option.id))
    }

    if (state.country.filters.length > 0) {
      activeFilters.country = state.country.options.filter(option => state.country.filters.includes(option.id)).map(filter => {
        return {
          id: filter.id,
          label: filter.name
        }
      })
    }

    if (state.collection_quality.filters.length > 0) {
      activeFilters.collection_quality = state.collection_quality.options.filter(option => state.collection_quality.filters.includes(option.id))
    }

    if (state.biobank_quality.filters.length > 0) {
      activeFilters.biobank_quality = state.biobank_quality.options.filter(option => state.biobank_quality.filters.includes(option.id))
    }

    if (state.type.filters.length > 0) {
      activeFilters.type = state.type.options.filter(option => state.type.filters.includes(option.id))
    }

    if (state.dataType.filters.length > 0) {
      activeFilters.dataType = state.dataType.options.filter(option => state.dataType.filters.includes(option.id))
    }
    if (state.covid19.filters.length > 0) {
      activeFilters.covid19 = state.covid19.options.filter(option => state.covid19.filters.includes(option.id))
    }

    return activeFilters
  },
  getErrorMessage: state => {
    if (!state.error) {
      return undefined
    }
    if (state.error.errors) {
      return state.error.errors[0].message
    }
    if (state.error.message) {
      return state.error.message
    }
    return 'Something went wrong'
  }
}
