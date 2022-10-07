class Tile {
    constructor(id, column) {
        this.id = id;
        this.column = column;
        this.element = document.getElementById(id);
    }
    fillTile(newKey) {
        this.element.value = newKey;
    }
}

class Tiles {
    constructor(tiles) {
        this.tiles = tiles;
    }
    getTileDataFromID(ID) {
        return this.tiles[ID];
    }
}

class Row {
    constructor(id) {
        this.id = id;
        this.tiles = new Tiles(this.getTilesInRow())
    }
    getTilesInRow() {
        
    }
}