
/** 表格混入 */
export default {
    data(){
        return{
        }
    },
    methods:{
        _search(ref='table'){
            this.$refs[ref] && this.$refs[ref].loadData(true)
        },
        _reset(ref = 'table'){
            this.params = {}
            this._search(ref)
        }
    }
}