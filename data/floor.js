
export class Floor {
    id = 0;
    isActive = true;
    name = '';

    constructor({ id = 0, isActive = true, name = '' }){
        this.id = id;
        this.isActive = isActive;
        this.name = name;

        // todo: warn on non natural number value.
    }

    setIsActive(isActive){
        // todo: broadcast to event manager that our serviceable status has changed.

        this.isActive = isActive;
    }
}

export default Floor;