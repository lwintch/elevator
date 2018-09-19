
export class Elevator {
    id = 0;
    position = 0;
    name = 0;

    constructor({ id = 0, name = '', position = 0 }){
        this.id = id;
        this.name = name;
        this.position = position;

        // todo: warn on non natural number for id and/or position.
        // todo: warn on empty value for name.
    }


    getId(){ return this.id; }

    getPosition(){ return this.position; }
    setPosition(position){ this.position = position; }

    getName() { return this.name; }
    
    // Not adding a setter for name nor id, to use an immutability pattern.
    //  Possible downside is that history for the elevator could be lost or
    //  collide with another elevator.  Could be remedied by creating a 
    //  unique id for a history collection.  Overkill, but might be handy
    //  for running statistics in case of a weighted algorithm to determine
    //  a shortest path for the system.  Faster service times!

}

export default Elevator;