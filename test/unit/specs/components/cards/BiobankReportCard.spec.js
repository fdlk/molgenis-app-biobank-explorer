/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankReportCard from '@/components/cards/BiobankReportCard'

describe('BiobankReportCard', () => {
  let store
  let mocks
  let stubs
  let biobankReport

  beforeEach(() => {
    biobankReport = {
      data: {
        collections: [],
        contact: {
          first_name: 'first_name',
          last_name: 'last_name',
          email: 'email',
          phone: 'phone',
          address: 'address',
          city: 'city',
          zip: 'zip'
        },
        network: [
          {id: 'n01', name: 'Network 01'},
          {id: 'n02', name: 'Network 02'}
        ],
        country: {
          name: 'name'
        }
      },
      metadata: {}
    }

    store = new Vuex.Store({
      state: {
        isLoading: false,
        biobankReport,
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        '__GET_BIOBANK_REPORT__': () => {}
      }
    })
    mocks = {
      $route: {
        query: 'some-query'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
    expect(wrapper.html()).to.have.string('class="mg-biobank-card container"')
  })

  describe('computed', () => {
    describe('query', () => {
      it('should get query', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.query).to.equal('some-query')
      })
    })

    describe('collectionsData', () => {
      it('should fill collectionsData if available', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.collectionsData).to.deep.equal([])
      })

      it('should return empty array', () => {
        store.state.biobankReport.data = undefined
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.collectionsData).to.deep.equal([])
      })
    })

    describe('contact', () => {
      it('should fill contact', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.contact.email).to.deep.equal({'value': 'email', type: 'email'})
      })

      it('should return empty object', () => {
        store.state.biobankReport.data = undefined
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.contact).to.deep.equal({})
      })
    })

    describe('networks', () => {
      it('should fill networks', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.networks.length).to.equal(2)
      })

      it('should return empty array', () => {
        store.state.biobankReport.data = undefined
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.networks).to.deep.equal([])
      })
    })
  })
})
