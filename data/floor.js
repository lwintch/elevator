import eventManager, { FLOOR_CALL_REQUEST_PREFIX } from '../services/event-manager';


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

    makeTopicName(){
        return `${FLOOR_CALL_REQUEST_PREFIX}-${this.id}`;
    }

    makeCallRequest(){
        this.hasActiveCallRequest = true;

        eventManager.publish(this.makeTopicName(), true);
    }


    // not implementing setters for other params to follow a simple immutability pattern.

}

export default Floor;