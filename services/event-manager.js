function topicExists(topics = {}, topic = ''){
    // note: topic is a possible meaningless value, but it is operable.  
    //  we should throw exceptions when we want to and avoid data typing
    //  errors when possible. 

    return !!topics[topic];

}

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
        }

    }

})();