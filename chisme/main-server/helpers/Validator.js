import validator from "validator";

class Validator{
    /**
     * The validator library is an object not a class. So to extend the functionality of the library to our
     * custom made validator we need to point an object to the library. We now have access to all the 
     * functions and properties associated with the validator library.
     */
    static validatorMethods = {
        validator: validator
    }
    /**
     * A method where it checks if the given string will be an appropriate for any api by checking if it is empty or undefined.
     * @param {String} field A string where it will be check if it's either undefined or an empty string.
     * @returns {Boolean} Returns a boolean indicating if it passed validation.
     */
     static validateField = (field) => {
        if(field === undefined) return false;
        if(field === "") return false;
        return true;
    }
    /**
     * A method where it checks each property of an object if it meets the criteria for being consumed by an api.
     * @param {Object} fields An object that contains all the fields that we want to validate.
     */
    static validateAllFields = (fields, res) => {
        for(var property in fields){
            const isFieldValid = this.validateField(fields[property]);
            if(isFieldValid === false) return [false, property]
        }
        return [true, "passed"];
    }
    /**
     * After passing validateAllFields, we check the value it returns.
     * @param {*} result The result comes from the validation of all fields. Returns an array with bool and a string of passed or the property the failed validation.
     * @param {*} fieldName The name of the object we are trying to set the fields to. For example the user will be a new key in req which will show the value.
     * @param {*} fields The validated values
     * @param {*} req The request object, so we can set the fieldName
     * @param {*} res The response object, so we can set an error if the validation has failed.
     * @param {*} next We call next to carry one. If all passes we want the middleware to carry on with the rest of functions in the router. 
     */
    static validateInput(result, fieldName, fields, req, res, next){
        let passed = result[0];
        if(passed){
            console.log("All fields passed validation");
            req[fieldName] = fields;
            next();
        }else{
            const property = result[1];
            console.log(`Please enter ${property}`);
            res.status(404).send(`Please enter ${property}`);
        }
    }
}

export default Validator;