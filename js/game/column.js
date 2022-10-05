class column extends tile{
    constructor(id){
        this.active = false;
        this.id = id;
    }
    toString(){
        return (`${super.toString()},Student ID: ${this.id}`);
    }
}