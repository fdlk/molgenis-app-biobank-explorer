<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12">
          <result-header></result-header>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <collections></collections>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .biobank-explorer-container {
    padding-top: 1rem;
  }
</style>

<script>
  import Collections from './cards/Collections'
  import FilterContainer from './filters/FilterContainer'
  import ResultHeader from './ResultHeader'
  import { mapGetters, mapActions } from 'vuex'

  import { GET_QUERY } from '../store/actions'

  export default {
    name: 'biobank-explorer-container',
    components: {
      FilterContainer,
      ResultHeader,
      Collections
    },
    computed: {
      ...mapGetters(['rsql'])
    },
    methods: {
      ...mapActions({
        getQuery: GET_QUERY
      })
    },
    mounted () {
      this.getQuery()
    }
  }
</script>
