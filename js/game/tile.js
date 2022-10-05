function tile(element) {
    this.active = true;
    this.element = element;
}
tile.prototype.getState = function(){
    return this.active;
}
tile.prototype.getElement = function(){
    return this.element;
}
tile.prototype.fillTile = function(char){
    this.element.innerHTML = char; 
}