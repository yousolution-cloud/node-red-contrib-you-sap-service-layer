
function VerifyErrorSL (node, msg, response, consentEmpty=false) {
    if (!response.hasOwnProperty("success") && !response.hasOwnProperty("error") && !Object.keys(response).length && !consentEmpty) {  // Error Generic
        msg.payload = response;
        node.error('Not Valid Requests', msg)
        node.status({ fill: 'red', shape: 'dot', text: 'Not Valid  Requests' });
    }
    else if(response.hasOwnProperty("error")){ //Error ServiceLayer
        if(response.error.hasOwnProperty('message')){
            if(response.error.message.hasOwnProperty('value')) {
                msg.payload = response;
                node.error(response.error.message.value, msg)
                node.status({ fill: 'red', shape: 'dot', text: response.error.message.value });
            }
            else {
                msg.payload = response;
                node.error(response.error.message , msg)
                node.status({ fill: 'red', shape: 'dot', text: response.error.message });
            }
        }
        else {
            msg.payload = response;
            node.error(response.reason , msg)
            node.status({ fill: 'red', shape: 'dot', text: JSON.stringify(response) });
        }

    }
    else { // OK Response 
        return response;
    }


}
 


module.exports = {
    VerifyErrorSL: VerifyErrorSL,
};