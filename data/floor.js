
export class Floor {
    id = 0;
    isActive = true;
    name = '';
    hasActiveCallRequest = false;

    constructor({ id = 0, isActive = true, name = '' }){
        this.id = id;
        this.isActive = isActive;
        this.name = name;

        // todo: warn on non natural number value.
    }

    isActive(){ return this.isActive; }
    setIsActive(isActive){
        // todo: broadcast to event manager that our serviceable status has changed.

        this.isActive = isActive;
    }

    getId(){ return this.id; }
    getName(){ return this.name; }

    hasActiveCallRequest(){ return this.hasActiveCallRequest; }
    setHasActiveCallRequest(hasActiveCallRequest){ this.hasActiveCallRequest = hasActiveCallRequest; }


    // not implementing setters for other params to follow a simple immutability pattern.

}

export default Floor;