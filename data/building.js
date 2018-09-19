
export class Building {
    floors = 2;
    elevators = 1;

    constructor({ floors = 2, elevators = 1 }){
        this.floors = floors;
        this.elevators = elevators;
    }

    setFloorLimit(newLimit){
        // todo: broadcast layout change to event manager to resync serviceable floors.

        this.floors = newLimit;
    }

    getFloorLimit(){ return this.floors; }
}


export default Building;