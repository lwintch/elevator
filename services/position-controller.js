import eventManager from './event-manager';

/*
 * Currently only supporting 1 building.  We could add more buildings
 *   if we really wanted to scale / exercise this.  We may be better off
 *   using a multi-process technique (horizontal scaling) in this case.
 * It may make troubleshooting easier, but this design could allow for
 *   multiple buildings easily.
 */
export class PositionController {
    // could be an array.
    // building = null;

    elevators = {};
    floors = {};

    // will be iterating over floors to get service calls.  this isn't
    //  as efficient as it could be, but is less prone to calculation
    //  errors and race conditions.

    // could be indexed by building id => floors, elevator
    operationalRecord = {
        serviceableFloors: new Set(),  // ensure uniqueness.  there are a bunch of ways to do that.
        serviceableElevators: new Set(),
    }; 

    // could be an array where the indexes are keys, but i like meaningful keys.
    positions = {
        byElevator: {},
        byFloor: {}        
    };

    serviceRecords: [];  // todo: future feature

    // a dual linked list would be good for the position map to provide a
    //   lookup by floor or by elevator.  it would answer the following 
    //   questions:
    //      1) Where is elevator with id 'x'.
    //      2) Which elevator is servicing floor 'y'.


    /*  Rules of operation
     *  
     *  * lowest floor is 1.
     *  * highest floor is the upper limit. (no booster rockets or otherwise flying boxes for elevators).
     *  * every elevator will publish a move event upon moving.
     *  * every elevator will publish a door action event upon open/close of doors.
     * 
     */


    constructor(){
        // a constructor is not necessary here.  this service should
        //  add the modification of parameters at runtime.  any work
        //  here does not need to be operational, but could be for
        //  diagnostics or special cases of operation.
    }


    getBuilding(){ return this.building; }
    setBuilding(building){ this.building = building; }

    addFloorToService(floor){
        this.floors[floor.getId()] = floor;

        floor.isActive() && 
        !this.operationalRecord.serviceableFloors.has(floor.getId()) &&
        this.operationalRecord.serviceableFloors.add(floor.getId());

        // add subscription for call requests
        const topicName = floor.makeTopicName();

        eventManager.subscribe(topicName, );

    }

    removeFloorFromService(floor){
        floor.setIsActive(false);

        this.operationalRecord.serviceableFloors.has(floor.getId()) &&
        this.operationalRecord.serviceableFloors.delete(floor.getId()); // could use serviceableFloors['delete'] if there is a need for safety (eg IE).
    }

    addElevatorToService(elevator){
        this.elevators[elevator.getId()] = elevator;

        !elevator.isInRepairMode() && 
        !this.operationalRecord.serviceableElevators.has(elevator.getId()) &&
        this.operationalRecord.serviceableElevators.add(elevator.getId());
    }

    removeElevatorFromService(elevator){
        elevator.setIsInRepairMode(true);
        
        this.operationalRecord.serviceableElevators.has(elevator.getId()) &&
        this.operationalRecord.serviceableElevators.delete(elevator.getId());
    }



}

export default PositionController;