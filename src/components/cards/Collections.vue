<template>
  <div class="collections">
    <div v-if="(!loading) && (collections && collections.length > 0)">
      <table class="table table-sm">
        <thead>
          <tr><th>Name</th><th>Acronym</th><th>Country</th></tr>
        </thead>
        <tbody>
          <tr
            v-for="collection in collections"
            :key="collection.id">
            <td>{{collection.name}}</td>
            <td>{{collection.acronym}}</td>
            <td>{{collection.country}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="loading" class="status-text">
      <h4>Loading Collections... <i class="fa fa-spinner fa-pulse"></i></h4>
    </div>

    <div v-else class="status-text">
      <h4>No collections were found</h4>
    </div>


  </div>
</template>

<style>
  .status-text {
    text-align: center;
    justify-content: center;
    padding: 1rem;
  }

  .collections {
    width: 100%;
  }
</style>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import { SET_LOADING } from '../../store/mutations'
  import { loadingPromise } from '../../store/arrow'

  export default {
    name: 'collections',
    data () {
      return {
        currentPage: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapGetters(['collections']),
      ...mapState(['loading'])
    },
    methods: {
      ...mapMutations({
        setLoading: SET_LOADING
      })
    },
    beforeCreate () {
      loadingPromise.then(() => this.setLoading(false))
    }
  }
</script>
