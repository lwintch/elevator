export const FLOOR_CALL_REQUEST_PREFIX = 'FLOOR_CALL_REQUEST';
export const ELEVATOR_SERVICE_CALL_PREFIX = 'ELEVATOR_SERVICE_CALL';

function topicExists(topics = {}, topic = ''){
    // note: topic is a possible meaningless value, but it is operable.  
    //  we should throw exceptions when we want to and avoid data typing
    //  errors when possible. 

    return !!topics[topic];

}

// coding style - lowercase 'eventManager' as it is already instantiated (iife).
// note: there will only be one instance of these in the application, intentionally.
export const eventManager = (function(){
    let topics = {};

    return {
        topicExists: (topic) => {
            return topicExists(topics, topic);
        },
        subscribe: (topic, listeners) => {
            if (!topicExists(topics, topic)){
                topics[topic] = [];
            }

            const index = topics[topic].push(topic) -1;

            return {
                // note: adding a remove subscription handler in case the
                //  consumer would like to handle subscriptions as objects.
                remove: () => {
                    try{
                        // this is probably overkill, but it is nice to report
                        //   success or failure.
                        delete topics[topic][index];

                        return true;

                    } catch (err){
                        // console.error is not always available.  a logger would
                        //  fill this role better.
                        (console.error || console.log)(`Unable to delete subscription to topic ${topic}`);

                        return false;
                    }
                }
            }
        },
        publish: (topic, data) => {
            if (!topicExists(topics, topic)){
                // todo: add a logger.
                (console.error || console.log)(`Unable to call listener for subscription to topic ${topic}. It does not exist!`);

                return;
            }

            // unnecessary return, but this may be more readable as an early return was used above.
            // the use of 'apply' is likely not necessary.  I only use in case I'm working with
            //   others who really like to use the 'this' keyword.  Professional courtesy?
            //   In this case, this would reference the data value given, and would also be passed as
            //     the first argument to the listener called.  It supports multiple coding styles for
            //     when others use my code.
            return topics[topic].forEach( listener => listener.apply(data || null, [data]));

        }

    }

})();

export default eventManager;