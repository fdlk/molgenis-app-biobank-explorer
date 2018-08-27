import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import {
  SET_BIOBANK_REPORT,
  SET_COLLECTION_TYPES,
  SET_COUNTRIES,
  SET_DATA_TYPES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_MATERIALS,
  SET_STANDARDS
} from './mutations'
import { BIOBANK_API_PATH, COLLECTION_ATTRIBUTE_SELECTOR } from '../client/biobank-client'

/* ACTION CONSTANTS */
export const GET_COUNTRY_OPTIONS = '__GET_COUNTRY_OPTIONS__'
export const GET_MATERIALS_OPTIONS = '__GET_MATERIALS_OPTIONS__'
export const GET_STANDARDS_OPTIONS = '__GET_STANDARDS_OPTIONS__'
export const GET_TYPES_OPTIONS = '__GET_TYPES_OPTIONS__'
export const GET_DATA_TYPE_OPTIONS = '__GET_DATA_TYPE_OPTIONS__'
export const QUERY_DIAGNOSIS_AVAILABLE_OPTIONS = '__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__'
export const GET_ALL_BIOBANKS = '__GET_ALL_BIOBANKS__'
export const GET_BIOBANK_IDENTIFIERS = '__GET_BIOBANK_IDENTIFIERS__'
export const MAP_QUERY_TO_STATE = '__MAP_QUERY_TO_STATE__'
export const GET_BIOBANK_REPORT = '__GET_BIOBANK_REPORT__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'

/* API PATHS */
const STANDARDS_API_PATH = '/api/v2/eu_bbmri_eric_lab_standards'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const COLLECTION_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_collection_types'
const DATA_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_data_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'

export default {
  /**
   * Filter actions, used to retrieve country, standards, and materials data on the beforeCreate phase of the Vue component
   * diagnosis_available is queried asynchronously when an option is being searched for.
   */
  [GET_DATA_TYPE_OPTIONS] ({commit}) {
    api.get(DATA_TYPES_API_PATH).then(response => {
      commit(SET_DATA_TYPES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_TYPES_OPTIONS] ({commit}) {
    api.get(COLLECTION_TYPES_API_PATH).then(response => {
      commit(SET_COLLECTION_TYPES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_COUNTRY_OPTIONS] ({commit}) {
    api.get(COUNTRY_API_PATH).then(response => {
      commit(SET_COUNTRIES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_MATERIALS_OPTIONS] ({commit}) {
    api.get(MATERIALS_API_PATH).then(response => {
      commit(SET_MATERIALS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_STANDARDS_OPTIONS] ({commit}) {
    api.get(STANDARDS_API_PATH).then(response => {
      commit(SET_STANDARDS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [QUERY_DIAGNOSIS_AVAILABLE_OPTIONS] ({commit}, query) {
    if (query) {
      api.get(`${DISEASE_API_PATH}?q=label=q=${query},id=q=${query},code=q=${query}`).then(response => {
        commit(SET_DIAGNOSIS_AVAILABLE, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
    } else {
      commit(SET_DIAGNOSIS_AVAILABLE, [])
    }
  },
  [MAP_QUERY_TO_STATE] ({state, dispatch, commit}) {
    if (Object.keys(state.route.query).length > 0) {
      if (state.route.query.diagnosis_available) {
        const diseaseTypeIds = state.route.query.diagnosis_available.split(',')

        api.get(`${DISEASE_API_PATH}?q=code=in=(${diseaseTypeIds})`).then(response => {
          commit(MAP_QUERY_TO_STATE, response.items)
        })
      } else {
        commit(MAP_QUERY_TO_STATE)
      }
    }
  },
  [GET_BIOBANK_REPORT] ({commit}, biobankId) {
    api.get(`${BIOBANK_API_PATH}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector('bio')},contact(*),*&q=id==${biobankId}`).then(response => {
      commit(SET_BIOBANK_REPORT, response)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  [SEND_TO_NEGOTIATOR] ({state, getters, commit}) {
    const options = {
      body: JSON.stringify(helpers.createNegotiatorQueryBody(state, getters, helpers.getLocationHref()))
    }
    api.post('/plugin/directory/export', options)
      .then(helpers.setLocationHref, error => commit(SET_ERROR, error))
  }
}
