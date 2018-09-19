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
    subscriptions = {};

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
        const controller = this; // could use 'self', but it is a keyword in es6+.

        controller.subscriptions[topicName] = eventManager.subscribe(topicName, ()=>{
            controller.serviceFloor(floor);
        });
    }

    removeFloorFromService(floor){
        floor.setIsActive(false);

        this.operationalRecord.serviceableFloors.has(floor.getId()) &&
        this.operationalRecord.serviceableFloors.delete(floor.getId()); // could use serviceableFloors['delete'] if there is a need for safety (eg IE).

        this.subscriptions[floor.makeTopicName()].remove();
    }

    addElevatorToService(elevator){
        this.elevators[elevator.getId()] = elevator;

        !elevator.isInRepairMode() && 
        !this.operationalRecord.serviceableElevators.has(elevator.getId()) &&
        this.operationalRecord.serviceableElevators.add(elevator.getId());

        const topicName = elevator.makeTopicName();
        const controller = this;

        this.subscriptions[topicName] = eventManager.subscribe(topicName, ()=>{
            controller.removeElevatorFromService(elevator);
        });
    }

    removeElevatorFromService(elevator){
        elevator.setIsInRepairMode(true);
        
        this.operationalRecord.serviceableElevators.has(elevator.getId()) &&
        this.operationalRecord.serviceableElevators.delete(elevator.getId());

        this.subscriptions[elevator.makeTopicName()].remove();
    }

    serviceFloor(floor){
        // todo: warn and return if the floor requested is < 1 or > top floor.
        // todo: after finding the elevator to move, ensure doors are closed 
        //   and publish that it is moving.
        // todo: after the elevator reaches this floor, open the doors.


        /*
         * There are a few algorithms that make sense for this.  The best one 
         *   would be a weighted graph built with a breadth then depth search.
         * Luckily there is a relationship between the each floor and the number
         *   of elevators in service.  This algorithm can get tricky, but is easy
         *   enough if you can find a max limit between elevators with respect to 
         *   the calling floor.
         * To find the elevators within the shortest distance:
         *   - Find all working elevators currently unoccupied, starting from the 
         *       origin of the service call, alternating between above and below.
         *   - Could be asynchronous.  This is a simple search for the most likely
         *     elevator to service.  A backup could be found in case the elevator 
         *     chosen breaks or is on trip 99.  Could also pre filter elevators that
         *     are on trip 99.
         *   
         * Set and publish the necessary arguments and events that describe the floor
         *   is being serviced and the elevator is in transit.
         * 
         * On doors open for the target floor, remove events and reset that elevator 
         *   and floor to an initial state.
         *   Remove from position map and add a service record.
         */
    }

    serviceElevator(elevator){
        /*
         * Set the elevator to inRepairMode and take it out of rotation.
         * This should probably be a managed event that is broadcast from the
         *   elevator on trip 100.
         * 
         * Remove from position map and add a service record.
         */
    }

    resetElevator(elevator){
        // add elevator to service.
    }

    resetFloor(floor){
        // add floor to service.
    }

    // closest serviceable elevator
    findClosesElevatorToFloor(floor){
        let choices = this.findElevatorsByFloor(floor);
        let testHigherFloor = true; // really position
        let floorModifierValue = 1;
        let timesModifierTried = 1; // these 3 variables (above) are begging for a refactor.
        let cap = Object.keys(this.floors).length;
        let i = 0;

        while (!choices && i < cap){
            if (timesModifierTried > 1){
                timesModifierTried = 1;
                floorModifierValue++;
                testHigherFloor = !testHigherFloor;
            }

            if (testHigherFloor){
                choices = this.findElevatorsByFloor(floor + floorModifierValue);
            } else {
                choices = this.findElevatorsByFloor(floor - floorModifierValue);
            }

            timesModifierTried++; // could use i % 2? risky, but simpler.
            i++;
        }

        return choices;


        // This is untested, but the idea is to spiral query each floor for a list
        //  of available elevators beginning at the floor where the call request
        //  was made.  This was the fastest simple algorithm I could think of within
        //  the time constraints.
    }

    findElevatorsByFloor(floor){
        return this.positions.byFloor[floor.getId()];
    }


}

export default PositionController;