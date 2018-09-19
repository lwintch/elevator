import eventManager from './event-manager';

/*
 * Currently only supporting 1 building.  We could add more buildings
 *   if we really wanted to scale / exercise this.  We may be better off
 *   using a multi-process technique (horizontal scaling) in this case.
 * It may make troubleshooting easier, but this design could allow for
 *   multiple buildings easily.
 */
export class PositionController {
    building = null; // could be an array.
    positions = {}; // could be indexed by building id => floors, elevator

    // a dual linked list would be good for the position map to provide a
    //   lookup by floor or by elevator.  it would answer the following 
    //   questions:
    //      1) Where is elevator with id 'x'.
    //      2) Which elevator is servicing floor 'y'.


    constructor(){
        // a constructor is not necessary here.  this service should
        //  add the modification of parameters at runtime.  any work
        //  here does not need to be operational, but could be for
        //  diagnostics or special cases of operation.
    }


    getBuilding(){ return this.building; }
    setBuilding(building){ this.building = building; }


}

export default PositionController;