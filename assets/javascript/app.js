var owner = document.getElementById('owner').value;
var token = document.getElementById('ghToken').value;
var repo = document.getElementById('repo').value;
var path = document.getElementById('path').value;

console.log('owner', owner)

new Vue({
    el: '#app',
    data: {
        entries: [],
    },
    methods:{
        getData(){

            var route = "https://api.github.com/repos/"+owner+"/"+repo+"/contents/"+path;
            this.$http.get(route).then((response)=>{
                for(var i = 0; i< response.data.length;i++){
                    this.entries.push(response.data[i])
                }
            });
        }
    },
    mounted(){
        this.getData();
    }
});