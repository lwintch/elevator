import { ELEVATOR_SERVICE_CALL_PREFIX } from "../services/event-manager";


export class Elevator {
    id = 0;
    position = 0;
    name = 0;
    areDoorsOpen = false;
    isInRepairMode = false;
    tripsMade = 0;

    constructor({ id = 0, name = '', position = 0 }){
        this.id = id;
        this.name = name;
        this.position = position;

        // assumption that the doors will never start open.  may not
        //  be a good one, in case we want to instantiate a broken
        //  elevator?

        // assumption that the elevator doesn't really care that it
        //  is in transit (unless we need an emergency system).  the
        //  position controller can determine if the elevator is in
        //  transit by the doors being closed (except in case of mal-
        //  function) and a call request being made that has not been
        //  fulfilled.


        // todo: warn on non natural number for id and/or position.
        // todo: warn on empty value for name.
    }

    makeTopicName(){ return `${ELEVATOR_SERVICE_CALL_PREFIX}-${this.id}`; }

    getId(){ return this.id; }

    getPosition(){ return this.position; }
    setPosition(position){ this.position = position; }

    getName() { return this.name; }

    areDoorsOpen(){ return this.areDoorsOpen; }
    setAreDoorsOpen(areDoorsOpen = false){ this.areDoorsOpen = areDoorsOpen; }

    isInRepairMode(){ return this.isInRepairMode; }
    setIsInRepairMode(repairMode = false){ this.isInRepairMode = repairMode; }

    getTripsMade(){ return this.tripsMade; }
    addTrip(){ this.tripsMade++; }
    
    // Not adding a setter for name nor id, to use an immutability pattern.
    //  Possible downside is that history for the elevator could be lost or
    //  collide with another elevator.  Could be remedied by creating a 
    //  unique id for a history collection.  Overkill, but might be handy
    //  for running statistics in case of a weighted algorithm to determine
    //  a shortest path for the system.  Faster service times!

}

export default Elevator;